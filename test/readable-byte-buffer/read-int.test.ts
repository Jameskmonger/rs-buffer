import { TestFixture, TestCase, Expect } from "alsatian";

import { ReadableByteBuffer, Transformation, DataOrder } from "../../src/";

@TestFixture("ByteBuffer#readInt tests")
export class ByteBufferReadIntTestFixture {

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], DataOrder.BIG_ENDIAN, false, 0x12345678)
    @TestCase([ -0x56, -0x45, -0x34, -0x23 ], DataOrder.BIG_ENDIAN, false, 0xAABBCCDD)
    @TestCase([ 0x56, 0x78, 0x12, 0x34 ], DataOrder.BIG_ENDIAN, true, 0x12345678)
    @TestCase([ -0x34, -0x23, -0x56, -0x45 ], DataOrder.BIG_ENDIAN, true, 0xAABBCCDD)
    @TestCase([ 0x78, 0x56, 0x34, 0x12 ], DataOrder.LITTLE_ENDIAN, false, 0x12345678)
    @TestCase([ -0x23, -0x34, -0x45, -0x56 ], DataOrder.LITTLE_ENDIAN, false, 0xAABBCCDD)
    @TestCase([ 0x34, 0x12, 0x78, 0x56 ], DataOrder.LITTLE_ENDIAN, true, 0x12345678)
    @TestCase([ -0x45, -0x56, -0x23, -0x34 ], DataOrder.LITTLE_ENDIAN, true, 0xAABBCCDD)
    public shouldReadUnsignedInt(input: Array<number>, order: DataOrder, mixed: boolean, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(false, Transformation.NONE, order, mixed);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56, 0x78 ], DataOrder.BIG_ENDIAN, false, 0x12345678)
    @TestCase([ -0x5B, 0x44, 0x33, 0x23 ], DataOrder.BIG_ENDIAN, false, -0x5ABBCCDD)
    @TestCase([ 0x56, 0x78, 0x12, 0x34 ], DataOrder.BIG_ENDIAN, true, 0x12345678)
    @TestCase([ 0x33, 0x23, -0x5B, 0x44 ], DataOrder.BIG_ENDIAN, true, -0x5ABBCCDD)
    @TestCase([ 0x78, 0x56, 0x34, 0x12 ], DataOrder.LITTLE_ENDIAN, false, 0x12345678)
    @TestCase([ 0x23, 0x33, 0x44, -0x5B ], DataOrder.LITTLE_ENDIAN, false, -0x5ABBCCDD)
    @TestCase([ 0x34, 0x12, 0x78, 0x56 ], DataOrder.LITTLE_ENDIAN, true, 0x12345678)
    @TestCase([ 0x44, -0x5B, 0x23, 0x33 ], DataOrder.LITTLE_ENDIAN, true, -0x5ABBCCDD)
    public shouldReadSignedInt(input: Array<number>, order: DataOrder, mixed: boolean, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(true, Transformation.NONE, order, mixed);

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

    @TestCase([ 0x12, 0x34, 0x56, -0x08 ], DataOrder.BIG_ENDIAN, false, 0x12345678)
    @TestCase([ 0x56, -0x08, 0x12, 0x34 ], DataOrder.BIG_ENDIAN, true, 0x12345678)
    @TestCase([ -0x08, 0x56, 0x34, 0x12 ], DataOrder.LITTLE_ENDIAN, false, 0x12345678)
    @TestCase([ 0x34, 0x12, -0x08, 0x56 ], DataOrder.LITTLE_ENDIAN, true, 0x12345678)
    public shouldApplyTransformationCorrectlyWhenOrdered(input: Array<number>, order: DataOrder, mixed: boolean, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readInt(false, Transformation.ADD, order, mixed);

        Expect(output).toBe(expected);
    }

}
