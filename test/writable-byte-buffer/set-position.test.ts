import { TestFixture, TestCase } from "alsatian";
import { ExpectBuffersToBeEqual } from "../expect";

import { WritableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#setPosition tests")
export class ByteBufferSetPositionTestFixture {

    @TestCase([ 0xFF, 0xFF, 0xFF ], 2, [ 0xFF, 0xFF, 0x00 ])
    @TestCase([ 0xFF, 0xFF ], 0, [ 0x00, 0xFF ])
    public shouldSetPositionForOneByte(initial: Array<number>, position: number, expected: Array<number>) {
        const byteBuffer = new WritableByteBuffer(expected.length);

        initial.forEach(i => byteBuffer.pushByte(i));

        byteBuffer.setPosition(position);

        byteBuffer.pushByte(0x00);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
    }

    @TestCase([ 0xFF, 0xFF, 0xFF ], 2, [ 0xFF, 0xFF, 0x00, 0x00 ])
    @TestCase([ 0xFF, 0xFF ], 0, [ 0x00, 0x00 ])
    public shouldSetPositionForTwoBytes(initial: Array<number>, position: number, expected: Array<number>) {
        const byteBuffer = new WritableByteBuffer(expected.length);

        initial.forEach(i => byteBuffer.pushByte(i));

        byteBuffer.setPosition(position);

        byteBuffer.pushByte(0x00);
        byteBuffer.pushByte(0x00);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
    }

}
