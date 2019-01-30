import { TestFixture, TestCase, Expect } from "alsatian";

import { ReadableByteBuffer, Transformation, DataOrder } from "../../src/";

@TestFixture("ByteBuffer#readTribyte tests")
export class ByteBufferReadTribyteTestFixture {

    @TestCase([ 0x12, 0x34, 0x56 ], DataOrder.BIG_ENDIAN, 0x123456)
    @TestCase([ -0x56, -0x45, -0x34 ], DataOrder.BIG_ENDIAN, 0xAABBCC)
    @TestCase([ 0x56, 0x34, 0x12 ], DataOrder.LITTLE_ENDIAN, 0x123456)
    @TestCase([ -0x34, -0x45, -0x56 ], DataOrder.LITTLE_ENDIAN, 0xAABBCC)
    public shouldReadUnsignedTribyte(input: Array<number>, order: DataOrder, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readTribyte(false, Transformation.NONE, order);

        Expect(output).toBe(expected);
    }

    @TestCase([ 0x12, 0x34, 0x56 ], DataOrder.BIG_ENDIAN, 0x123456)
    @TestCase([ -0x5B, 0x44, 0x34 ], DataOrder.BIG_ENDIAN, -0x5ABBCC)
    @TestCase([ 0x56, 0x34, 0x12 ], DataOrder.LITTLE_ENDIAN, 0x123456)
    @TestCase([ 0x34, 0x44, -0x5B ], DataOrder.LITTLE_ENDIAN, -0x5ABBCC)
    public shouldReadSignedTribyte(input: Array<number>, order: DataOrder, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readTribyte(true, Transformation.NONE, order);

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

    @TestCase([ -0x4C, -0x45, -0x56 ], Transformation.SUBTRACT, 0xAABBCC)
    @TestCase([ 0x34, -0x45, -0x56 ], Transformation.NEGATE, 0xAABBCC)
    public shouldApplyTransformationCorrectlyInLittleEndianOrder(input: Array<number>, transformation: Transformation, expected: number) {
        const buffer = ReadableByteBuffer.fromArray(input);

        const output = buffer.readTribyte(false, transformation, DataOrder.LITTLE_ENDIAN);

        Expect(output).toBe(expected);
    }
}
