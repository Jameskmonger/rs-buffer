import { TestFixture, TestCase, Expect } from "alsatian";

import { ByteBuffer, Order, Transformation } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushLong tests")
export class ByteBufferPushLongTestFixture {

  @TestCase(0x00000000, 0x00000000 - 1)
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(high: number, low: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushLong(high, low, Order.BIG_ENDIAN, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushLong accepts a value between [ 0, 0 ] and [ 4294967295, 4294967295 ].");
  }

  @TestCase(Order.BIG_ENDIAN_MIXED)
  @TestCase(Order.LITTLE_ENDIAN_MIXED)
  public shouldThrowErrorForMixedEndianOrder(order: Order) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushLong(0xFFFFFFFF, 0xFFFFFFFF, order, Transformation.NONE)
    ).toThrowError(Error, "Mixed endian order cannot be used with ByteBuffer#pushLong.");
  }

  @TestCase(0x01234567, 0x89ABCDEF, Order.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF ])
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF, Order.BIG_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x01234567, 0x89ABCDEF, Order.LITTLE_ENDIAN, [ 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF, Order.LITTLE_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ])
  public shouldPushLongInCorrectOrder(high: number, low: number, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushLong(high, low, order, Transformation.NONE);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x01234567, 0x89ABCDEF, Transformation.ADD, Order.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 128 + 0xEF ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.ADD, Order.LITTLE_ENDIAN, [ 128 + 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.SUBTRACT, Order.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 128 - 0xEF ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.SUBTRACT, Order.LITTLE_ENDIAN, [ 128 - 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.NEGATE, Order.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0 - 0xEF ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.NEGATE, Order.LITTLE_ENDIAN, [ 0 - 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  public shouldApplyTransformationToLSB(high: number, low: number, transformation: Transformation, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushLong(high, low, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
