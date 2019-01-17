import { applyTransformation, reverseTransformation } from "./apply-transformation";
import { Transformation } from "../transformation";

const transformLsb = (bytes: Array<number>, transformation: Transformation, reverse: boolean = false) => {
  const lsbIndex = bytes.length - 1;
  const lsbValue = bytes[lsbIndex];

  const transformed = reverse
    ? reverseTransformation(lsbValue, transformation)
    : applyTransformation(lsbValue, transformation);

  bytes[lsbIndex] = transformed;

  return bytes;
}

export {
    transformLsb
}
