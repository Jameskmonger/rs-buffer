# rs-buffer

Readable/writable byte buffer designed for a video game

## Warning!

This is currently incomplete! There are two main things missing:

1. Reading in different orders
2. Reading with transformations

I would greatly appreciate help implementing these - even if you can only implement a small part of one!

## Installation

You can install this from npm:

```
npm install rs-buffer
```

## Usage

### Writable

```typescript
import { WritableByteBuffer } from "rs-buffer";

const buf = new WritableByteBuffer(7); // create a writable byte buffer with 7 bytes

buf.pushShort(0x1234); // push 0x1234
buf.pushInt(0x4321ABCD); // push 0x4321ABCD
buf.pushByte(0xFF); // push 0xFF

buf.buffer; // get the underlying byte buffer to do with as you please

// values here will be:
// [ 0x12, 0x34, 0x43, 0x21, 0xAB, 0xCD, 0xFF ]
```

### Readable

```typescript
import { ReadableByteBuffer } from "rs-buffer";

const buf = new ReadableByteBuffer(buffer); // pass in the Buffer instance you want to actually read from

buf.readInt(); // get an int from the buffer
buf.readByte(); // get a byte from the buffer
```

## Transformations

There are a number of "transformations" that can be made when writing an item to the buffer. The transformation is always made to the least significant bit.

The transformations are as follows:

- **add** (called `A` in some other implementations): Add `128` to the LSB
- **subtract** (called `S` in some other implementations): Subtract the LSB from `128`
- **negate** (called `C` in some other implementations): Multiply the LSB with `-1`

The transformation is always from the point of view of the write. If you read a byte with the **add** transformation, the buffer will subtract `128` from the LSB in order to return to the original (written) value. Do not be misled into thinking that the buffer will perform the original (write) transformation again.

These transformations have other names in other implementations. **add** is commonly called **A**, **subtract** is commonly called **S** and **negate** is commonly called **C**.

For comparisons sake, here is some code you may find in another implementation of this buffer, followed by an example using this buffer.

```
// others
buffer.putLEShortA(0xC3D8);
buffer.putByteS(0xF1);
buffer.putByteC(0xD5);
buffer.putInt(0x67D401B2);

// this
buffer.pushShort(0xC3D8, DataOrder.LITTLE_ENDIAN, Transformation.ADD);
buffer.pushByte(0xF1, Transformation.SUBTRACT);
buffer.pushByte(0xD5, Transformation.NEGATE);
buffer.pushInt(0x67D401B2);
```

## Data Order

You can either use [big- or little-endian data orders](https://en.wikipedia.org/wiki/Endianness) when writing to the buffer.

For example, take a value `0x12345678`. In big-endian order (the default), that will be written as `[ 0x12, 0x34, 0x56, 0x78 ]`, because it starts with the MSB. In little-endian order, however, it will start at the LSB and be written as `[ 0x78, 0x56, 0x34, 0x12 ]`.

### Mixed

The only exception to this is the `pushInt` method which takes a `boolean` parameter `mixed`. This will then split the integer into four octets, order them as above based on their endianness, and then switches the first two with the last two.

Again, take the value `0x12345678`. When written using mixed big-endianness, it will be split into the four octets as detailed above, giving us `[ 0x56, 0x78, 0x12, 0x34 ]`. In the same fashion, when written using mixed little-endianness, the output would be `[ 0x34, 0x12, 0x78, 0x56 ]`