import { TestFixture, TestCase, Expect, FocusTest, FocusTests } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../src/";

@TestFixture("ByteBuffer#readInt tests")
export class ByteBufferReadIntTestFixture {

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], 0x12345678)
    @TestCase([ -0x56, -0x45, -0x34, -0x23 ], 0xAABBCCDD)
    public shouldReadUnsignedInt(input: Array<number>, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(false);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], 0x12345678)
    @TestCase([ -0x5B, 0x44, 0x33, 0x23 ], -0x5ABBCCDD)
    public shouldReadSignedInt(input: Array<number>, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(true);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], Transformation.NONE, 0x12345678)
    @TestCase([ 0x12, 0x34, 0x56, -0x08 ], Transformation.ADD, 0x12345678)
    @TestCase([ 0x12, 0x34, 0x56, 0x08 ], Transformation.SUBTRACT, 0x12345678)
    @TestCase([ 0x12, 0x34, 0x56, -0x78 ], Transformation.NEGATE, 0x12345678)
    public shouldReadUnsignedIntWithCorrectTransformation(input: Array<number>, transformation: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(false, transformation);

        Expect(output).toBe(expected);
    }

    @TestCase([ -0x5B, 0x44, 0x33, 0x23 ], Transformation.NONE, -0x5ABBCCDD)
    @TestCase([ -0x5B, 0x44, 0x33, -0x5D ], Transformation.ADD, -0x5ABBCCDD)
    @TestCase([ -0x5B, 0x44, 0x33, 0x5D ], Transformation.SUBTRACT, -0x5ABBCCDD)
    @TestCase([ -0x5B, 0x44, 0x33, -0x23 ], Transformation.NEGATE, -0x5ABBCCDD)
    public shouldReadSignedIntWithCorrectTransformation(input: Array<number>, transformation: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(true, transformation);

        Expect(output).toBe(expected);
    }

}
