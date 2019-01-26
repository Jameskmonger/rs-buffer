import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";
import * as Long from "long";

import { ReadableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#readLong tests")
export class ByteBufferReadLongTestFixture {

    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0x71, 0xB2, 0xC3, 0xD4 ], "0x1234567871B2C3D4")
    @TestCase([ 0x12, 0x34, 0x56, 0x78, 0x71, -0x4E, -0x3D, -0x2C ], "0x1234567871B2C3D4")
    @TestCase([ -0x5B, 0x44, 0x33, 0x22, -0x1C, -0x2E, -0x40, -0x4E ], "-0x5ABBCCDD1B2D3F4E")
    public shouldReadLong(input: number[], expected: string) {
        const expectedLong = Long.fromString(expected, 16);

        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readLong();

        Expect(output).toEqual([ expectedLong.getHighBits(), expectedLong.getLowBits() ]);
    }

}
