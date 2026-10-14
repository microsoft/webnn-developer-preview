// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
//
// HTDemucs signal processing around the ONNX forward pass: segmenting, STFT / iSTFT,
// pre_forward / post_forward and overlap-add, following the standard HTDemucs configuration
// (num_subbands=1, cac=True and use_train_segment=True).
//

export const SAMPLE_RATE = 44100;
export const SEGMENT_LENGTH = 343980;
export const OVERLAP = 171990;
export const HOP = SEGMENT_LENGTH - OVERLAP;
export const STEM_NAMES = ["drums", "bass", "other", "vocals"];

const FFT_SIZE = 4096;
const STFT_HOP = 1024;
const FREQUENCY_BINS = FFT_SIZE / 2; // Nyquist bin dropped
const TIME_FRAMES = 336;
export const SPECTROGRAM_SHAPE = [1, 4, FREQUENCY_BINS, TIME_FRAMES];
export const WAVEFORM_SHAPE = [1, 2, SEGMENT_LENGTH];
// Demucs reflect-pads (1536, ...) and torch.stft center=True pads (2048, 2048) again; two
// sequential reflect pads differ from one combined pad, so they are applied in order.
const DEMUCS_PAD = (STFT_HOP / 2) * 3;
const CENTER_PAD = FFT_SIZE / 2;
// torch.stft normalized=True scales by 1 / sqrt(n_fft).
const STFT_SCALE = 1 / Math.sqrt(FFT_SIZE);
const NORMALIZE_EPSILON = 1e-5;

// ============================================================================
// Segmenting and overlap-add
// ============================================================================

// Segments start every HOP samples; the last one is zero-padded up to SEGMENT_LENGTH.
export function getSegmentLayout(totalSamples) {
    const count = Math.max(1, Math.ceil((totalSamples - OVERLAP) / HOP));
    const lastPadding = SEGMENT_LENGTH - Math.min(SEGMENT_LENGTH, totalSamples - (count - 1) * HOP);
    return { count, lastPadding };
}

// Planar stereo copy [left, right] of segment `index`, zero-padded past the end of the track.
export function extractSegment(left, right, index) {
    const start = index * HOP;
    const end = Math.min(start + SEGMENT_LENGTH, left.length);
    const segment = new Float32Array(2 * SEGMENT_LENGTH);
    segment.set(left.subarray(start, end), 0);
    segment.set(right.subarray(start, end), SEGMENT_LENGTH);
    return segment;
}

export function createStemBuffers(totalSamples) {
    return Object.fromEntries(
        STEM_NAMES.map(name => [name, { left: new Float32Array(totalSamples), right: new Float32Array(totalSamples) }]),
    );
}

// Triangular crossfade weights for one segment.
export function buildOverlapWeights() {
    const weights = new Float32Array(SEGMENT_LENGTH);
    for (let i = 0; i < SEGMENT_LENGTH; i++) {
        if (i < OVERLAP) weights[i] = (i + 1) / OVERLAP;
        else if (i >= SEGMENT_LENGTH - OVERLAP) weights[i] = (SEGMENT_LENGTH - i) / OVERLAP;
        else weights[i] = 1;
    }
    return weights;
}

// `sources` is one segment's [stem][channel][SEGMENT_LENGTH] output from htdemucsPostForward.
export function addSegmentToStems(stems, weightTotals, sources, weights, startSample) {
    const writeLength = Math.min(SEGMENT_LENGTH, weightTotals.length - startSample);
    STEM_NAMES.forEach((name, stemIndex) => {
        const leftOffset = stemIndex * 2 * SEGMENT_LENGTH;
        const rightOffset = leftOffset + SEGMENT_LENGTH;
        const { left, right } = stems[name];
        for (let i = 0; i < writeLength; i++) {
            left[startSample + i] += sources[leftOffset + i] * weights[i];
            right[startSample + i] += sources[rightOffset + i] * weights[i];
        }
    });
    for (let i = 0; i < writeLength; i++) weightTotals[startSample + i] += weights[i];
}

