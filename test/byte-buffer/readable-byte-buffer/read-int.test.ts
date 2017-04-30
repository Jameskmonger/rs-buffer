import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../../src/byte-buffer";

@TestFixture("ByteBuffer#readInt tests")
export class ByteBufferReadIntTestFixture {

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], 0x12345678)
    @TestCase([ 0xAA, 0xBB, 0xCC, 0xDD ], 0xAABBCCDD)
    public shouldReadSingleUnsignedInt(input: Array<number>, expected: number) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = buffer.readInt(false);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], 0x12345678)
    @TestCase([ 0xA5, 0x44, 0x33, 0x23 ], -0x5ABBCCDD)
    public shouldReadSingleSignedInt(input: Array<number>, expected: number) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = buffer.readInt(true);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0xAB, 0xCD, 0xEF, 0x12 ], [ 0x12345678, 0xABCDEF12 ])
    @TestCase([ 0xAB, 0xCD, 0x11, 0x0F, 0x77, 0x1D, 0x39, 0xE3 ], [ 0xABCD110F, 0x771D39E3 ])
    public shouldReadTwoUnsignedInts(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readInt(false),
            buffer.readInt(false)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0x31, 0x52, 0x63, 0x74 ], [ 0x12345678, 0x31526374 ])
    @TestCase([ 0xCB, 0x54, 0xEE, 0x12, 0xA5, 0xEE, 0x01, 0xBD ], [ -0x34AB11EE, -0x5A11FE43 ])
    public shouldReadTwoSignedInts(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readInt(true),
            buffer.readInt(true)
        ];

        Expect(output).toEqual(expected);
    }

}