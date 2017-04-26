import { DataOrder, Transformation, transformLsb, applyTransformation, DataSizes } from "./";

export class WritableByteBuffer {

  private payload: Array<number>;

  constructor () {
    this.payload = [];
  }

  private pushBytes(bytesInBigEndianOrder: Array<number>, orderToPush: Array<number>): void {
    orderToPush.forEach(i => this.payload.push(bytesInBigEndianOrder[i]));
  }

  public pushByte(value: number, transformation: Transformation): WritableByteBuffer {
    if (!DataSizes.isUnsigned8BitInt(value)) {
      throw Error(`ByteBuffer#pushByte accepts a value between 0 and ${ DataSizes.UNSIGNED_8_BIT_MAX }.`);
    }

    const transformedByte = applyTransformation(value, transformation); 

    this.payload.push(transformedByte);

    return this;
  }

  public pushShort(value: number, order: DataOrder, transformation: Transformation): WritableByteBuffer {
    if (!DataSizes.isUnsigned16BitInt(value)) {
      throw Error(`ByteBuffer#pushShort accepts a value between 0 and ${ DataSizes.UNSIGNED_16_BIT_MAX }.`);
    }

    // apply all transformations and store in big endian order
    // as it makes the code a bit cleaner when actually pushing them to payload
    const bytesToPushBigEndian = transformLsb([
      (value >> 8) & 0xFF,
      value & 0xFF
    ], transformation);

    if (order === DataOrder.BIG_ENDIAN) {
      this.pushBytes(bytesToPushBigEndian, [ 0, 1 ]);
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      this.pushBytes(bytesToPushBigEndian, [ 1, 0 ]);
    }

    return this;
  }

  public pushTribyte(value: number, order: DataOrder, transformation: Transformation): WritableByteBuffer {
    if (!DataSizes.isUnsigned24BitInt(value)) {
      throw Error(`ByteBuffer#pushTribyte accepts a value between 0 and ${ DataSizes.UNSIGNED_24_BIT_MAX }.`);
    }

    const bytesToPushBigEndian = transformLsb([
      (value >> 16) & 0xFF,
      (value >> 8) & 0xFF,
      value & 0xFF
    ], transformation);

    if (order === DataOrder.BIG_ENDIAN) {
      this.pushBytes(bytesToPushBigEndian, [ 0, 1, 2 ]);
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      this.pushBytes(bytesToPushBigEndian, [ 2, 1, 0 ]);
    }

    return this;
  }

  public pushInt(value: number, order: DataOrder, mixed: boolean, transformation: Transformation): WritableByteBuffer {
    if (!DataSizes.isUnsigned32BitInt(value)) {
      throw Error(`ByteBuffer#pushInt accepts a value between 0 and ${ DataSizes.UNSIGNED_32_BIT_MAX }.`);
    }

    // apply all transformations and store in big endian order
    // as it makes the code a bit cleaner when actually pushing them to payload
    const bytesToPushBigEndian = transformLsb([
      (value >> 24) & 0xFF,
      (value >> 16) & 0xFF,
      (value >> 8) & 0xFF,
      value & 0xFF
    ], transformation);

    if (order === DataOrder.BIG_ENDIAN) {
      if (mixed) {
        this.pushBytes(bytesToPushBigEndian, [ 2, 3, 0, 1 ]);
      } else {
        this.pushBytes(bytesToPushBigEndian, [ 0, 1, 2, 3 ]);
      }      
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      if (mixed) {
        this.pushBytes(bytesToPushBigEndian, [ 1, 0, 3, 2 ]);
      } else {
        this.pushBytes(bytesToPushBigEndian, [ 3, 2, 1, 0 ]);
      }
    }

    return this;
  }

  public pushLong(high: number, low: number, order: DataOrder, transformation: Transformation): WritableByteBuffer {
    if (!DataSizes.isUnsigned64BitInt(high, low)) {
      throw Error(`ByteBuffer#pushLong accepts a value between [ 0, 0 ] and [ ${ DataSizes.UNSIGNED_32_BIT_MAX }, ${ DataSizes.UNSIGNED_32_BIT_MAX } ].`);
    }

    const bytesToPushBigEndian = transformLsb([
      (high >> 24) & 0xFF,
      (high >> 16) & 0xFF,
      (high >> 8) & 0xFF,
      high & 0xFF,
      (low >> 24) & 0xFF,
      (low >> 16) & 0xFF,
      (low >> 8) & 0xFF,
      low & 0xFF
    ], transformation);

    if (order === DataOrder.BIG_ENDIAN) {
      this.pushBytes(bytesToPushBigEndian, [ 0, 1, 2, 3, 4, 5, 6, 7 ]);
    } else if (order === DataOrder.LITTLE_ENDIAN) {
      this.pushBytes(bytesToPushBigEndian, [ 7, 6, 5, 4, 3, 2, 1, 0 ]);
    }

    return this;
  }

  // push (1, 1) results in 1000000
  // then push (7, 1) results in 10000001
  // read it as string and convert :)
  public pushBits(count: number, value: number): WritableByteBuffer {
    return this;
  }

  public pushBit(value: number): WritableByteBuffer {
    return this;
  }

  public pushString(value: string): WritableByteBuffer {
    for (let i = 0; i < value.length; i++) {
      let code = value.charCodeAt(i);

      this.payload.push(code);
    }

    this.payload.push(0x0A);

    return this;
  }

  public bitAccess(): WritableByteBuffer {
    return this;
  }

  public byteAccess(): WritableByteBuffer {
    return this;
  }

  public getPayload(): Array<number> {
    return this.payload;
  }

}
