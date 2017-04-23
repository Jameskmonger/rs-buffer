import getSigned32BitInt from "get-signed-32-bit-int";

const isSigned8BitInt = (value) => value >= 0 && value <= 255;

export class ByteBuffer {

  private payload: Array<number>;

  constructor () {
    this.payload = [];
  }

  public pushByte(value: number): ByteBuffer {
    if (!isSigned8BitInt(value)) {
      throw Error("ByteBuffer#pushByte accepts a value between 0 and 255.");
    }

    this.payload.push(value);

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
