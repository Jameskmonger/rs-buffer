import { TestFixture, TestCase, Expect } from "alsatian";

import { WritableByteBuffer, DataOrder, Transformation } from "../../../src/byte-buffer";

@TestFixture("ByteBuffer#pushTribyte tests")
export class ByteBufferPushTribyteTestFixture {

  @TestCase(0x123456, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 0x56 ])
  @TestCase(0xFFFFFF, DataOrder.BIG_ENDIAN, [ 0xFF, 0xFF, 0xFF ])
  @TestCase(0x123456, DataOrder.LITTLE_ENDIAN, [ 0x56, 0x34, 0x12 ])
  @TestCase(0xFFFFFF, DataOrder.LITTLE_ENDIAN, [ 0xFF, 0xFF, 0xFF ])
  public shouldPushTribyteInCorrectOrder(value: number, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushTribyte(value, order);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(0x123456, Transformation.ADD, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 0xD6 ])
  @TestCase(0x123456, Transformation.ADD, DataOrder.LITTLE_ENDIAN, [ 0xD6, 0x34, 0x12 ])
  @TestCase(0x123456, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 0x2A ])
  @TestCase(0x123456, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, [ 0x2A, 0x34, 0x12 ])
  @TestCase(0x123456, Transformation.NEGATE, DataOrder.BIG_ENDIAN, [ 0x12, 0x34, 0xAA ])
  @TestCase(0x123456, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, [ 0xAA, 0x34, 0x12 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushTribyte(value, order, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(-0x123456, [ 0xED, 0xCB, 0xAA ])
  @TestCase(-0xF0F0EC, [ 0x0F, 0x0F, 0x14 ])
  public shouldPushNegativeTribyteCorrectly(negative: number, expected: Array<string>) {
    const buffer = new WritableByteBuffer();

    buffer.pushTribyte(negative, DataOrder.BIG_ENDIAN);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
