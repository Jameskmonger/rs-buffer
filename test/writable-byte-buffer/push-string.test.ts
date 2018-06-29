import { TestFixture, TestCase } from "alsatian";
import { ExpectBuffersToBeEqual } from "../expect";

import { FixedWritableByteBuffer } from "../../src/";

const EOL_CHARACTER = 0x0A;

@TestFixture("ByteBuffer#pushString tests")
export class ByteBufferPushStringTestFixture {

  @TestCase("hello", [ 0x68, 0x65, 0x6C, 0x6C, 0x6F, EOL_CHARACTER ])
  @TestCase("bob johnny", [ 0x62, 0x6F, 0x62, 0x20, 0x6A, 0x6F, 0x68, 0x6E, 0x6E, 0x79, EOL_CHARACTER ])
  public shouldPushCorrectBytes(value: string, expected: Array<number>) {
    const byteBuffer = new FixedWritableByteBuffer(value.length + 1);

    byteBuffer.pushString(value);

    ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
  }

}
