import { TestFixture, TestCase } from "alsatian";
import { ExpectBuffersToBeEqual } from "../expect";

import { FixedWritableByteBuffer, DataOrder, Transformation } from "../../src/";

@TestFixture("ByteBuffer#pushShort tests")
export class ByteBufferPushShortTestFixture {

  @TestCase(0x1234, DataOrder.BIG_ENDIAN, [ 0x12, 0x34 ])
  @TestCase(0xFFFF, DataOrder.BIG_ENDIAN, [ 0xFF, 0xFF ])
  @TestCase(0x1234, DataOrder.LITTLE_ENDIAN, [ 0x34, 0x12 ])
  @TestCase(0xFFFF, DataOrder.LITTLE_ENDIAN, [ 0xFF, 0xFF ])
  public shouldPushShortInCorrectOrder(value: number, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const byteBuffer = new FixedWritableByteBuffer(2);

    byteBuffer.pushShort(value, order);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

  @TestCase(0x1234, Transformation.ADD, DataOrder.BIG_ENDIAN, [ 0x12, 0xB4 ])
  @TestCase(0x1234, Transformation.ADD, DataOrder.LITTLE_ENDIAN, [ 0xB4, 0x12 ])
  @TestCase(0x1234, Transformation.SUBTRACT, DataOrder.BIG_ENDIAN, [ 0x12, 0x4C ])
  @TestCase(0x1234, Transformation.SUBTRACT, DataOrder.LITTLE_ENDIAN, [ 0x4C, 0x12 ])
  @TestCase(0x1234, Transformation.NEGATE, DataOrder.BIG_ENDIAN, [ 0x12, 0xCC ])
  @TestCase(0x1234, Transformation.NEGATE, DataOrder.LITTLE_ENDIAN, [ 0xCC, 0x12 ])
  public shouldApplyTransformationToLSB(value: number, transformation: Transformation, order: DataOrder.BIG_ENDIAN | DataOrder.LITTLE_ENDIAN, expected: Array<number>) {
    const byteBuffer = new FixedWritableByteBuffer(2);

    byteBuffer.pushShort(value, order, transformation);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

  @TestCase(-0x1234, [ 0xED, 0xCC ])
  @TestCase(-0xF0F0, [ 0x0F, 0x10 ])
  public shouldPushNegativeShortCorrectly(negative: number, expected: Array<string>) {
    const byteBuffer = new FixedWritableByteBuffer(2);

    byteBuffer.pushShort(negative, DataOrder.BIG_ENDIAN);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

}
