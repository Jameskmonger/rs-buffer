import { TestFixture, TestCase, Test, Expect } from "alsatian";

import { ByteBuffer, Order, Transformation } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushShort tests")
export class ByteBufferPushShortTestFixture {

  @TestCase(0x0000 - 1)
  @TestCase(0xFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushShort(value, Order.BIG_ENDIAN, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushShort accepts a value between 0 and 65535.");
  }

  @TestCase(Order.BIG_ENDIAN_MIXED)
  @TestCase(Order.LITTLE_ENDIAN_MIXED)
  public shouldThrowErrorForMixedEndianOrder(order: Order) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushShort(0x0000, order, Transformation.NONE)
    ).toThrowError(Error, "Mixed endian order cannot be used with ByteBuffer#pushShort.");
  }

  @TestCase(0x1234, Order.BIG_ENDIAN, [ 0x12, 0x34 ])
  @TestCase(0xFFFF, Order.BIG_ENDIAN, [ 0xFF, 0xFF ])
  @TestCase(0x1234, Order.LITTLE_ENDIAN, [ 0x34, 0x12 ])
  @TestCase(0xFFFF, Order.LITTLE_ENDIAN, [ 0xFF, 0xFF ])
  public shouldPushShortInCorrectOrder(short: number, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushShort(short, order, Transformation.NONE);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x1234, Transformation.ADD, Order.BIG_ENDIAN, [ 0x12, 128 + 0x34 ])
  @TestCase(0x1234, Transformation.ADD, Order.LITTLE_ENDIAN, [ 128 + 0x34, 0x12 ])
  @TestCase(0x1234, Transformation.SUBTRACT, Order.BIG_ENDIAN, [ 0x12, 128 - 0x34 ])
  @TestCase(0x1234, Transformation.SUBTRACT, Order.LITTLE_ENDIAN, [ 128 - 0x34, 0x12 ])
  @TestCase(0x1234, Transformation.NEGATE, Order.BIG_ENDIAN, [ 0x12, 0 - 0x34 ])
  @TestCase(0x1234, Transformation.NEGATE, Order.LITTLE_ENDIAN, [ 0 - 0x34, 0x12 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushShort(value, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
