import { TestFixture, TestCase, Expect } from "alsatian";

import { ByteBuffer, Transformation } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushByte tests")
export class ByteBufferPushByteTestFixture {

  @TestCase(0x00 - 1)
  @TestCase(0xFF + 1)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushByte(value, Transformation.NONE)
    ).toThrowError(Error, "ByteBuffer#pushByte accepts a value between 0 and 255.");
  }

  @TestCase(0x12, Transformation.NONE, [ 0x12 ])
  @TestCase(0xFF, Transformation.NONE, [ 0xFF ])
  @TestCase(0x12, Transformation.ADD, [ 128 + 0x12 ])
  @TestCase(0xFF, Transformation.ADD, [ 128 + 0xFF ])
  @TestCase(0x12, Transformation.SUBTRACT, [ 128 - 0x12 ])
  @TestCase(0xFF, Transformation.SUBTRACT, [ 128 - 0xFF ])
  @TestCase(0x12, Transformation.NEGATE, [ 0 - 0x12 ])
  @TestCase(0xFF, Transformation.NEGATE, [ 0 - 0xFF ])
  public shouldPushByteWithCorrectTransformation(value: number, transform: Transformation, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushByte(value, transform);

    Expect(buffer.getPayload()).toEqual(expected);
  }

}
