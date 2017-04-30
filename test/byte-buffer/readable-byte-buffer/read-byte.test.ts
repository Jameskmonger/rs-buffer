import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../../src/byte-buffer";

@TestFixture("ByteBuffer#readByte tests")
export class ByteBufferReadByteTestFixture {

    @TestCase(0x12, 0x12)
    @TestCase(-0x34, 0xCC)
    public shouldReadSingleUnsignedByte(input: number, expected: number) {
        const buffer = new ReadableByteBuffer([ input ]);
        
        const output = buffer.readByte(false);

        Expect(output).toBe(expected);
    }

    @TestCase(0x12, 0x12)
    @TestCase(-0x34, -0x34)
    public shouldReadSingleSignedByte(input: number, expected: number) {
        const buffer = new ReadableByteBuffer([ input ]);
        
        const output = buffer.readByte(true);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34 ], [ 0x12, 0x34 ])
    @TestCase([ -0x34, -0x5A], [ 0xCC, 0xA6 ])
    public shouldReadTwoUnsignedBytes(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readByte(false),
            buffer.readByte(false)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([ 0x12, 0x34 ], [ 0x12, 0x34 ])
    @TestCase([ -0x34, -0x5A], [ -0x34, -0x5A ])
    public shouldReadTwoSignedBytes(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readByte(true),
            buffer.readByte(true)
        ];

        Expect(output).toEqual(expected);
    }

}