import { TestFixture, TestCase, Expect, FocusTest, IgnoreTest, IgnoreTests, FocusTests } from "alsatian";

import { ReadableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#readLong tests")
export class ByteBufferReadLongTestFixture {

    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0x71, -0x4E, -0x3D, -0x2C ], [ 0x12345678, 0x71B2C3D4 ])
    @TestCase([ -0x5B, 0x44, 0x33, 0x22, -0x1C, -0x2E, -0x40, -0x4E ], [ 0xA5443322, 0xE4D2C0B2 ])
    public shouldReadLong(input: number[], expected: [number, number]) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readLong();

        Expect(output).toEqual(expected);
    }

}
