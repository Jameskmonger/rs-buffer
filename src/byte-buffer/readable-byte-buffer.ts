import {
    getUnsignedByte
} from "./";

export class ReadableByteBuffer {

    private position: number;
    private payload: Array<number>;

    constructor(buffer: Array<number>) {
        this.position = 0;
        this.payload = buffer.slice(0);
    }

    public readByte(signed: boolean): number {
        const val = this.payload[this.position++] >>> 0;

        if (signed && val > 0x7F) {
            return val - 0x100;
        }

        return val;
    }

    public readShort(signed: boolean): number {
        const val = (
            (this.payload[this.position++] << 8 >>> 0) +
            this.payload[this.position++] >>> 0
        );

        if(signed && val > 0x7FFF) {
            return val - 0x10000;
        }

        return val;
    }

    public readTribyte(signed: boolean): number {
        const val = (
            (this.payload[this.position++] << 16 >>> 0) +
            (this.payload[this.position++] << 8 >>> 0) +
            this.payload[this.position++] >>> 0
        );

        if(signed && val > 0x7FFFFF) {
            return val - 0x1000000;
        }

        return val;
    }

    public readInt(signed: boolean): number {
        const val = (
            (this.payload[this.position++] << 24 >>> 0) +
            (this.payload[this.position++] << 16 >>> 0) +
            (this.payload[this.position++] << 8 >>> 0) +
            this.payload[this.position++] >>> 0
        );

        if(signed && val > 0x7FFFFFFF) {
            return val - 0x100000000;
        }

        return val;
    }

    public readLong(signed: boolean): [ number, number ] {
        const high = this.readInt(signed);
        const low = this.readInt(signed);

        return [ high, low ];
    }

    public readString(): string {
        let out = "";

        while (true) {
            const nextByte = this.readByte(false);

            if (nextByte === 0x0A) {
                break;
            }

            out += String.fromCharCode(nextByte);
        }

        return out;
    }

}