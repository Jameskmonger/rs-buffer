import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";

import { Transformation } from "../../../src/byte-buffer";
import { WritableByteBuffer } from "../../../src/byte-buffer";

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
    const buffer = new WritableByteBuffer();

    buffer.pushByte(value, transform);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(-0x34, [ 0xCC ])
  @TestCase(-0xF0, [ 0x10 ])
  public shouldPushNegativeByteCorrectly(negative: number, expected: Array<number>) {
    const buffer = new WritableByteBuffer();

    buffer.pushByte(negative);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
