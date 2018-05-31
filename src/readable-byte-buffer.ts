export class ReadableByteBuffer {

    private position: number;
    private buf: Buffer;

    constructor(buffer: Buffer) {
        this.position = 0;
        this.buf = buffer;
    }

    public static fromArray(array: Array<number>): ReadableByteBuffer {
        const buf = Buffer.from(array);

        return new ReadableByteBuffer(buf);
    }
    
    private getNextFromBuffer() {
        return this.buf.readUInt8(this.position++);
    }

    public readByte(signed: boolean): number {
        const val = this.getNextFromBuffer() >>> 0;

        if (signed && val > 0x7F) {
            return val - 0x100;
        }

        return val;
    }

    public readShort(signed: boolean): number {
        const val = (
            (this.getNextFromBuffer() << 8 >>> 0) +
            this.getNextFromBuffer() >>> 0
        );

        if(signed && val > 0x7FFF) {
            return val - 0x10000;
        }

        return val;
    }

    public readTribyte(signed: boolean): number {
        const val = (
            (this.getNextFromBuffer() << 16 >>> 0) +
            (this.getNextFromBuffer() << 8 >>> 0) +
            this.getNextFromBuffer() >>> 0
        );

        if(signed && val > 0x7FFFFF) {
            return val - 0x1000000;
        }

        return val;
    }

    public readInt(signed: boolean): number {
        const val = (
            (this.getNextFromBuffer() << 24 >>> 0) +
            (this.getNextFromBuffer() << 16 >>> 0) +
            (this.getNextFromBuffer() << 8 >>> 0) +
            this.getNextFromBuffer() >>> 0
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