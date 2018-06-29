import { TestFixture, TestCase } from "alsatian";
import { ExpectBuffersToBeEqual } from "../expect";

import { FixedWritableByteBuffer, Transformation } from "../../src/";

@TestFixture("ByteBuffer#pushByte tests")
export class ByteBufferPushByteTestFixture {

  @TestCase(0x12, Transformation.NONE, [ 0x12 ])
  @TestCase(0xFF, Transformation.NONE, [ 0xFF ])
  @TestCase(0x12, Transformation.ADD, [ 0x92 ])
  @TestCase(0xFF, Transformation.ADD, [ 0x7F ])
  @TestCase(0x12, Transformation.SUBTRACT, [ 0x6E ])
  @TestCase(0xFF, Transformation.SUBTRACT, [ 0x81 ])
  @TestCase(0x12, Transformation.NEGATE, [ 0xEE ])
  @TestCase(0xFF, Transformation.NEGATE, [ 0x01 ])
  public shouldPushByteWithCorrectTransformation(value: number, transform: Transformation, expected: Array<number>) {
    const byteBuffer = new FixedWritableByteBuffer(1);

    byteBuffer.pushByte(value, transform);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

  @TestCase(-0x34, [ 0xCC ])
  @TestCase(-0xF0, [ 0x10 ])
  public shouldPushNegativeByteCorrectly(negative: number, expected: Array<number>) {
    const byteBuffer = new FixedWritableByteBuffer(1);

    byteBuffer.pushByte(negative);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

}
