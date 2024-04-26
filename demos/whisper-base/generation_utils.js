function random_choice(array, probabilities) {
    const random_value = Math.random();
    let cumulative_probability = 0;

    for (let i = 0; i < probabilities.length; i++) {
        cumulative_probability += probabilities[i];
        if (random_value <= cumulative_probability) {
            return array[i];
        }
    }

    return array[array.length - 1];
}

function filter_top_k(scores, top_k) {
    // Sort logits by score
    let sorted_args = scores.argsort();
    let sorted_scores = scores[sorted_args];
    // Assign -inf to all but the top k prob
    sorted_scores.slice(0, -top_k).fill(Number.NEGATIVE_INFINITY);
    // Get back to the original tensor
    scores.set(sorted_scores, sorted_args);

    return scores;
}

function filter_top_p(scores, top_p) {
    // Sort logits by score
    let sorted_args = scores.argsort();
    let sorted_scores = scores[sorted_args];
    // Compute the cumulative prob
    let cumulative_probs = softmax(sorted_scores).cumsum();
    // Get the index to remove
    let sorted_indices_to_remove = cumulative_probs.le(1 - top_p);
    // Get back to the original tensor
    sorted_scores.masked_fill_(sorted_indices_to_remove, Number.NEGATIVE_INFINITY);
    scores.set(sorted_scores, sorted_args);

    return scores;
}

function sample(scores) {
    // Get the probability
    let probs = softmax(scores);
    // Get the sample index
    let sampled_index = random_choice(Array.from(Array(scores.length).keys()), probs);
    return sampled_index;
}

export function get_new_tokens(logits, dims, do_sample = false, temperature = 1.0, top_p = 1.0, top_k = 50) {
    let scores = [];
    // TODO, remove hardcode
    if (dims[1] == 4) {
        for (let i = 0; i < dims[2]; i++) {
            scores.push(logits[dims[2] * (dims[1] - 1) + i]);
        }
    } else {
        for (let i = 0; i < dims[2]; i++) {
            scores.push(logits[i]);
        }
    }

    if (do_sample) {
        if (top_p < 0 || top_p > 1.0) {
            throw new Error(`"top_p" has to be a float > 0 and < 1, but is ${top_p}`);
        }
        if (top_k < 0) {
            throw new Error(`"top_k" has to be an integer >= 0, but is ${top_k}`);
        }

        // Smooth scores using temperature
        scores = scores.map((score) => score / temperature);

        if (top_k > 0) {
            // Top k filtering
            scores = filter_top_k(scores, top_k);
        }

        if (top_p < 1.0) {
            // Top p filtering
            scores = filter_top_p(scores, top_p);
        }

        // Sample the new token
        const newToken = sample(scores);
        return newToken;
    } else {
        const newToken = scores.indexOf(Math.max(...scores));
        return newToken;
    }
}
