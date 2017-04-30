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
        const val = this.payload[this.position++];

        if (signed && val > 0x7F) {
            return val - 0x100;
        }

        return val;
    }

    public readShort(signed: boolean): number {
        const val = (
            (this.payload[this.position++] << 8) +
            this.payload[this.position++]
        );

        if(signed && val > 0x7FFF) {
            return val - 0x10000;
        }

        return val;
    }

    public readTribyte(signed: boolean): number {
        const val = (
            (this.payload[this.position++] << 16) +
            (this.payload[this.position++] << 8) +
            this.payload[this.position++]
        );

        if(signed && val > 0x7FFFFF) {
            return val - 0x1000000;
        }

        return val;
    }

}