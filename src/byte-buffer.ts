import getSigned32BitInt from "get-signed-32-bit-int";

const UNSIGNED_8_BIT_MAX = 255;
const UNSIGNED_16_BIT_MAX = 65535;

const isUnsigned8BitInt = (value) => value >= 0 && value <= UNSIGNED_8_BIT_MAX;
const isUnsigned16BitInt = (value) => value >= 0 && value <= UNSIGNED_16_BIT_MAX;

const getUnsignedByte = (value) => value & 0xFF;

export class ByteBuffer {

  private payload: Array<number>;

  constructor () {
    this.payload = [];
  }

  public pushByte(value: number): ByteBuffer {
    if (!isUnsigned8BitInt(value)) {
      throw Error("ByteBuffer#pushByte accepts a value between 0 and 255.");
    }

    this.payload.push(value);

    return this;
  }

  public pushShort(value: number): ByteBuffer {
    if (!isUnsigned16BitInt(value)) {
      throw Error("ByteBuffer#pushShort accepts a value between 0 and 65535.");
    }

    this.pushByte(getUnsignedByte(value));
    this.pushByte(getUnsignedByte(value >> 8));

    return this;
  }

  public pushBits(count: number, value: number): ByteBuffer {
    return this;
  }

  public pushBit(value: number): ByteBuffer {
    return this;
  }

  public pushString(value: string): ByteBuffer {
    return this;
  }

  public bitAccess(): ByteBuffer {
    return this;
  }

  public byteAccess(): ByteBuffer {
    return this;
  }

  public getPayload(): Array<number> {
    return this.payload;
  }

}
