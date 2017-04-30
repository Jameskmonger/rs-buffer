import { TestFixture, TestCase, Expect } from "alsatian";

import { WritableByteBuffer, DataOrder, Transformation } from "../../../src/byte-buffer";

@TestFixture("ByteBuffer#pushInt tests")
export class ByteBufferPushIntTestFixture {

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

  @TestCase(0x12345678, Transformation.ADD, DataOrder.BIG_ENDIAN, false, [ 0x12, 0x34, 0x56, 0xF8 ])
  @TestCase(0x12345678, Transformation.ADD, DataOrder.BIG_ENDIAN, true, [ 0x56, 0xF8, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.ADD, DataOrder.LITTLE_ENDIAN, false, [ 0xF8, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.ADD, DataOrder.LITTLE_ENDIAN, true, [ 0x34, 0x12, 0xF8, 0x56 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, false, [ 0x12, 0x34, 0x56, 0x08 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, true, [ 0x56, 0x08, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, false, [ 0x08, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, true, [ 0x34, 0x12, 0x08, 0x56 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.BIG_ENDIAN, false, [ 0x12, 0x34, 0x56, 0x88 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.BIG_ENDIAN, true, [ 0x56, 0x88, 0x12, 0x34 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, false, [ 0x88, 0x56, 0x34, 0x12 ])
  @TestCase(0x12345678, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, true, [ 0x34, 0x12, 0x88, 0x56 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: DataOrder, mixed: boolean, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushInt(value, order, mixed, transformation);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(-0x12345678, [ 0xED, 0xCB, 0xA9, 0x88 ])
  @TestCase(-0xF0F0ECAB, [ 0x0F, 0x0F, 0x13, 0x55 ])
  public shouldPushNegativeIntCorrectly(negative: number, expected: Array<string>) {
    const buffer = new WritableByteBuffer();

    buffer.pushInt(negative, DataOrder.BIG_ENDIAN, false);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
