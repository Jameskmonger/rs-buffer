import { Transformation } from "./";

const applyTransformation = (byte: number, transformation: Transformation) => {
  if (transformation === Transformation.ADD) {
    return 128 + byte;
  }

  if (transformation === Transformation.SUBTRACT) {
    return 128 - byte;
  }

  if (transformation === Transformation.NEGATE) {
    return 0 - byte;
  }

  return byte;
}

export {
  applyTransformation
}