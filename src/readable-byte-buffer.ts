import { Transformation } from "./transformation";
import { reverseTransformation } from "./util/apply-transformation";
import { wrapNumber } from "./util/wrap-number";

export class ReadableByteBuffer {

    private position: number;
    private buf: Buffer;

    constructor(buffer: Buffer) {
        this.position = 0;
        this.buf = buffer;
    }

    public static fromArray(array: Array<number>): ReadableByteBuffer {
        if (array.some(x => x < -0x80 || x > 0x7F)) {
            throw Error("Values must be between -128 and 127");
        }

        const buf = Buffer.from(array);

        return new ReadableByteBuffer(buf);
    }

    private getNextFromBuffer() {
        return this.buf.readInt8(this.position++);
    }

    public hasRemaining(): boolean {
        return this.position < this.buf.length;
    }

    public readByte(signed: boolean = true, transformation: Transformation = Transformation.NONE): number {
        const val = this.getNextFromBuffer();

        const transformed = reverseTransformation(val, transformation);

        return signed
            ? wrapNumber(transformed, -0x80, 0x7F)
            : transformed & 0xFF;
    }

    public readShort(signed: boolean = true, transformation: Transformation = Transformation.NONE): number {
        const msb = this.getNextFromBuffer();
        const lsb = reverseTransformation(this.getNextFromBuffer(), transformation);

        const result = (msb << 8) + (lsb & 0xFF);

        return signed
            ? wrapNumber(result, -0x8000, 0x7FFF)
            : result & 0xFFFF;
    }

    public readTribyte(signed: boolean = true): number {
        const val = (
            (this.getNextFromBuffer() << 16 >>> 0) +
            (this.getNextFromBuffer() << 8 >>> 0) +
            this.getNextFromBuffer() >>> 0
        );

        return signed && val > 0x7FFFFF ? val - 0x1000000 : val;
    }

    public readInt(signed: boolean = true): number {
        const val = (
            (this.getNextFromBuffer() << 24 >>> 0) +
            (this.getNextFromBuffer() << 16 >>> 0) +
            (this.getNextFromBuffer() << 8 >>> 0) +
            this.getNextFromBuffer() >>> 0
        );

        return signed && val > 0x7FFFFFFF ? val - 0x100000000 : val;
    }

    public readLong(): [ number, number ] {
        const high = this.readInt(true);
        const low = this.readInt(true);

        return [ high, low ];
    }

    public readString(): string {
        let out = "";

        while (true) {
            const nextByte = this.readByte(true);

            if (nextByte === 0x0A) {
                break;
            }

            out += String.fromCharCode(nextByte);
        }

        return out;
    }

}
