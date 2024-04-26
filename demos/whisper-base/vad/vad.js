import { lcm } from "./math.js";


export const FRAME_SIZE = {
	8000: [80, 160, 240],
	16000: [160, 320, 480],
	32000: [320, 640, 960],
	48000: [480, 960, 1440],
};


export const VADMode = Object.freeze({
	NORMAL: 0,
	LOW_BITRATE: 1,
	AGGRESSIVE: 2,
	VERY_AGGRESSIVE: 3,
});


export const VADEvent = Object.freeze({
	ERROR: -1,
	SILENCE: 0,
	VOICE: 1,
});


export default async function(binary) {
	const { instance } = await WebAssembly.instantiate(binary);
	const libfvad = instance.exports;

	class VAD {
		constructor(mode, rate) {
			this._destroyed = false;
			this._handle = libfvad.fvad_new();

			if (!this._handle) {
				throw new Error("Memory allocation error: cannot instanciate libfvad");
			}

			if (libfvad.fvad_set_mode(this._handle, mode) < 0) {
				throw new Error(`Invalid mode: ${mode}`);
			}
			this.mode = mode;

			if (libfvad.fvad_set_sample_rate(this._handle, rate) < 0) {
				throw new Error(`Invalid sample rate: ${rate}`);
			}
			this.sampleRate = rate;
		}

		static floatTo16BitPCM(buffer) {
			const output = new Int16Array(buffer.length);
			for (let i = 0; i < buffer.length; i++) {
				let s = Math.max(-1, Math.min(1, buffer[i]));
				output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
			}
			return output;
		}

		getMinBufferSize(bufferSize) {
			const sizes = FRAME_SIZE[this.sampleRate].map((s) => lcm(s, bufferSize));
			return Math.min(...sizes);
		}

		processFrame(frame) {
			if (this._destroyed) {
				throw new Error("This instance is already destroyed");
			}
			if (!FRAME_SIZE[this.sampleRate].includes(frame.length)) {
				throw new Error(`Invalid frame size ${frame.length} for sample rate ${this.sampleRate}`);
			}
			const bytes = frame.length * frame.BYTES_PER_ELEMENT;
			const ptr = libfvad.malloc(bytes);
			const data = new Uint8Array(libfvad.memory.buffer, ptr, bytes);
			data.set(new Uint8Array(frame.buffer));
			const result = libfvad.fvad_process(this._handle, data.byteOffset, frame.length);
			libfvad.free(data.byteOffset);
			return result;
		}

		processBuffer(buffer) {
			if (this._destroyed) {
				throw new Error("This instance is already destroyed");
			}

			const moduli = FRAME_SIZE[this.sampleRate].map((s) => buffer.length % s);
			let frameSize = FRAME_SIZE[this.sampleRate][moduli.indexOf(0)];

			if (!frameSize) {
				frameSize = 480;
			}

			const results = [];
			const frame = new Int16Array(frameSize);
			for (let i = 0; i < buffer.length; i += frameSize) {
				frame.set(buffer.slice(i, i + frameSize));
				results.push(this.processFrame(frame));
			}

			const sum = results.reduce((a, b) => a + b, 0);
			const count = results.filter((v) => v > 0).length;
			// console.log(count, results.length, count/results.length);
			if (!sum) {
				return VADEvent.SILENCE;
			}
			if (results.some((v) => v < 0)) {
				return VADEvent.ERROR;
			}
			if (count >= (results.length * 0.5)) {
				return VADEvent.VOICE;
			}
			return VADEvent.SILENCE;
		}

		destroy() {
			libfvad.fvad_free(this._handle);
			this._handle = null;
			this._destroyed = true;
		}
	}

	return VAD;
}
