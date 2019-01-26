import { TestFixture, TestCase, Expect, FocusTest, FocusTests } from "alsatian";

import { ReadableByteBuffer } from "../../src/";

@FocusTests
@TestFixture("ByteBuffer#readTribyte tests")
export class ByteBufferReadTribyteTestFixture {

    @TestCase([ 0x12, 0x34, 0x56 ], 0x123456)
    @TestCase([ -0x56, -0x45, -0x34 ], 0xAABBCC)
    public shouldReadUnsignedTribyte(input: Array<number>, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readTribyte(false);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56 ], 0x123456)
    @TestCase([ -0x5B, 0x44, 0x34 ], -0x5ABBCC)
    public shouldReadSignedTribyte(input: Array<number>, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readTribyte(true);

        Expect(output).toBe(expected);
    }
}
