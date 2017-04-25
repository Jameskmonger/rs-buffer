import { TestFixture, TestCase, Expect } from "alsatian";

import { DataOrder, Transformation } from "../../../src/byte-buffer";
import { WritableByteBuffer } from "../../../src/byte-buffer/writable-byte-buffer";

@TestFixture("ByteBuffer#pushLong tests")
export class ByteBufferPushLongTestFixture {

  @TestCase(0x00000000, 0x00000000 - 1)
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(high: number, low: number) {
    const buffer = new WritableByteBuffer();

    Expect(
      () => buffer.pushLong(high, low, DataOrder.BIG_ENDIAN, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushLong accepts a value between [ 0, 0 ] and [ 4294967295, 4294967295 ].");
  }

  @TestCase(0x01234567, 0x89ABCDEF, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF ])
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF, DataOrder.BIG_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x01234567, 0x89ABCDEF, DataOrder.LITTLE_ENDIAN, [ 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF, DataOrder.LITTLE_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ])
  public shouldPushLongInCorrectOrder(high: number, low: number, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushLong(high, low, order, Transformation.NONE);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x01234567, 0x89ABCDEF, Transformation.ADD, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 128 + 0xEF ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.ADD, DataOrder.LITTLE_ENDIAN, [ 128 + 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 128 - 0xEF ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, [ 128 - 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.NEGATE, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0 - 0xEF ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, [ 0 - 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  public shouldApplyTransformationToLSB(high: number, low: number, transformation: Transformation, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushLong(high, low, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
