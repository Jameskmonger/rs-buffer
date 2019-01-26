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

    public readTribyte(signed: boolean = true, transformation: Transformation = Transformation.NONE): number {
        const msb1 = this.getNextFromBuffer() & 0xFF;
        const msb2 = this.getNextFromBuffer() & 0xFF;
        const lsb = reverseTransformation(this.getNextFromBuffer(), transformation) & 0xFF;

        const result = (msb1 << 16) + (msb2 << 8) + (lsb);

        return signed
            ? wrapNumber(result, -0x800000, 0x7FFFFF)
            : result & 0xFFFFFF;
    }

    public readInt(signed: boolean = true, transformation: Transformation = Transformation.NONE): number {
        if (signed) {
            return this.readSignedInt(transformation);
        }

        return this.readUnsignedInt(transformation);
    }

    private readUnsignedInt(transformation: Transformation) {
        const msb1 = this.getNextFromBuffer() & 0xFF;
        const msb2 = this.getNextFromBuffer() & 0xFF;
        const msb3 = this.getNextFromBuffer() & 0xFF;
        const lsb = reverseTransformation(this.getNextFromBuffer(), transformation) & 0xFF;

        return (msb1 << 24 >>> 0) + (msb2 << 16) + (msb3 << 8) + (lsb);
    }

    private readSignedInt(transformation: Transformation) {
        const msb1 = this.getNextFromBuffer();
        const msb2 = this.getNextFromBuffer();
        const msb3 = this.getNextFromBuffer();

        const lsb = this.getNextFromBuffer();
        const transformedLsb = reverseTransformation(lsb, transformation);
        const wrappedLsb = wrapNumber(transformedLsb, -0x80, 0x7F);

        const result = (msb1 << 24) + (msb2 << 16) + (msb3 << 8) + (wrappedLsb);
        return wrapNumber(result, -0x80000000, 0x7FFFFFFF);
    }

    public readLong(): [ number, number ] {
        const high = this.readInt(false);
        const low = this.readInt(false);

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
