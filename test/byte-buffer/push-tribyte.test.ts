import { TestFixture, TestCase, Expect } from "alsatian";

import { ByteBuffer, Order, Transformation } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushTribyte tests")
export class ByteBufferPushTribyteTestFixture {

  @TestCase(0x000000 - 1)
  @TestCase(0xFFFFFF + 1)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushTribyte(value, Order.BIG_ENDIAN, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushTribyte accepts a value between 0 and 16777215.");
  }

  @TestCase(Order.BIG_ENDIAN_MIXED)
  @TestCase(Order.LITTLE_ENDIAN_MIXED)
  public shouldThrowErrorForMixedEndianOrder(order: Order) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushTribyte(0x000000, order, Transformation.NONE)
    ).toThrowError(Error, "Mixed endian order cannot be used with ByteBuffer#pushTribyte.");
  }

  @TestCase(0x123456, Order.BIG_ENDIAN, [ 0x12, 0x34, 0x56 ])
  @TestCase(0xFFFFFF, Order.BIG_ENDIAN, [ 0xFF, 0xFF, 0xFF ])
  @TestCase(0x123456, Order.LITTLE_ENDIAN, [ 0x56, 0x34, 0x12 ])
  @TestCase(0xFFFFFF, Order.LITTLE_ENDIAN, [ 0xFF, 0xFF, 0xFF ])
  public shouldPushTribyteInCorrectOrder(value: number, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushTribyte(value, order, Transformation.NONE);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x123456, Transformation.ADD, Order.BIG_ENDIAN, [ 0x12, 0x34, 128 + 0x56 ])
  @TestCase(0x123456, Transformation.ADD, Order.LITTLE_ENDIAN, [ 128 + 0x56, 0x34, 0x12 ])
  @TestCase(0x123456, Transformation.SUBTRACT, Order.BIG_ENDIAN, [ 0x12, 0x34, 128 - 0x56 ])
  @TestCase(0x123456, Transformation.SUBTRACT, Order.LITTLE_ENDIAN, [ 128 - 0x56, 0x34, 0x12 ])
  @TestCase(0x123456, Transformation.NEGATE, Order.BIG_ENDIAN, [ 0x12, 0x34, 0 - 0x56 ])
  @TestCase(0x123456, Transformation.NEGATE, Order.LITTLE_ENDIAN, [ 0 - 0x56, 0x34, 0x12 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: Order, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushTribyte(value, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
