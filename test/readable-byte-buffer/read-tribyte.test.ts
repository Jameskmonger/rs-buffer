import { TestFixture, TestCase, Expect } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../src/";

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

    @TestCase([ -0x56, -0x45, -0x34 ], Transformation.NONE, 0xAABBCC)
    @TestCase([ -0x56, -0x45, 0x4C ], Transformation.ADD, 0xAABBCC)
    @TestCase([ -0x56, -0x45, -0x4C ], Transformation.SUBTRACT, 0xAABBCC)
    @TestCase([ -0x56, -0x45, 0x34 ], Transformation.NEGATE, 0xAABBCC)
    public shouldReadUnsignedTribyteWithCorrectTransformation(input: Array<number>, transformation: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readTribyte(false, transformation);

        Expect(output).toBe(expected);
    }

    @TestCase([ -0x13, -0x35, -0x56 ], Transformation.NONE, -0x123456)
    @TestCase([ -0x13, -0x35, 0x2A ], Transformation.ADD, -0x123456)
    @TestCase([ -0x13, -0x35, -0x2A ], Transformation.SUBTRACT, -0x123456)
    @TestCase([ -0x13, -0x35, 0x56 ], Transformation.NEGATE, -0x123456)
    public shouldReadSignedTribyteWithCorrectTransformation(input: Array<number>, transformation: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readTribyte(true, transformation);

        Expect(output).toBe(expected);
    }
}
