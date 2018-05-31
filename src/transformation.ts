// transformation applied to LSB (value)
export enum Transformation {
  NONE, // value
  ADD, // 128 + value
  SUBTRACT, // 128 - value
  NEGATE // 0 - value
}