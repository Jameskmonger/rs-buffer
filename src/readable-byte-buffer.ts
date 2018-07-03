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

    public hasRemaining(): boolean {
        return this.position < this.buf.length;
    }

    public readByte(signed: boolean = true): number {
        const val = this.getNextFromBuffer() >>> 0;

        return signed && val > 0x7F ? val - 0x100 : val;
    }

    public readShort(signed: boolean = true): number {
        const val = (
            (this.getNextFromBuffer() << 8 >>> 0) +
            this.getNextFromBuffer() >>> 0
        );

        return signed && val > 0x7FFF ? val - 0x10000 : val;
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