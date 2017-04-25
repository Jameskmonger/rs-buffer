import getSigned32BitInt from "get-signed-32-bit-int";

// with value 0x12345678
export enum DataOrder {
  BIG_ENDIAN, // [ 0x12, 0x34, 0x56, 0x78 ]
  LITTLE_ENDIAN // [ 0x78, 0x56, 0x34, 0x12 ]
}

// transformation applied to LSB (value)
export enum Transformation {
  NONE, // value
  ADD, // 128 + value
  SUBTRACT, // 128 - value
  NEGATE // 0 - value
}

const UNSIGNED_8_BIT_MAX = 0xFF;
const UNSIGNED_16_BIT_MAX = 0xFFFF;
const UNSIGNED_24_BIT_MAX = 0xFFFFFF;
const UNSIGNED_32_BIT_MAX = 0xFFFFFFFF;

const isUnsigned8BitInt = (value) => value >= 0 && value <= UNSIGNED_8_BIT_MAX;
const isUnsigned16BitInt = (value) => value >= 0 && value <= UNSIGNED_16_BIT_MAX;
const isUnsigned24BitInt = (value) => value >= 0 && value <= UNSIGNED_24_BIT_MAX;
const isUnsigned32BitInt = (value) => value >= 0 && value <= UNSIGNED_32_BIT_MAX;
const isUnsigned64BitInt = (high, low) => isUnsigned32BitInt(high) && isUnsigned32BitInt(low);

const applyTransformation = (byte: number, transformation: Transformation) => {
  if (transformation === Transformation.ADD) {
    return 128 + byte;
  }

  if (transformation === Transformation.SUBTRACT) {
    return 128 - byte;
  }

  if (transformation === Transformation.NEGATE) {
    return 0 - byte;
  }

  return byte;
}

export class ByteBuffer {

  private payload: Array<number>;

  constructor () {
    this.payload = [];
  }

  public pushByte(value: number, transformation: Transformation): ByteBuffer {
    if (!isUnsigned8BitInt(value)) {
      throw Error(`ByteBuffer#pushByte accepts a value between 0 and ${ UNSIGNED_8_BIT_MAX }.`);
    }

    this.payload.push(applyTransformation(value, transformation));

    return this;
  }

  public pushShort(value: number, order: DataOrder, transformation: Transformation): ByteBuffer {
    if (!isUnsigned16BitInt(value)) {
      throw Error(`ByteBuffer#pushShort accepts a value between 0 and ${ UNSIGNED_16_BIT_MAX }.`);
    }

    // apply all transformations and store in big endian order
    // as it makes the code a bit cleaner when actually pushing them to payload
    const bytesToPushBigEndian = [
      value >> 8,
      applyTransformation(value & 0xFF, transformation)
    ];

    if (order === DataOrder.BIG_ENDIAN) {
      this.payload.push(bytesToPushBigEndian[0]);
      this.payload.push(bytesToPushBigEndian[1]);
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      this.payload.push(bytesToPushBigEndian[1]);
      this.payload.push(bytesToPushBigEndian[0]);
    }

    return this;
  }

  public pushInt(value: number, order: DataOrder, mixed: boolean, transformation: Transformation): ByteBuffer {
    if (!isUnsigned32BitInt(value)) {
      throw Error(`ByteBuffer#pushInt accepts a value between 0 and ${ UNSIGNED_32_BIT_MAX }.`);
    }

    // apply all transformations and store in big endian order
    // as it makes the code a bit cleaner when actually pushing them to payload
    const bytesToPushBigEndian = [
      (value >> 24) & 0xFF,
      (value >> 16) & 0xFF,
      (value >> 8) & 0xFF,
      applyTransformation(value & 0xFF, transformation)
    ];

    if (order === DataOrder.BIG_ENDIAN) {
      if (mixed) {
        this.payload.push(bytesToPushBigEndian[2]);
        this.payload.push(bytesToPushBigEndian[3]);
        this.payload.push(bytesToPushBigEndian[0]);
        this.payload.push(bytesToPushBigEndian[1]);
      } else {
        this.payload.push(bytesToPushBigEndian[0]);
        this.payload.push(bytesToPushBigEndian[1]);
        this.payload.push(bytesToPushBigEndian[2]);
        this.payload.push(bytesToPushBigEndian[3]);
      }      
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      if (mixed) {
        this.payload.push(bytesToPushBigEndian[1]);
        this.payload.push(bytesToPushBigEndian[0]);
        this.payload.push(bytesToPushBigEndian[3]);
        this.payload.push(bytesToPushBigEndian[2]);
      } else {
        this.payload.push(bytesToPushBigEndian[3]);
        this.payload.push(bytesToPushBigEndian[2]);
        this.payload.push(bytesToPushBigEndian[1]);
        this.payload.push(bytesToPushBigEndian[0]);
      }
    }

    return this;
  }

