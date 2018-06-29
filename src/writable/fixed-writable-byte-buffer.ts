import { getUnsignedByte } from "../util/get-unsigned-byte";
import { WritableByteBuffer } from "./writable-byte-buffer";

export class FixedWritableByteBuffer extends WritableByteBuffer {
    protected buf: Buffer;

    constructor(size: number = 16) {
        super();

        this.buf = Buffer.alloc(size);
    }

    protected pushSingleByte(value: number): void {
        this.setSingleByte(this.position++, value);
    }

    protected setSingleByte(position: number, value: number): void {
        const byteValue = getUnsignedByte(value);

        this.buf.writeUInt8(byteValue, position);
    }

    protected getSingleByte(position: number): number {
        return this.buf[position];
    }

    public get buffer(): Buffer {
        return this.buf;
    }

    public setPositionToEnd(): void {
        this.position = this.buf.length - 1;
    }
}