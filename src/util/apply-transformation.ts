import { Transformation } from "../transformation";

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
};

const reverseTransformation = (byte: number, transformation: Transformation) => {
  if (transformation === Transformation.ADD) {
    return byte - 128;
  }

  if (transformation === Transformation.SUBTRACT) {
    return 128 - byte;
  }

  if (transformation === Transformation.NEGATE) {
    return 0 - byte;
  }

  return byte;
};

export {
  applyTransformation,
  reverseTransformation
}
