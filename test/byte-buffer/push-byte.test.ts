import { TestFixture, TestCase, Expect } from "alsatian";

import { ByteBuffer } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushByte tests")
export class ByteBufferTestFixture {

  @TestCase(1)
  @TestCase(200)
  @TestCase(150)
  public shouldPushSingleByte(byte: number) {
    const buffer = new ByteBuffer();

    buffer.pushByte(byte);

    Expect(buffer.getPayload()).toEqual([ byte ]);
  }

  @TestCase(5, 102)
  @TestCase(96, 5)
  @TestCase(103, 11)
  public shouldPushTwoBytes(firstByte: number, secondByte: number) {
    const buffer = new ByteBuffer();

    buffer.pushByte(firstByte)
          .pushByte(secondByte);

    Expect(buffer.getPayload()).toEqual([ firstByte, secondByte ]);
  }

  @TestCase(1, 243, 254)
  @TestCase(200, 0, 0)
  @TestCase(150, 17, 150)
  public shouldPushThreeBytes(firstByte: number, secondByte: number, thirdByte: number) {
    const buffer = new ByteBuffer();

    buffer.pushByte(firstByte)
          .pushByte(secondByte)
          .pushByte(thirdByte);

    Expect(buffer.getPayload()).toEqual([ firstByte, secondByte, thirdByte ]);
  }

  @TestCase(-1)
  @TestCase(256)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushByte(value)
    ).toThrowError(Error, "ByteBuffer#pushByte accepts a value between 0 and 255.");
  }

}
