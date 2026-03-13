function appendFloat32(arr, val) {
    const out = new Float32Array(arr.length + 1);
    out.set(arr, 0);
    out[arr.length] = val;
    return out;
}

function linspace(start, end, num) {
    const out = new Float32Array(num);
    if (num === 1) {
        out[0] = start;
        return out;
    }
    const step = (end - start) / (num - 1);
    for (let i = 0; i < num; i++) {
        out[i] = start + step * i;
    }
    return out;
}

// Scheduler class
class Scheduler {
    constructor() {
        // config
        this.num_train_timesteps_ = 1000;
        this.shift_ = 3.0;
        this.num_inference_steps_ = null;
        this.step_index_ = null;

        // sigmas: np.linspace(1, self.num_train_timesteps_, self.num_train_timesteps_)[::-1]
        const timestepsRev = linspace(1, this.num_train_timesteps_, this.num_train_timesteps_).reverse();

        // sigmas = timesteps / self.num_train_timesteps_
        const sigmasTmp = new Float32Array(timestepsRev.length);
        for (let i = 0; i < timestepsRev.length; i++) {
            sigmasTmp[i] = timestepsRev[i] / this.num_train_timesteps_;
        }

        // self.sigmas_ = self.shift_ * sigmas / (1 + (self.shift_ - 1) * sigmas)
        this.sigmas_ = new Float32Array(sigmasTmp.length);
        for (let i = 0; i < sigmasTmp.length; i++) {
            const s = sigmasTmp[i];
            this.sigmas_[i] = (this.shift_ * s) / (1 + (this.shift_ - 1) * s);
        }

        this.sigma_min_ = this.sigmas_[this.sigmas_.length - 1];
        this.sigma_max_ = this.sigmas_[0];
    }

    _sigmaToT(sigma) {
        return sigma * this.num_train_timesteps_;
    }

    setTimesteps(numInferenceSteps) {
        // timesteps = np.linspace(self._sigma_to_t(self.sigma_max_), self._sigma_to_t(self.sigma_min_), num_inference_steps)
        const tStart = this._sigmaToT(this.sigma_max_);
        const tEnd = this._sigmaToT(this.sigma_min_);
        const timesteps = linspace(tStart, tEnd, numInferenceSteps);

        // sigmas = timesteps / self.num_train_timesteps_
        const sigmas = new Float32Array(timesteps.length);
        for (let i = 0; i < timesteps.length; i++) {
            sigmas[i] = timesteps[i] / this.num_train_timesteps_;
        }

        // sigmas = self.shift_ * sigmas / (1 + (self.shift_ - 1) * sigmas)
        for (let i = 0; i < sigmas.length; i++) {
            const s = sigmas[i];
            sigmas[i] = (this.shift_ * s) / (1 + (this.shift_ - 1) * s);
        }

        // self.timesteps_ = sigmas * self.num_train_timesteps_
        this.timesteps_ = new Float32Array(sigmas.length);
        for (let i = 0; i < sigmas.length; i++) {
            this.timesteps_[i] = sigmas[i] * this.num_train_timesteps_;
        }

        // self.sigmas_ = np.append(sigmas, 0.0)
        this.sigmas_ = appendFloat32(sigmas, 0.0);

        this.num_inference_steps_ = numInferenceSteps;
        this.step_index_ = 0;
    }
}

const scheduler = new Scheduler();

function updateScheduler(numInferenceSteps) {
    scheduler.setTimesteps(numInferenceSteps);

    const schedulerTimesteps = scheduler.timesteps_;
    if (numInferenceSteps !== schedulerTimesteps.length) {
        throw new Error("Invalid timesteps.");
    }

    const timesteps = new Float32Array(schedulerTimesteps.length);
    for (let i = 0; i < schedulerTimesteps.length; i++) {
        timesteps[i] = (1000.0 - schedulerTimesteps[i]) / 1000.0;
    }
    timesteps[timesteps.length - 1] = 1.0;
    console.log(`num_inference_steps: ${numInferenceSteps}`);

    return timesteps;
}

export { updateScheduler };
