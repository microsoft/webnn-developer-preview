export const isDict = (v) => {
  return (
    typeof v === "object" &&
    v !== null &&
    !(v instanceof Array) &&
    !(v instanceof Date)
  );
};

export const dataTypeToArrayConstructor = {
  float32: Float32Array,
  uint16: Uint16Array,
  float16: Uint16Array,
  int32: Int32Array,
  int64: BigInt64Array,
  BigInt64Array: BigInt64Array,
  int8: Int8Array,
  uint8: Uint8Array,
  bool: Uint8Array,
};
