import { TestFixture, TestCase, Test, Expect } from "alsatian";

import { WritableByteBuffer } from "../../../src/byte-buffer";

@TestFixture("ByteBuffer#toBuffer tests")
export class ByteBufferToBufferTestFixture {

    @TestCase([ 0xFF, 0x12 ])
    @TestCase([ 0x1A, 0x2B, 0x3C, 0x4D ])
    public shouldCreateBufferWithCorrectData(data: Array<number>) {
        const byteBuffer = new WritableByteBuffer();

        data.forEach(b => byteBuffer.pushByte(b));

        const buffer = byteBuffer.toBuffer();

        Expect(buffer.byteLength).toBe(data.length);
        
        const bufferBytes = [];
        for (let i = 0; i < buffer.byteLength; i++) {
            bufferBytes.push(buffer.readUInt8(i));
        }

        Expect(bufferBytes).toEqual(data);
    }

}