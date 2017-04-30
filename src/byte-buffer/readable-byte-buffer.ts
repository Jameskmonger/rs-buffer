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

    public readByte(signed: boolean = false) {
        const val = this.payload[this.position++];

        if (signed) {
            return val;
        }

        return getUnsignedByte(val);
    }

}