import { TestFixture, TestCase, Expect } from "alsatian";

import { ByteBuffer } from "../../src/byte-buffer";

@TestFixture("ByteBuffer#pushByte tests")
export class ByteBufferTestFixture {

  @TestCase(380, [ 124, 1 ])
  @TestCase(65535, [ 255, 255 ])
  public shouldPushSingleShort(short: number, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushShort(short);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(380, 17, [ 124, 1, 17, 0 ])
  @TestCase(65535, 65535, [ 255, 255, 255, 255 ])
  public shouldPushTwoShorts(firstShort: number, secondShort: number, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushShort(firstShort)
          .pushShort(secondShort);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(380, 17, 17996, [ 124, 1, 17, 0, 76, 70 ])
  @TestCase(65535, 65535, 65535, [ 255, 255, 255, 255, 255, 255 ])
  public shouldPushThreeShorts(firstShort: number, secondShort: number, thirdShort: number, expected: Array<number>) {
    const buffer = new ByteBuffer();

    buffer.pushShort(firstShort)
          .pushShort(secondShort)
          .pushShort(thirdShort);

    Expect(buffer.getPayload()).toEqual(expected);
  }

  @TestCase(-1)
  @TestCase(65536)
  public shouldThrowErrorForOutOfRangeValue(value: number) {
    const buffer = new ByteBuffer();

    Expect(
      () => buffer.pushShort(value)
    ).toThrowError(Error, "ByteBuffer#pushShort accepts a value between 0 and 65535.");
  }

}
