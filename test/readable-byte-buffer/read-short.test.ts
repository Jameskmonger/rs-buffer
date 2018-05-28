import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../src/";

@TestFixture("ByteBuffer#readShort tests")
export class ByteBufferReadShortTestFixture {

    @TestCase(0x12, 0x34, 0x1234)
    @TestCase(0xAA, 0xBB, 0xAABB)
    public shouldReadSingleUnsignedShort(first: number, second: number, expected: number) {
        const buffer = new ReadableByteBuffer([ first, second ]);
        
        const output = buffer.readShort(false);

        Expect(output).toBe(expected);
    }

    @TestCase(0x12, 0x34, 0x1234)
    @TestCase(0xA5, 0x45, -0x5ABB)
    public shouldReadSingleSignedShort(first: number, second: number, expected: number) {
        const buffer = new ReadableByteBuffer([ first, second ]);
        
        const output = buffer.readShort(true);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], [ 0x1234, 0x5678 ])
    @TestCase([ 0xAB, 0xCD, 0x11, 0x77], [ 0xABCD, 0x1177 ])
    public shouldReadTwoUnsignedShorts(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readShort(false),
            buffer.readShort(false)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], [ 0x1234, 0x5678 ])
    @TestCase([ 0xCB, 0x55, 0xA5, 0xEF ], [ -0x34AB, -0x5A11 ])
    public shouldReadTwoSignedShorts(input: Array<number>, expected: Array<number>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readShort(true),
            buffer.readShort(true)
        ];

        Expect(output).toEqual(expected);
    }

}