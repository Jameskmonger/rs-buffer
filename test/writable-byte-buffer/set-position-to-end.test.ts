import { TestFixture, Test } from "alsatian";
import { ExpectBuffersToBeEqual } from "../expect";

import { FixedWritableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#setPositionToEnd tests")
export class ByteBufferSetPositionToEndTestFixture {

    @Test()
    public shouldSetPositionToEnd() {
        const byteBuffer = new FixedWritableByteBuffer(3);

        byteBuffer.pushByte(0xFF);
        byteBuffer.pushByte(0xFF);

        byteBuffer.setPosition(0);

        byteBuffer.pushByte(0x00);

        byteBuffer.setPositionToEnd();

        byteBuffer.pushByte(0xAA);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from([ 0x00, 0xFF, 0xAA ]));
    }

}
