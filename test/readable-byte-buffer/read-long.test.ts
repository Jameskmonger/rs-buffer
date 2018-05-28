import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../src/";

@TestFixture("ByteBuffer#readLong tests")
export class ByteBufferReadLongTestFixture {

    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0xA1, 0xB2, 0xC3, 0xD4 ], [ 0x12345678, 0xA1B2C3D4 ])
    @TestCase([ 0xAA, 0xBB, 0xCC, 0xDD, 0xF3, 0x3F, 0xAD, 0xDA ], [ 0xAABBCCDD, 0xF33fADDA ])
    public shouldReadSingleUnsignedLong(input: Array<number>, expected: [ number, number ]) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = buffer.readLong(false);

        Expect(output).toEqual(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0x71, 0xB2, 0xC3, 0xD4 ], [ 0x12345678, 0x71B2C3D4 ])
    @TestCase([ 0xA5, 0x44, 0x33, 0x23, 0xE4, 0xD2, 0xC0, 0xB2 ], [ -0x5ABBCCDD, -0x1B2D3F4E ])
    public shouldReadSingleSignedLong(input: Array<number>, expected: [ number, number ]) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = buffer.readLong(true);

        Expect(output).toEqual(expected);
    }

    @TestCase([ 
        0x12, 0x34, 0x56, 0x78, 0x33, 0x4E, 0xF5, 0x55,
        0xAB, 0xCD, 0xEF, 0x12, 0xFF, 0x5F, 0x33, 0x2A
    ], [[ 0x12345678, 0x334EF555 ], [ 0xABCDEF12, 0xFF5F332A ]])
    @TestCase([
        0xAB, 0xCD, 0x11, 0x0F, 0x8A, 0x13, 0x55, 0xEE,
        0x77, 0x1D, 0x39, 0xE3, 0xAA, 0xBC, 0xDD, 0xEF
    ], [[ 0xABCD110F, 0x8A1355EE ], [ 0x771D39E3, 0xAABCDDEF ]])
    public shouldReadTwoUnsignedLongs(input: Array<number>, expected: Array<[ number, number ]>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readLong(false),
            buffer.readLong(false)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([ 
        0x12, 0x34, 0x56, 0x78, 0x71, 0xB2, 0xC3, 0xD4,
        0x31, 0x52, 0x63, 0x74, 0x55, 0x66, 0x77, 0x99
    ], [[ 0x12345678, 0x71B2C3D4 ], [ 0x31526374, 0x55667799 ]])
    @TestCase([ 
        0xCB, 0x54, 0xEE, 0x12, 0xED, 0xCB, 0xA9, 0x88,
        0xA5, 0xEE, 0x01, 0xBD, 0x87, 0x74, 0x77, 0x38
    ], [[ -0x34AB11EE, -0x12345678 ], [ -0x5A11FE43, -0x788B88C8 ]])
    public shouldReadTwoSignedLongs(input: Array<number>, expected: Array<[ number, number ]>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readLong(true),
            buffer.readLong(true)
        ];

        Expect(output).toEqual(expected);
    }

}