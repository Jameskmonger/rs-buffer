import { TestFixture, TestCase, Test, Expect } from "alsatian";
import { ExpectBuffersToBeEqual } from "../expect";

import { FixedWritableByteBuffer, VariableWritableByteBuffer } from "../../src/";

@TestFixture("ByteBuffer#pushBits tests")
export class ByteBufferPushBitsTestFixture {

    @TestCase(0, 1, 0) // 00000000
    @TestCase(1, 1, 128) // 10000000
    @TestCase(3, 2, 192) // 11000000
    @TestCase(5, 3, 160) // 10100000
    @TestCase(14, 4, 224) // 11100000
    @TestCase(28, 5, 224) // 11100000
    @TestCase(61, 6, 244) // 11110100
    @TestCase(123, 7, 246) // 11110110
    @TestCase(215, 8, 215) // 11010111
    public shouldPushOnceCorrectly(value: number, count: number, expected: number) {
        const byteBuffer = new FixedWritableByteBuffer(1);

        byteBuffer.pushBits(count, value);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from([ expected ]));
    }

    @TestCase(15, 4, 2, 4, 242) // 11110010
    @TestCase(1, 6, 1, 2, 5) // 00000101
    public shouldPushTwiceCorrectly(firstValue: number, firstCount: number, secondValue: number, secondCount: number, expected: number) {
        const byteBuffer = new FixedWritableByteBuffer(1);

        byteBuffer.pushBits(firstCount, firstValue)
            .pushBits(secondCount, secondValue);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from([ expected ]));
    }

    @Test()
    public shouldPushByteDataAfter() {
        const byteBuffer = new FixedWritableByteBuffer(2);

        byteBuffer.pushBits(8, 0xFF);
        byteBuffer.pushByte(0x1A);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from([ 0xFF, 0x1A ]));
    }

    @Test()
    public shouldResumeBitAccessCorrectly() {
        const byteBuffer = new FixedWritableByteBuffer(4);

        byteBuffer.pushBits(8, 0xFF);
        byteBuffer.pushByte(0x1A);
        byteBuffer.pushBits(8, 0xF0);
        byteBuffer.pushByte(0x96);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from([ 0xFF, 0x1A, 0xF0, 0x96 ]));
    }

    @TestCase(65535, [ 255, 255 ]) // 1111111111111111
    @TestCase(38703, [ 151, 47 ]) // 1001011100101111
    public shouldPushSixteenBits(value: number, expected: Array<number>) {
        const byteBuffer = new FixedWritableByteBuffer(2);

        byteBuffer.pushBits(16, value);

        ExpectBuffersToBeEqual(byteBuffer.buffer, Buffer.from(expected));
    }

    @TestCase([[1, 1], [2, 3], [1, 1]], 0b1111)
    @TestCase([[1, 1], [3, 0]], 0b1000)
    @TestCase([[1, 0], [1, 1], [1, 0], [1, 1]], 0b0101)
    public shouldPushBitsCorrectly(pairs: [number, number][], expectedFirstNybble: number) {
        const byteBuffer = new VariableWritableByteBuffer();

        let bitContext = byteBuffer.pushBits(4, 0b1111);

        pairs.forEach(([count, value]) => {
            bitContext = bitContext.pushBits(count, value);
        });

        Expect(byteBuffer.buffer[0]).toBe(0b11110000 + expectedFirstNybble);
    }

}