// Divides out the overlap-add weights over [from, to). Sample i takes nothing from any segment
// after floor(i / HOP), so finalizing a range mid-loop is bit-identical to one pass at the end.
export function finalizeStemRange(stems, weightTotals, from, to) {
    for (const name of STEM_NAMES) {
        for (const channel of [stems[name].left, stems[name].right]) {
            for (let i = from; i < to; i++) {
                if (weightTotals[i] > 0) channel[i] /= weightTotals[i];
            }
        }
    }
}

// Mean absolute error between the summed stems and the original mix; small means overlap-add is correct.
export function computeMixError(stems, left, right) {
    const { drums, bass, other, vocals } = stems;
    let errorTotal = 0;
    for (let i = 0; i < left.length; i++) {
        const sumLeft = drums.left[i] + bass.left[i] + other.left[i] + vocals.left[i];
        const sumRight = drums.right[i] + bass.right[i] + other.right[i] + vocals.right[i];
        errorTotal += Math.abs(sumLeft - left[i]) + Math.abs(sumRight - right[i]);
    }
    return errorTotal / (left.length * 2);
}

// ============================================================================
// FFT
// ============================================================================

function buildHannWindow(size) {
    const hannWindow = new Float32Array(size);
    for (let i = 0; i < size; i++) hannWindow[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / size);
    return hannWindow;
}

function buildFftTwiddles(size) {
    const cosine = new Float32Array(size / 2);
    const sine = new Float32Array(size / 2);
    for (let i = 0; i < size / 2; i++) {
        const angle = (-2 * Math.PI * i) / size;
        cosine[i] = Math.cos(angle);
        sine[i] = Math.sin(angle);
    }
    return { cosine, sine };
}

function buildBitReverseTable(size) {
    const table = new Uint32Array(size);
    const bitCount = Math.log2(size) | 0;
    for (let i = 0; i < size; i++) {
        let reversed = 0;
        let value = i;
        for (let bit = 0; bit < bitCount; bit++) {
            reversed = (reversed << 1) | (value & 1);
            value >>= 1;
        }
        table[i] = reversed;
    }
    return table;
}

const HANN_WINDOW = buildHannWindow(FFT_SIZE);
const FFT_TWIDDLES = buildFftTwiddles(FFT_SIZE);
const FFT_BIT_REVERSE = buildBitReverseTable(FFT_SIZE);
// Scratch buffers shared by every FFT frame.
const FFT_REAL = new Float32Array(FFT_SIZE);
const FFT_IMAGINARY = new Float32Array(FFT_SIZE);

// In-place iterative radix-2 Cooley-Tukey FFT of size FFT_SIZE.
function fftInPlace(real, imaginary) {
    for (let i = 0; i < FFT_SIZE; i++) {
        const j = FFT_BIT_REVERSE[i];
        if (j > i) {
            const swapReal = real[i];
            real[i] = real[j];
            real[j] = swapReal;
            const swapImaginary = imaginary[i];
            imaginary[i] = imaginary[j];
            imaginary[j] = swapImaginary;
        }
    }
    const { cosine, sine } = FFT_TWIDDLES;
    for (let size = 2; size <= FFT_SIZE; size <<= 1) {
        const half = size >> 1;
        const step = FFT_SIZE / size;
        for (let start = 0; start < FFT_SIZE; start += size) {
            for (let k = 0; k < half; k++) {
                const twiddleReal = cosine[k * step];
                const twiddleImaginary = sine[k * step];
                const evenIndex = start + k;
                const oddIndex = evenIndex + half;
                const evenReal = real[evenIndex];
                const evenImaginary = imaginary[evenIndex];
                const oddReal = real[oddIndex];
                const oddImaginary = imaginary[oddIndex];
                const productReal = twiddleReal * oddReal - twiddleImaginary * oddImaginary;
                const productImaginary = twiddleReal * oddImaginary + twiddleImaginary * oddReal;
                real[evenIndex] = evenReal + productReal;
                imaginary[evenIndex] = evenImaginary + productImaginary;
                real[oddIndex] = evenReal - productReal;
                imaginary[oddIndex] = evenImaginary - productImaginary;
            }
        }
    }
}

