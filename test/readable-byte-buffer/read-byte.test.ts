import { TestFixture, TestCase, Expect, FocusTest, FocusTests } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../src/";

@FocusTests
@TestFixture("ByteBuffer#readByte tests")
export class ByteBufferReadByteTestFixture {

    @TestCase(0x12, 0x12)
    @TestCase(-0x34, 0xCC)
    public shouldReadSingleUnsignedByte(input: number, expected: number) {
        const buffer = ReadableByteBuffer.fromArray([input]);

        const output = buffer.readByte(false);

        Expect(output).toBe(expected);
    }

    @TestCase(0x12, 0x12)
    @TestCase(-0x34, -0x34)
    public shouldReadSingleSignedByte(input: number, expected: number) {
        const buffer = ReadableByteBuffer.fromArray([input]);

        const output = buffer.readByte(true);

        Expect(output).toBe(expected);
    }

    @TestCase([0x12, 0x34], [0x12, 0x34])
    @TestCase([-0x34, -0x5A], [0xCC, 0xA6])
    public shouldReadTwoUnsignedBytes(input: Array<number>, expected: Array<number>) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readByte(false),
            buffer.readByte(false)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([0x12, 0x34], [0x12, 0x34])
    @TestCase([-0x34, -0x5A], [-0x34, -0x5A])
    public shouldReadTwoSignedBytes(input: Array<number>, expected: Array<number>) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readByte(true),
            buffer.readByte(true)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([0x12], Transformation.NONE, 0x12)
    @TestCase([0x7F], Transformation.NONE, 0x7F)
    @TestCase([-0x10], Transformation.ADD, 0x70)
    @TestCase([0x32], Transformation.ADD, -0x4E)
    @TestCase([-0x01], Transformation.ADD, 0x7F)
    @TestCase([0x6E], Transformation.SUBTRACT, 0x12)
    @TestCase([0x01], Transformation.SUBTRACT, 0x7F)
    @TestCase([-0x12], Transformation.NEGATE, 0x12)
    @TestCase([-0x7E], Transformation.NEGATE, 0x7E)
    public shouldReadSignedByteWithCorrectTransformation(input: Array<number>, transform: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readByte(true, transform)
        ];

        Expect(output).toEqual(expected);
    }

    @TestCase([0x12], Transformation.NONE, 0x12)
    @TestCase([0x7F], Transformation.NONE, 0x7F)
    @TestCase([0x6F], Transformation.ADD, 0xEF)
    @TestCase([0x32], Transformation.ADD, 0xB2)
    @TestCase([-0x12], Transformation.SUBTRACT, 0x92)
    @TestCase([0x01], Transformation.SUBTRACT, 0x7F)
    @TestCase([-0x12], Transformation.NEGATE, 0x12)
    @TestCase([-0x33], Transformation.NEGATE, 0x33)
    public shouldReadUnsignedByteWithCorrectTransformation(input: Array<number>, transform: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readByte(false, transform)
        ];

        Expect(output).toEqual(expected);
    }

}
