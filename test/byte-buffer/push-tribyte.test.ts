import { TestFixture, TestCase, Expect } from "alsatian";

import { ByteBuffer, DataOrder, Transformation } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushTribyte tests")
export class ByteBufferPushTribyteTestFixture {

  @TestCase(0x000000 - 1)
  @TestCase(0xFFFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushTribyte(value, DataOrder.BIG_ENDIAN, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushTribyte accepts a value between 0 and 16777215.");
  }

  @TestCase(0x123456, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 0x56 ])
  @TestCase(0xFFFFFF, DataOrder.BIG_ENDIAN, [ 0xFF, 0xFF, 0xFF ])
  @TestCase(0x123456, DataOrder.LITTLE_ENDIAN, [ 0x56, 0x34, 0x12 ])
  @TestCase(0xFFFFFF, DataOrder.LITTLE_ENDIAN, [ 0xFF, 0xFF, 0xFF ])
  public shouldPushTribyteInCorrectOrder(value: number, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushTribyte(value, order, Transformation.NONE);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x123456, Transformation.ADD, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 128 + 0x56 ])
  @TestCase(0x123456, Transformation.ADD, DataOrder.LITTLE_ENDIAN, [ 128 + 0x56, 0x34, 0x12 ])
  @TestCase(0x123456, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 128 - 0x56 ])
  @TestCase(0x123456, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, [ 128 - 0x56, 0x34, 0x12 ])
  @TestCase(0x123456, Transformation.NEGATE, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 0 - 0x56 ])
  @TestCase(0x123456, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, [ 0 - 0x56, 0x34, 0x12 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushTribyte(value, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
