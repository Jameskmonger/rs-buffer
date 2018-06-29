import { getUnsignedByte } from "../util/get-unsigned-byte";
import { WritableByteBuffer } from "./writable-byte-buffer";

export class VariableWritableByteBuffer extends WritableByteBuffer {
    protected buf: number[];

    constructor() {
        super();

        this.buf = [];
    }

    protected pushSingleByte(value: number): void {
        this.setSingleByte(this.position++, value);
    }

    protected setSingleByte(position: number, value: number): void {
        const byteValue = getUnsignedByte(value);

        this.buf[position] = byteValue;
    }

    protected getSingleByte(position: number): number {
        return this.buf[position];
    }

    public get buffer(): Buffer {
        return Buffer.from(this.buf);
    }
}