// ifft(x) = conj(fft(conj(x))) / n; only the real part is produced, since that is all iSTFT reads.
function inverseFftRealInPlace(real, imaginary) {
    for (let i = 0; i < FFT_SIZE; i++) imaginary[i] = -imaginary[i];
    fftInPlace(real, imaginary);
    for (let i = 0; i < FFT_SIZE; i++) real[i] /= FFT_SIZE;
}

// ============================================================================
// STFT / iSTFT
// ============================================================================

function padReflect(signal, padLeft, padRight) {
    const length = signal.length;
    const padded = new Float32Array(padLeft + length + padRight);
    padded.set(signal, padLeft);
    for (let i = 0; i < padLeft; i++) padded[padLeft - 1 - i] = signal[i + 1];
    for (let i = 0; i < padRight; i++) padded[padLeft + length + i] = signal[length - 2 - i];
    return padded;
}

// STFT of one channel into `output` at realOffset / imaginaryOffset, each FREQUENCY_BINS x TIME_FRAMES.
// Matches demucs4ht._spec: reflect pad, torch.stft(center=True, normalized=True), frames [2 : 2 + TIME_FRAMES].
function computeStftChannel(signal, output, realOffset, imaginaryOffset) {
    const demucsPadded = padReflect(signal, DEMUCS_PAD, DEMUCS_PAD + TIME_FRAMES * STFT_HOP - signal.length);
    const centered = padReflect(demucsPadded, CENTER_PAD, CENTER_PAD);
    for (let frame = 0; frame < TIME_FRAMES; frame++) {
        const sampleStart = (frame + 2) * STFT_HOP;
        for (let i = 0; i < FFT_SIZE; i++) {
            FFT_REAL[i] = centered[sampleStart + i] * HANN_WINDOW[i];
            FFT_IMAGINARY[i] = 0;
        }
        fftInPlace(FFT_REAL, FFT_IMAGINARY);
        for (let bin = 0; bin < FREQUENCY_BINS; bin++) {
            output[realOffset + bin * TIME_FRAMES + frame] = FFT_REAL[bin] * STFT_SCALE;
            output[imaginaryOffset + bin * TIME_FRAMES + frame] = FFT_IMAGINARY[bin] * STFT_SCALE;
        }
    }
}

// Spectrogram channels are [real_L, imag_L, real_R, imag_R].
function computeSpectrogram(segment, output) {
    const channelSize = FREQUENCY_BINS * TIME_FRAMES;
    computeStftChannel(segment.subarray(0, SEGMENT_LENGTH), output, 0, channelSize);
    computeStftChannel(segment.subarray(SEGMENT_LENGTH), output, 2 * channelSize, 3 * channelSize);
}

// Inverse of computeStftChannel: torch.istft(normalized=True, center=True) with a Hann window.
// `real` / `imaginary` hold (FREQUENCY_BINS + 1) x frameCount half-spectra; the upper half of each
// frame comes from Hermitian symmetry X[n - k] = conj(X[k]).
function computeIstftChannel(real, imaginary, frameCount) {
    const halfSpectrumBins = FFT_SIZE / 2 + 1;
    const rawLength = (frameCount - 1) * STFT_HOP + FFT_SIZE;
    const accumulated = new Float32Array(rawLength);
    const windowTotals = new Float32Array(rawLength);
    const scale = Math.sqrt(FFT_SIZE); // undoes the forward normalized=True
    for (let frame = 0; frame < frameCount; frame++) {
        for (let bin = 0; bin < halfSpectrumBins; bin++) {
            FFT_REAL[bin] = real[bin * frameCount + frame];
            FFT_IMAGINARY[bin] = imaginary[bin * frameCount + frame];
        }
        for (let bin = 1; bin < FFT_SIZE / 2; bin++) {
            FFT_REAL[FFT_SIZE - bin] = FFT_REAL[bin];
            FFT_IMAGINARY[FFT_SIZE - bin] = -FFT_IMAGINARY[bin];
        }
        inverseFftRealInPlace(FFT_REAL, FFT_IMAGINARY);
        const base = frame * STFT_HOP;
        for (let i = 0; i < FFT_SIZE; i++) {
            const weight = HANN_WINDOW[i];
            accumulated[base + i] += FFT_REAL[i] * weight * scale;
            windowTotals[base + i] += weight * weight;
        }
    }
    for (let i = 0; i < rawLength; i++) {
        if (windowTotals[i] > 1e-8) accumulated[i] /= windowTotals[i];
    }
    // center=True trims FFT_SIZE / 2 from each end.
    return accumulated.subarray(CENTER_PAD, rawLength - CENTER_PAD);
}