  public pushLong(high: number, low: number, order: DataOrder, transformation: Transformation): ByteBuffer {
    if (!isUnsigned64BitInt(high, low)) {
      throw Error(`ByteBuffer#pushLong accepts a value between [ 0, 0 ] and [ ${ UNSIGNED_32_BIT_MAX }, ${ UNSIGNED_32_BIT_MAX } ].`);
    }

    const bytesToPushBigEndian = [
      (high >> 24) & 0xFF,
      (high >> 16) & 0xFF,
      (high >> 8) & 0xFF,
      high & 0xFF,
      (low >> 24) & 0xFF,
      (low >> 16) & 0xFF,
      (low >> 8) & 0xFF,
      applyTransformation(low & 0xFF, transformation)
    ];

    if (order === DataOrder.BIG_ENDIAN) {
      this.payload.push(bytesToPushBigEndian[0]);
      this.payload.push(bytesToPushBigEndian[1]);
      this.payload.push(bytesToPushBigEndian[2]);
      this.payload.push(bytesToPushBigEndian[3]);
      this.payload.push(bytesToPushBigEndian[4]);
      this.payload.push(bytesToPushBigEndian[5]);
      this.payload.push(bytesToPushBigEndian[6]);
      this.payload.push(bytesToPushBigEndian[7]);
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      this.payload.push(bytesToPushBigEndian[7]);
      this.payload.push(bytesToPushBigEndian[6]);
      this.payload.push(bytesToPushBigEndian[5]);
      this.payload.push(bytesToPushBigEndian[4]);
      this.payload.push(bytesToPushBigEndian[3]);
      this.payload.push(bytesToPushBigEndian[2]);
      this.payload.push(bytesToPushBigEndian[1]);
      this.payload.push(bytesToPushBigEndian[0]);
    }

    return this;
  }

  public pushTribyte(value: number, order: DataOrder, transformation: Transformation): ByteBuffer {
    if (!isUnsigned24BitInt(value)) {
      throw Error(`ByteBuffer#pushTribyte accepts a value between 0 and ${ UNSIGNED_24_BIT_MAX }.`);
    }

    const bytesToPushBigEndian = [
      (value >> 16) & 0xFF,
      (value >> 8) & 0xFF,
      applyTransformation(value & 0xFF, transformation)
    ];

    if (order === DataOrder.BIG_ENDIAN) {
      this.payload.push(bytesToPushBigEndian[0]);
      this.payload.push(bytesToPushBigEndian[1]);
      this.payload.push(bytesToPushBigEndian[2]);
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      this.payload.push(bytesToPushBigEndian[2]);
      this.payload.push(bytesToPushBigEndian[1]);
      this.payload.push(bytesToPushBigEndian[0]);
    }

    return this;
  }

  public pushBits(count: number, value: number): ByteBuffer {
    return this;
  }

  public pushBit(value: number): ByteBuffer {
    return this;
  }

  public pushString(value: string): ByteBuffer {
    for (let i = 0; i < value.length; i++) {
      let code = value.charCodeAt(i);

      this.payload.push(code);
    }

    this.payload.push(0x0A);

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
