import { TestFixture, TestCase, Expect } from "alsatian";

import { ReadableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#readInt tests")
export class ByteBufferReadIntTestFixture {

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], 0x12345678)
    @TestCase([ 0xAA, 0xBB, 0xCC, 0xDD ], 0xAABBCCDD)
    public shouldReadUnsignedInt(input: Array<number>, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(false);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], 0x12345678)
    @TestCase([ 0xA5, 0x44, 0x33, 0x23 ], -0x5ABBCCDD)
    public shouldReadSignedInt(input: Array<number>, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(true);

        Expect(output).toBe(expected);
    }

}
