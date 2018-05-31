import { applyTransformation } from "./apply-transformation";
import { Transformation } from "../transformation";

const transformLsb = (bytes: Array<number>, transformation: Transformation) => {
  const lsbIndex = bytes.length - 1;
  const lsbValue = bytes[lsbIndex];

  bytes[lsbIndex] = applyTransformation(lsbValue, transformation);

  return bytes;
}

export {
    transformLsb
}