import { TestFixture, TestCase, Expect } from "alsatian";

import { DataOrder, Transformation } from "../../../src/byte-buffer";
import { WritableByteBuffer } from "../../../src/byte-buffer/writable-byte-buffer";

@TestFixture("ByteBuffer#pushInt tests")
export class ByteBufferPushIntTestFixture {

  @TestCase(0x00000000 - 1)
  @TestCase(0xFFFFFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new WritableByteBuffer();

    Expect(
      () => buffer.pushInt(value, DataOrder.BIG_ENDIAN, false)
    ).toThrowError(Error, "ByteBuffer#pushInt accepts a value between 0 and 4294967295.");
  }

  @TestCase(0x12345678, DataOrder.BIG_ENDIAN, false, [ 0x12, 0x34, 0x56, 0x78 ])
  @TestCase(0xFFFFFFFF, DataOrder.BIG_ENDIAN, false, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x12345678, DataOrder.BIG_ENDIAN, true, [ 0x56, 0x78, 0x12, 0x34 ])
  @TestCase(0xFFFFFFFF, DataOrder.BIG_ENDIAN, true, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x12345678, DataOrder.LITTLE_ENDIAN, false, [ 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0xFFFFFFFF, DataOrder.LITTLE_ENDIAN, false, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x12345678, DataOrder.LITTLE_ENDIAN, true, [ 0x34, 0x12, 0x78, 0x56 ])
  @TestCase(0xFFFFFFFF, DataOrder.LITTLE_ENDIAN, true, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  public shouldPushIntInCorrectOrder(value: number, order: DataOrder, mixed: boolean, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushInt(value, order, mixed);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x12345678, Transformation.ADD, DataOrder.BIG_ENDIAN, false, [ 0x12, 0x34, 0x56, 128 + 0x78 ])
  @TestCase(0x12345678, Transformation.ADD, DataOrder.BIG_ENDIAN, true, [ 0x56, 128 + 0x78, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.ADD, DataOrder.LITTLE_ENDIAN, false, [ 128 + 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.ADD, DataOrder.LITTLE_ENDIAN, true, [ 0x34, 0x12, 128 + 0x78, 0x56 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, false, [ 0x12, 0x34, 0x56, 128 - 0x78 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, true, [ 0x56, 128 - 0x78, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, false, [ 128 - 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, true, [ 0x34, 0x12, 128 - 0x78, 0x56 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.BIG_ENDIAN, false, [ 0x12, 0x34, 0x56, 0 - 0x78 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.BIG_ENDIAN, true, [ 0x56, 0 - 0x78, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, false, [ 0 - 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, true, [ 0x34, 0x12, 0 - 0x78, 0x56 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: DataOrder, mixed: boolean, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushInt(value, order, mixed, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
