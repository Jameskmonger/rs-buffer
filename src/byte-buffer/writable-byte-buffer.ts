import { 
  getUnsignedByte,
  DataOrder, 
  Transformation, 
  transformLsb, 
  applyTransformation, 
  DataSizes, 
  BIT_MASK
} from "./";

export interface BitPushFunction {
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
    orderToPush.forEach(i => this.pushSingleByte(bytesInBigEndianOrder[i]));
  }
  
  private pushSingleByte(value: number): void {
    this.payload[this.position++] = getUnsignedByte(value);
  }

  public pushByte(value: number, transformation: Transformation = Transformation.NONE): void {
    const transformedByte = applyTransformation(value, transformation); 

    this.pushSingleByte(transformedByte);
  }

  public pushShort(value: number, order: DataOrder, transformation: Transformation = Transformation.NONE): void {
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

  public pushTribyte(value: number, order: DataOrder, transformation: Transformation = Transformation.NONE): void {
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

  public pushInt(value: number, order: DataOrder, mixed: boolean, transformation: Transformation = Transformation.NONE): void {
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

  public pushLong(high: number, low: number, order: DataOrder, transformation: Transformation = Transformation.NONE): void {
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

  public setPosition(position: number): void {
    this.position = position;
  }

  public setPositionToEnd(): void {
    this.position = this.payload.length;
  }

  public getPosition(): number {
    return this.position;
  }

  public getPayload(): Array<number> {
    return this.payload;
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.payload);
  }

}
