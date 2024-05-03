export function cache_update(decoder_input, past_key_values, inf_iter, max_sequence_length = 448, num_init_tokens = 4, position_ids = 0, data_type = 'float32') {
    const cache_precision = data_type == 'float32' ? Float32Array : Uint16Array;
    // at the output of the first inference model, we perform right padding on kv cache
    if (inf_iter === 0) {
        // perform padding for each attention head
        for (let i = 0; i < 6; i++) {
            // (ONLY NEEDED FOR DECODER KV)
            // for name 'present_key_values.${i}.decoder.key'  [1,8,4,64] and
            // 'present_key_values.${i}.decoder.value' [1,8,4,64]
            // create 0 padding of shape max sequence length - num_init_tokens - 1
            // (default: 4 as kv cache 2nd dim = 4 due to 4 init tokens)
            // -1 added to allow space for new KV items such that after concat op,
            // seq len dim of KV cache is same as max seq len
            // output of decoder non cache is in fp16 precision,
            // so we create the padded KV in same precision
            decoder_input[`past_key_values.${i}.decoder.key`] = new ort.Tensor(data_type, new cache_precision(8 * 127 * 64).fill(0), [1, 8, 127, 64]);
            decoder_input[`past_key_values.${i}.decoder.value`] = new ort.Tensor(data_type, new cache_precision(8 * 127 * 64).fill(0), [1, 8, 127, 64]);
            for (let h = 0; h < 8; h++) {
                for (let d = 0; d < 64; d++) {
                    for (let s = 0; s < 4; s++) {
                        decoder_input[`past_key_values.${i}.decoder.key`].cpuData[h * 64 * 127 + s * 64 + d] =
                            past_key_values[`present_key_values.${i}.decoder.key`].cpuData[h * 4 * 64 + s * 64 + d];
                        decoder_input[`past_key_values.${i}.decoder.value`].cpuData[h * 64 * 127 + s * 64 + d] =
                            past_key_values[`present_key_values.${i}.decoder.value`].cpuData[h * 4 * 64 + s * 64 + d];
                    }
                }
            }
        }
    } else {
        // fill new KV cache value based on position id axis 2 based on if it is key or value
        for (let i = 0; i < 6; i++) {
            // for name 'present_key_values.${i}.decoder.key' and 'present_key_values.${i}.decoder.value'
            // NHSD (batch, head, squence_length, hidden_dimension) [1,8,1,64]
            for (let h = 0; h < 8; h++) {
                for (let d = 0; d < 64; d++) {
                    decoder_input[`past_key_values.${i}.decoder.key`].cpuData[h * 127 * 64 + (position_ids - 1) * 64 + d] =
                        past_key_values[`present_key_values.${i}.decoder.key`].cpuData[h * 64 + d];
                    decoder_input[`past_key_values.${i}.decoder.value`].cpuData[h * 127 * 64 + (position_ids - 1) * 64 + d] =
                        past_key_values[`present_key_values.${i}.decoder.value`].cpuData[h * 64 + d];
                }
            }
        }
    }
}

export function attention_mask_update(attention_mask, inf_iter, max_sequence_length = 448, num_init_tokens = 4, position_ids = 0) {
    if (inf_iter === 0) {
        // -1 added to allow space for new token such that attention mask 2nd dim is restricted to max seq len
        let padded_mask = new BigInt64Array(max_sequence_length - num_init_tokens - 1).fill(0n);
        // create a new attention mask array with the padded mask and the value 1 for the new token
        let updated_mask = new BigInt64Array(attention_mask.length + padded_mask.length + 1);
        updated_mask.set(attention_mask, 0);
        updated_mask.set(padded_mask, attention_mask.length);
        updated_mask[updated_mask.length - 1] = 1n;
        attention_mask = updated_mask;
    } else {
        // Update the mask at location = position id
        // last element is already set to 1 to account for new token
        attention_mask[position_ids - 1] = 1n;
    }

    return attention_mask;
}