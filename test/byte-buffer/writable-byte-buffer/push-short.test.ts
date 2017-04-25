import { TestFixture, TestCase, Test, Expect } from "alsatian";

import { WritableByteBuffer, DataOrder, Transformation } from "../../../src/byte-buffer/writable-byte-buffer";;

@TestFixture("ByteBuffer#pushShort tests")
export class ByteBufferPushShortTestFixture {

  @TestCase(0x0000 - 1)
  @TestCase(0xFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new WritableByteBuffer();

    Expect(
      () => buffer.pushShort(value, DataOrder.BIG_ENDIAN, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushShort accepts a value between 0 and 65535.");
  }

  @TestCase(0x1234, DataOrder.BIG_ENDIAN, [ 0x12, 0x34 ])
  @TestCase(0xFFFF, DataOrder.BIG_ENDIAN, [ 0xFF, 0xFF ])
  @TestCase(0x1234, DataOrder.LITTLE_ENDIAN, [ 0x34, 0x12 ])
  @TestCase(0xFFFF, DataOrder.LITTLE_ENDIAN, [ 0xFF, 0xFF ])
  public shouldPushShortInCorrectOrder(value: number, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushShort(value, order, Transformation.NONE);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x1234, Transformation.ADD, DataOrder.BIG_ENDIAN, [ 0x12, 128 + 0x34 ])
  @TestCase(0x1234, Transformation.ADD, DataOrder.LITTLE_ENDIAN, [ 128 + 0x34, 0x12 ])
  @TestCase(0x1234, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, [ 0x12, 128 - 0x34 ])
  @TestCase(0x1234, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, [ 128 - 0x34, 0x12 ])
  @TestCase(0x1234, Transformation.NEGATE, DataOrder.BIG_ENDIAN, [ 0x12, 0 - 0x34 ])
  @TestCase(0x1234, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, [ 0 - 0x34, 0x12 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushShort(value, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
