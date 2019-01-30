import { Transformation } from "./transformation";
import { reverseTransformation } from "./util/apply-transformation";
import { wrapNumber } from "./util/wrap-number";
import { DataOrder } from ".";

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

    public readShort(signed: boolean = true, transformation: Transformation = Transformation.NONE, order: DataOrder = DataOrder.BIG_ENDIAN): number {
        const first = this.getNextFromBuffer();
        const second = this.getNextFromBuffer();

        const [msb, lsb] = order === DataOrder.BIG_ENDIAN
            ? [first, reverseTransformation(second, transformation)]
            : [second, reverseTransformation(first, transformation)];

        const result = (msb << 8) + (lsb & 0xFF);

        return signed
            ? wrapNumber(result, -0x8000, 0x7FFF)
            : result & 0xFFFF;
    }

    public readTribyte(signed: boolean = true, transformation: Transformation = Transformation.NONE, order: DataOrder = DataOrder.BIG_ENDIAN): number {
        const first = this.getNextFromBuffer();
        const second = this.getNextFromBuffer();
        const third = this.getNextFromBuffer();

        const [msb1, msb2, lsb] = order === DataOrder.BIG_ENDIAN
            ? [first & 0xFF, second & 0xFF, reverseTransformation(third, transformation) & 0xFF]
            : [third & 0xFF, second & 0xFF, reverseTransformation(first, transformation) & 0xFF];

        const result = (msb1 << 16) + (msb2 << 8) + (lsb);

        return signed
            ? wrapNumber(result, -0x800000, 0x7FFFFF)
            : result & 0xFFFFFF;
    }

    public readInt(signed: boolean = true, transformation: Transformation = Transformation.NONE, order: DataOrder = DataOrder.BIG_ENDIAN, mixed: boolean = false): number {
        const msb1 = this.getNextFromBuffer();
        const msb2 = this.getNextFromBuffer();
        const msb3 = this.getNextFromBuffer();
        const lsb = this.getNextFromBuffer();

        if (signed) {
            return this.readSignedInt(msb1, msb2, msb3, lsb, transformation, order, mixed);
        }

        return this.readUnsignedInt(msb1, msb2, msb3, lsb, transformation, order, mixed);
    }

    private orderIntOctets(first: number, second: number, third: number, fourth: number, order: DataOrder, mixed: boolean) {
        if (order === DataOrder.BIG_ENDIAN) {
            if (mixed) {
                return [ third, fourth, first, second ];
            } else {
                return [ first, second, third, fourth ];
            }
        } else if (order === DataOrder.LITTLE_ENDIAN) {
            if (mixed) {
                return [ second, first, fourth, third ];
            } else {
                return [ fourth, third, second, first ];
            }
        }
    }

    private readUnsignedInt(first: number, second: number, third: number, fourth: number, transformation: Transformation, order: DataOrder, mixed: boolean) {
        const [ msb1, msb2, msb3, lsb ] = this.orderIntOctets(first, second, third, fourth, order, mixed);

        const reversed = reverseTransformation(lsb, transformation);

        return (
            ((msb1 & 0xFF) << 24 >>> 0)
            + ((msb2 & 0xFF) << 16)
            + ((msb3 & 0xFF) << 8)
            + (reversed & 0xFF)
        );
    }

    private readSignedInt(first: number, second: number, third: number, fourth: number, transformation: Transformation, order: DataOrder, mixed: boolean) {
        const [ msb1, msb2, msb3, lsb ] = this.orderIntOctets(first, second, third, fourth, order, mixed);

        const transformedLsb = reverseTransformation(lsb, transformation);
        const wrappedLsb = wrapNumber(transformedLsb, -0x80, 0x7F);

        const result = (msb1 << 24) + (msb2 << 16) + (msb3 << 8) + (wrappedLsb);
        return wrapNumber(result, -0x80000000, 0x7FFFFFFF);
    }

    public readLong(transformation: Transformation = Transformation.NONE, order: DataOrder = DataOrder.BIG_ENDIAN): [number, number] {
        if (order === DataOrder.BIG_ENDIAN) {
            const first = this.readInt(false, Transformation.NONE, order);
            const second = this.readInt(false, transformation, order);

            return [ first, second ];
        }

        const first = this.readInt(false, transformation, order);
        const second = this.readInt(false, Transformation.NONE, order);

        return [ second, first ];
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
