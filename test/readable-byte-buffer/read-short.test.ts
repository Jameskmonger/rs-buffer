import { TestFixture, TestCase, Expect, FocusTests, FocusTest } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../src/";

@TestFixture("ByteBuffer#readShort tests")
export class ByteBufferReadShortTestFixture {

    @TestCase([ 0x2F, -0x01 ], 0x2FFF)
    @TestCase([ -0x56, -0x45 ], 0xAABB)
    public shouldReadUnsignedShort(input: number[], expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readShort(false);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34 ], 0x1234)
    @TestCase([ -0x5B, 0x45 ], -0x5ABB)
    public shouldReadSignedShort(input: number[], expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readShort(true);

        Expect(output).toBe(expected);
    }

    @TestCase([0x12, 0x34], Transformation.NONE, 0x1234)
    @TestCase([0x01, -0x7E], Transformation.ADD, 0x0102)
    @TestCase([0x33, 0x3B], Transformation.SUBTRACT, 0x3345)
    @TestCase([0x77, -0x67], Transformation.NEGATE, 0x7767)
    public shouldReadUnsignedShortWithCorrectTransformation(input: Array<number>, transform: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readShort(false, transform)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([-0x35, 0x55], Transformation.NONE, -0x34AB)
    @TestCase([-0x35, -0x2b], Transformation.ADD, -0x34AB)
    @TestCase([-0x35, 0x2b], Transformation.SUBTRACT, -0x34AB)
    @TestCase([-0x35, -0x55], Transformation.NEGATE, -0x34AB)
    public shouldReadSignedShortWithCorrectTransformation(input: Array<number>, transform: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readShort(true, transform)
        ];

        Expect(output).toEqual(expected);
    }

}
