import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";
import * as Long from "long";

import { ReadableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#readLong tests")
export class ByteBufferReadLongTestFixture {
    
    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0x71, 0xB2, 0xC3, 0xD4 ], "0x1234567871B2C3D4")
    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0x71, -0x4E, -0x3D, -0x2C ], "0x1234567871B2C3D4")
    @TestCase([ -0x5B, 0x44, 0x33, 0x22, -0x1C, -0x2E, -0x40, -0x4E ], "-0x5ABBCCDD1B2D3F4E")
    public shouldReadSingleLong(input: number[], expected: string) {
        const expectedLong = Long.fromString(expected, 16);

        const buffer = ReadableByteBuffer.fromArray(input);
        
        const output = buffer.readLong();

        Expect(output).toEqual([ expectedLong.getHighBits(), expectedLong.getLowBits() ]);
    }

    @TestCase([ 
        0x12, 0x34, 0x56, 0x78, 0x71, 0xB2, 0xC3, 0xD4,
        0x31, 0x52, 0x63, 0x74, 0x55, 0x66, 0x77, 0x99
    ], [ "0x1234567871B2C3D4", "0x3152637455667799" ])
    @TestCase([ 
        -0x35, 0x54, -0x12, 0x11, -0x13, -0x35, -0x57, -0x78,
        -0x5B, -0x12, 0x01, -0x44, -0x79, 0x74, 0x77, 0x38
    ], [ "-0x34AB11EE12345678", "-0x5A11FE43788B88C8" ])
    public shouldReadTwoLongs(input: number[], expected: string[]) {
        const expectedOutput
            = expected.map(e => Long.fromString(e, 16))
                    .map(e => [ e.getHighBits(), e.getLowBits() ]);

        const buffer = ReadableByteBuffer.fromArray(input);
        
        const output = [
            buffer.readLong(),
            buffer.readLong()
        ];

        Expect(output).toEqual(expectedOutput);
    }

}