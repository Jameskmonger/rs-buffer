import { TestFixture, TestCase, Expect } from "alsatian";

import { ReadableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#hasRemaining tests")
export class ByteBufferHasRemainingTestFixture {

    @TestCase([ 0xFF, 0xFA, 0x12, 0x34 ], (buffer: ReadableByteBuffer) => {
        buffer.readByte(); buffer.readShort();
    })
    @TestCase([ 0xFF, 0xFA ], (buffer: ReadableByteBuffer) => {
        buffer.readByte();
    })
    @TestCase([ 0xFF, 0xFA, 0x12, 0x34, 0xFF ], (buffer: ReadableByteBuffer) => {
        buffer.readInt();
    })
    @TestCase([ 0xFF, 0xFA, 0x12, 0x34, 0xFF, 0x34, 0xFF, 0xFF, 0x12, 0x34 ], (buffer: ReadableByteBuffer) => {
        buffer.readLong(); buffer.readByte();
    })
    public shouldReturnTrueIfRemaining(input: number[], readData: (buffer: ReadableByteBuffer) => void) {
        const buffer = Buffer.from(input);

        const readable = new ReadableByteBuffer(buffer);

        readData(readable);

        Expect(readable.hasRemaining()).toBe(true);
    }

    @TestCase([ 0xFF, 0xFA, 0x12, 0x34 ], (buffer: ReadableByteBuffer) => {
        buffer.readByte(); buffer.readShort(); buffer.readByte();
    })
    @TestCase([ 0xFF, 0xFA ], (buffer: ReadableByteBuffer) => {
        buffer.readShort();
    })
    @TestCase([ 0xFF, 0xFA, 0x12, 0x34, 0xFF ], (buffer: ReadableByteBuffer) => {
        buffer.readShort(); buffer.readTribyte();
    })
    @TestCase([ 0xFF, 0xFA, 0x12, 0x34, 0xFF, 0x34, 0xFF, 0xFF, 0x12, 0x34 ], (buffer: ReadableByteBuffer) => {
        buffer.readTribyte(); buffer.readByte(); buffer.readShort(); buffer.readInt();
    })
    public shouldReturnFalseIfNotRemaining(input: number[], readData: (buffer: ReadableByteBuffer) => void) {
        const buffer = Buffer.from(input);

        const readable = new ReadableByteBuffer(buffer);
        
        readData(readable);

        Expect(readable.hasRemaining()).toBe(false);
    }

}
