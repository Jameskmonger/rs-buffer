import { TestFixture, TestCase } from "alsatian";
import { ExpectBuffersToBeEqual } from "../expect";

import { FixedWritableByteBuffer, DataOrder, Transformation } from "../../src/";

@TestFixture("ByteBuffer#pushLong tests")
export class ByteBufferPushLongTestFixture {

  @TestCase(0x01234567, 0x89ABCDEF, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF ])
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF, DataOrder.BIG_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ])
  @TestCase(0x01234567, 0x89ABCDEF, DataOrder.LITTLE_ENDIAN, [ 0xEF, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0xFFFFFFFF, 0xFFFFFFFF, DataOrder.LITTLE_ENDIAN, [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ])
  public shouldPushLongInCorrectOrder(high: number, low: number, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const byteBuffer = new FixedWritableByteBuffer(8);

    byteBuffer.pushLong(high, low, Transformation.NONE, order);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

  @TestCase(0x01234567, 0x89ABCDEF, Transformation.ADD, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0x6F ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.ADD, DataOrder.LITTLE_ENDIAN, [ 0x6F, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0x91 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, [ 0x91, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.NEGATE, DataOrder.BIG_ENDIAN, [ 0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0x11 ])
  @TestCase(0x01234567, 0x89ABCDEF, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, [ 0x11, 0xCD, 0xAB, 0x89, 0x67, 0x45, 0x23, 0x01 ])
  public shouldApplyTransformationToLSB(high: number, low: number, transformation: Transformation, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const byteBuffer = new FixedWritableByteBuffer(8);

    byteBuffer.pushLong(high, low, transformation, order);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

  @TestCase(-0x12345678, -0xABCDEF01, [ 0xED, 0xCB, 0xA9, 0x88, 0x54, 0x32, 0x10, 0xFF ])
  @TestCase(-0xF0F0ECAB, -0x17FE19A0, [ 0x0F, 0x0F, 0x13, 0x55, 0xE8, 0x01, 0xE6, 0x60 ])
  public shouldPushNegativeLongCorrectly(high: number, low: number, expected: Array<string>) {
    const byteBuffer = new FixedWritableByteBuffer(8);

    byteBuffer.pushLong(high, low, Transformation.NONE, DataOrder.BIG_ENDIAN);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

}
