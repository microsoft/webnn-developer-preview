const audioDataSize = 128;

class StreamingProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();

        this.minBufferSize = 0;
        this.length = 0; // length of this._streamingBuffer data
        if (options && options.processorOptions) {
            const {
                minBufferSize,
            } = options.processorOptions;

            this.minBufferSize = minBufferSize;
            console.assert(minBufferSize % audioDataSize === 0, `${minBufferSize} % ${audioDataSize} is not 0`);
        }
        this.stopProcessing = false;
        this._streamingBuffer = new Float32Array(this.minBufferSize);

        this.port.onmessage = e => {
            if (e.data.message === 'STOP_PROCESSING') {
                this.stopProcessing = e.data.data;
            }
        };
    }

    process(inputs, outputs, params) {
        if (this.stopProcessing) {
            // Do nothing, suspend the audio processing
        } else {
            // inputs[0][0]'s length is 128
            console.assert(inputs[0][0].length === audioDataSize, `${inputs[0][0].length} is not ${audioDataSize}`);
            this._streamingBuffer.set(inputs[0][0], this.length);
            this.length += inputs[0][0].length;
            // Should publish, clear this._streamingBuffer and this.index
            if (this.length == this.minBufferSize) {
                this.port.postMessage({
                    message: 'START_TRANSCRIBE',
                    buffer: this._streamingBuffer,
                }, [this._streamingBuffer.buffer.slice()]);
                this._streamingBuffer.fill(0);
                this.length = 0;
            }
        }
        return true;
    }
}

registerProcessor('streaming-processor', StreamingProcessor);