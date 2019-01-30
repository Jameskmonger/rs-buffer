import { TestFixture, TestCase, Expect } from "alsatian";

import { ReadableByteBuffer, Transformation, DataOrder } from "../../src/";

@TestFixture("ByteBuffer#readShort tests")
export class ByteBufferReadShortTestFixture {

    @TestCase([ 0x2F, -0x01 ], DataOrder.BIG_ENDIAN, 0x2FFF)
    @TestCase([ -0x56, -0x45 ], DataOrder.BIG_ENDIAN, 0xAABB)
    @TestCase([ -0x01, 0x2F ], DataOrder.LITTLE_ENDIAN, 0x2FFF)
    @TestCase([ -0x45, -0x56 ], DataOrder.LITTLE_ENDIAN, 0xAABB)
    public shouldReadUnsignedShort(input: number[], order: DataOrder, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readShort(false, Transformation.NONE, order);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34 ], DataOrder.BIG_ENDIAN, 0x1234)
    @TestCase([ -0x5B, 0x45 ], DataOrder.BIG_ENDIAN, -0x5ABB)
    @TestCase([ 0x34, 0x12 ], DataOrder.LITTLE_ENDIAN, 0x1234)
    @TestCase([ 0x45, -0x5B ], DataOrder.LITTLE_ENDIAN, -0x5ABB)
    public shouldReadSignedShort(input: number[], order: DataOrder, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readShort(true, Transformation.NONE, order);

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

    @TestCase([0x3B, 0x33], Transformation.SUBTRACT, 0x3345)
    @TestCase([-0x67, 0x77], Transformation.NEGATE, 0x7767)
    public shouldApplyTransformationCorrectlyInLittleEndianOrder(input: Array<number>, transform: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = [
            buffer.readShort(false, transform, DataOrder.LITTLE_ENDIAN)
        ];

        Expect(output).toEqual(expected);
    }

}
