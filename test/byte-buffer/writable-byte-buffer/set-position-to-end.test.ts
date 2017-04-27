import { TestFixture, TestCase, Test, Expect } from "alsatian";

import { WritableByteBuffer } from "../../../src/byte-buffer/writable-byte-buffer";

@TestFixture("ByteBuffer#setPositionToEnd tests")
export class ByteBufferSetPositionToEndTestFixture {

    @Test()
    public shouldSetPositionToEnd() {
        const byteBuffer = new WritableByteBuffer();

        byteBuffer.pushByte(0xFF);
        byteBuffer.pushByte(0xFF);

        byteBuffer.setPosition(0);

        byteBuffer.pushByte(0x00);

        byteBuffer.setPositionToEnd();

        byteBuffer.pushByte(0xAA);

        Expect(byteBuffer.getPayload()).toEqual([ 0x00, 0xFF, 0xAA ]);
    }

}