// ============================================================================
// pre_forward / post_forward
// ============================================================================

// (values - mean) / (epsilon + std), with the unbiased std that torch.Tensor.std uses.
function normalizeInPlace(values) {
    const count = values.length;
    let sum = 0;
    for (let i = 0; i < count; i++) sum += values[i];
    const mean = sum / count;
    let sumOfSquares = 0;
    for (let i = 0; i < count; i++) {
        const deviation = values[i] - mean;
        sumOfSquares += deviation * deviation;
    }
    const standardDeviation = Math.sqrt(sumOfSquares / (count - 1));
    const scale = 1 / (NORMALIZE_EPSILON + standardDeviation);
    for (let i = 0; i < count; i++) values[i] = (values[i] - mean) * scale;
    return { mean, standardDeviation };
}

// Builds the normalized model inputs `x` (spectrogram) and `xt` (waveform) for one planar stereo
// segment, plus the statistics post_forward needs.
export function htdemucsPreForward(segment) {
    const spectrogram = new Float32Array(4 * FREQUENCY_BINS * TIME_FRAMES);
    computeSpectrogram(segment, spectrogram);
    const spectrogramStats = normalizeInPlace(spectrogram);
    const waveform = segment.slice();
    const waveformStats = normalizeInPlace(waveform);
    return { spectrogram, waveform, spectrogramStats, waveformStats };
}

// Turns the model outputs `x_out` [1, 16, F, T] and `xt_out` [1, 8, SEGMENT_LENGTH] back into
// [stem][channel][SEGMENT_LENGTH] waveforms: de-normalize, iSTFT the spectral branch, add the time branch.
export function htdemucsPostForward(spectrogramOutput, waveformOutput, spectrogramStats, waveformStats) {
    const channelSize = FREQUENCY_BINS * TIME_FRAMES;
    // _ispec pads one zero Nyquist bin and two zero frames on each side.
    const paddedFrames = TIME_FRAMES + 4;
    const real = new Float32Array((FREQUENCY_BINS + 1) * paddedFrames);
    const imaginary = new Float32Array(real.length);
    const sources = new Float32Array(STEM_NAMES.length * 2 * SEGMENT_LENGTH);
    for (let stem = 0; stem < STEM_NAMES.length; stem++) {
        for (let channel = 0; channel < 2; channel++) {
            // x_out channels per stem are [real_L, imag_L, real_R, imag_R].
            const realOffset = (stem * 4 + channel * 2) * channelSize;
            const imaginaryOffset = realOffset + channelSize;
            real.fill(0);
            imaginary.fill(0);
            for (let bin = 0; bin < FREQUENCY_BINS; bin++) {
                for (let frame = 0; frame < TIME_FRAMES; frame++) {
                    const source = bin * TIME_FRAMES + frame;
                    const target = bin * paddedFrames + frame + 2;
                    real[target] =
                        spectrogramOutput[realOffset + source] * spectrogramStats.standardDeviation +
                        spectrogramStats.mean;
                    imaginary[target] =
                        spectrogramOutput[imaginaryOffset + source] * spectrogramStats.standardDeviation +
                        spectrogramStats.mean;
                }
            }
            const spectralWaveform = computeIstftChannel(real, imaginary, paddedFrames);
            const offset = (stem * 2 + channel) * SEGMENT_LENGTH;
            for (let i = 0; i < SEGMENT_LENGTH; i++) {
                sources[offset + i] =
                    spectralWaveform[DEMUCS_PAD + i] +
                    (waveformOutput[offset + i] * waveformStats.standardDeviation + waveformStats.mean);
            }
        }
    }
    return sources;
}
