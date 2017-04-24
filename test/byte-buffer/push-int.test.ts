import { TestFixture, TestCase, Expect } from "alsatian";

import { ByteBuffer, Order, Transformation } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushInt tests")
export class ByteBufferPushIntTestFixture {

  @TestCase(0x00000000 - 1)
  @TestCase(0xFFFFFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushInt(value, Order.BIG_ENDIAN, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushInt accepts a value between 0 and 4294967295.");
  }

  @TestCase(0x12345678, Order.BIG_ENDIAN, [ 0x12, 0x34, 0x56, 0x78 ])
  @TestCase(0xFFFFFFFF, Order.BIG_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x12345678, Order.BIG_ENDIAN_MIXED, [ 0x56, 0x78, 0x12, 0x34 ])
  @TestCase(0xFFFFFFFF, Order.BIG_ENDIAN_MIXED, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x12345678, Order.LITTLE_ENDIAN, [ 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0xFFFFFFFF, Order.LITTLE_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x12345678, Order.LITTLE_ENDIAN_MIXED, [ 0x34, 0x12, 0x78, 0x56 ])
  @TestCase(0xFFFFFFFF, Order.LITTLE_ENDIAN_MIXED, [ 0xFF, 0xFF, 0xFF, 0xFF ])
  public shouldPushIntInCorrectOrder(int: number, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushInt(int, order, Transformation.NONE);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x12345678, Transformation.ADD, Order.BIG_ENDIAN, [ 0x12, 0x34, 0x56, 128 + 0x78 ])
  @TestCase(0x12345678, Transformation.ADD, Order.BIG_ENDIAN_MIXED, [ 0x56, 128 + 0x78, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.ADD, Order.LITTLE_ENDIAN, [ 128 + 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.ADD, Order.LITTLE_ENDIAN_MIXED, [ 0x34, 0x12, 128 + 0x78, 0x56 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, Order.BIG_ENDIAN, [ 0x12, 0x34, 0x56, 128 - 0x78 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, Order.BIG_ENDIAN_MIXED, [ 0x56, 128 - 0x78, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, Order.LITTLE_ENDIAN, [ 128 - 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, Order.LITTLE_ENDIAN_MIXED, [ 0x34, 0x12, 128 - 0x78, 0x56 ])
  @TestCase(0x12345678, Transformation.NEGATE, Order.BIG_ENDIAN, [ 0x12, 0x34, 0x56, 0 - 0x78 ])
  @TestCase(0x12345678, Transformation.NEGATE, Order.BIG_ENDIAN_MIXED, [ 0x56, 0 - 0x78, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.NEGATE, Order.LITTLE_ENDIAN, [ 0 - 0x78, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.NEGATE, Order.LITTLE_ENDIAN_MIXED, [ 0x34, 0x12, 0 - 0x78, 0x56 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushInt(value, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
