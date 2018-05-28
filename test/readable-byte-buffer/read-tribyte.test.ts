import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../src/";

@TestFixture("ByteBuffer#readTribyte tests")
export class ByteBufferReadTribyteTestFixture {

    @TestCase([ 0x12, 0x34, 0x56 ], 0x123456)
    @TestCase([ 0xAA, 0xBB, 0xCC ], 0xAABBCC)
    public shouldReadSingleUnsignedTribyte(input: Array<number>, expected: number) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = buffer.readTribyte(false);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56 ], 0x123456)
    @TestCase([ 0xA5, 0x44, 0x34 ], -0x5ABBCC)
    public shouldReadSingleSignedTribyte(input: Array<number>, expected: number) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = buffer.readTribyte(true);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0xAB, 0xCD, 0xEF ], [ 0x123456, 0xABCDEF ])
    @TestCase([ 0xAB, 0xCD, 0x11, 0x77, 0x1D, 0x39 ], [ 0xABCD11, 0x771D39 ])
    public shouldReadTwoUnsignedTribytes(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readTribyte(false),
            buffer.readTribyte(false)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x31, 0x52, 0x63 ], [ 0x123456, 0x315263 ])
    @TestCase([ 0xCB, 0x54, 0xEF, 0xA5, 0xEE, 0x02 ], [ -0x34AB11, -0x5A11FE ])
    public shouldReadTwoSignedTribytes(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readTribyte(true),
            buffer.readTribyte(true)
        ];

        Expect(output).toEqual(expected);
    }

}