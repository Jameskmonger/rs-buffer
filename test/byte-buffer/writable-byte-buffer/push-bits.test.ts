import { TestFixture, TestCase, Test, Expect } from "alsatian";

import { Transformation } from "../../../src/byte-buffer";
import { WritableByteBuffer } from "../../../src/byte-buffer/writable-byte-buffer";

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
        const byteBuffer = new WritableByteBuffer();

        byteBuffer.bitAccess()
            .pushBits(count, value);

        Expect(byteBuffer.getPayload()).toEqual([ expected ]);
    }

    @TestCase(15, 4, 2, 4, 242) // 11110010
    @TestCase(1, 6, 1, 2, 5) // 00000101
    public shouldPushTwiceCorrectly(firstValue: number, firstCount: number, secondValue: number, secondCount: number, expected: number) {
        const byteBuffer = new WritableByteBuffer();

        byteBuffer.bitAccess()
            .pushBits(firstCount, firstValue)
            .pushBits(secondCount, secondValue);

        Expect(byteBuffer.getPayload()).toEqual([ expected ]);
    }

    @Test()
    public shouldPushByteDataAfter() {
        const byteBuffer = new WritableByteBuffer();

        byteBuffer.bitAccess()
            .pushBits(8, 0xFF);

        byteBuffer.pushByte(0x1A, Transformation.NONE);

        Expect(byteBuffer.getPayload()).toEqual([ 0xFF, 0x1A ]);
    }

}