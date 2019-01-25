import { TestFixture, TestCase, Expect, FocusTests } from "alsatian";

import { ReadableByteBuffer } from "../../src/";

@FocusTests
@TestFixture("ByteBuffer#readShort tests")
export class ByteBufferReadShortTestFixture {

    @TestCase([ 0x2F, -0x01 ], 0x2FFF)
    @TestCase([ -0x56, -0x45 ], 0xAABB)
    public shouldReadSingleUnsignedShort(input: number[], expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readShort(false);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34 ], 0x1234)
    @TestCase([ -0x5B, 0x45 ], -0x5ABB)
    public shouldReadSingleSignedShort(input: number[], expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readShort(true);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], [ 0x1234, 0x5678 ])
    @TestCase([ -0x55, -0x33, 0x11, 0x77], [ 0xABCD, 0x1177 ])
    public shouldReadTwoUnsignedShorts(input: Array<number>, expected: Array<number>) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readShort(false),
            buffer.readShort(false)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], [ 0x1234, 0x5678 ])
    @TestCase([ -0x35, 0x55, -0x5b, -0x11 ], [ -0x34AB, -0x5A11 ])
    public shouldReadTwoSignedShorts(input: Array<number>, expected: Array<number>) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readShort(true),
            buffer.readShort(true)
        ];

        Expect(output).toEqual(expected);
    }

}
