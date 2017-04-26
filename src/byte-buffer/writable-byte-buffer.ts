import { DataOrder, Transformation, transformLsb, applyTransformation, DataSizes, BIT_MASK } from "./";

interface BitPushFunction {
  pushBits(count: number, value: number): BitPushFunction
}

export class WritableByteBuffer {

  private position: number;
  private payload: Array<number>;

  constructor () {
    this.position = 0;
    this.payload = [];
  }

  private pushBytes(bytesInBigEndianOrder: Array<number>, orderToPush: Array<number>): void {
    orderToPush.forEach(i => this.payload[this.position++] = bytesInBigEndianOrder[i]);
  }

  public pushByte(value: number, transformation: Transformation): void {
    if (!DataSizes.isUnsigned8BitInt(value)) {
      throw Error(`ByteBuffer#pushByte accepts a value between 0 and ${ DataSizes.UNSIGNED_8_BIT_MAX }.`);
    }

    const transformedByte = applyTransformation(value, transformation); 

    this.payload[this.position++] = transformedByte;
  }

  public pushShort(value: number, order: DataOrder, transformation: Transformation): void {
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
  }

  public pushTribyte(value: number, order: DataOrder, transformation: Transformation): void {
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
  }

  public pushInt(value: number, order: DataOrder, mixed: boolean, transformation: Transformation): void {
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
  }

  public pushLong(high: number, low: number, order: DataOrder, transformation: Transformation): void {
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
  }

  // internal curried function to push bits
  // this prevents us from having to do any setup function at all to get into "bit mode"
  // curryPushBits(0).pushBits(4, 10).pushBits(4, 12)
  private curryPushBits(bitPosition: number): BitPushFunction {
    const pushBits = (count: number, value: number) => {
      let bytePos = bitPosition >> 3;
      let bitOffset = 8 - (bitPosition & 7);
      bitPosition += count;
      
      for(; count > bitOffset; bitOffset = 8) {
        this.payload[bytePos] &= ~ BIT_MASK[bitOffset];
        this.payload[bytePos++] |= (value >> (count - bitOffset)) & BIT_MASK[bitOffset];
        
        count -= bitOffset;
      }
      
      if(count == bitOffset) {
        this.payload[bytePos] &= ~ BIT_MASK[bitOffset];
        this.payload[bytePos] |= value & BIT_MASK[bitOffset];
      } else {
        this.payload[bytePos] &= ~ (BIT_MASK[count] << (bitOffset - count));
        this.payload[bytePos] |= (value & BIT_MASK[count]) << (bitOffset - count);
      }

      // update position incase they want to go back to byte access
      this.position = ~~((bitPosition + 7) / 8);

      // pass the bit position down so that pushBits can be called again
      return this.curryPushBits(bitPosition);
    };

    return {
      pushBits
    };
  }

  // curries the function up so they can do pushBits(c, v).pushBits(c, v)
  public pushBits(count: number, value: number): BitPushFunction {
    return this.curryPushBits(this.position * 8).pushBits(count, value);
  }

  public pushString(value: string): void {
    for (let i = 0; i < value.length; i++) {
      let code = value.charCodeAt(i);

      this.payload[this.position++] = code;
    }

    this.payload[this.position++] = 0x0A;
  }

  public getPayload(): Array<number> {
    return this.payload;
  }

}
