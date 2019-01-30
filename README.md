# rs-buffer

Readable/writable byte buffer designed for a video game

## Installation

You can install this from npm:

```
npm install rs-buffer
```

## Usage

### Writable fixed

```typescript
import { FixedWritableByteBuffer } from "rs-buffer";

const buf = new FixedWritableByteBuffer(7); // create a writable byte buffer with 7 bytes

buf.pushShort(0x1234); // push 0x1234
buf.pushInt(0x4321ABCD); // push 0x4321ABCD
buf.pushByte(0xFF); // push 0xFF

buf.buffer; // get the underlying byte buffer to do with as you please

// values here will be:
// [ 0x12, 0x34, 0x43, 0x21, 0xAB, 0xCD, 0xFF ]
```

### Writable variable

You can also have a variable-sized buffer but this is just backed by an array and is slower.

```typescript
import { VariableWritableByteBuffer } from "rs-buffer";

const buf = new VariableWritableByteBuffer(); // create a variable-sized writable byte buffer

buf.pushInt(0x4321ABCD); // push 0x4321ABCD
buf.pushInt(0x4321ABCD); // push 0x4321ABCD
buf.pushInt(0x4321ABCD); // push 0x4321ABCD

buf.buffer; // convert array to byte buffer

// values here will be:
// [ 0x43, 0x21, 0xAB, 0xCD, 0x43, 0x21, 0xAB, 0xCD, 0x43, 0x21, 0xAB, 0xCD ]
```

### Readable

```typescript
import { ReadableByteBuffer } from "rs-buffer";

const buf = new ReadableByteBuffer(buffer); // pass in the Buffer instance you want to actually read from

buf.readInt(); // get an int from the buffer
buf.readByte(); // get a byte from the buffer

buf.readByte(true, Transformation.ADD); // read a signed byte with "add" type transformation

buf.readInt(true, Transformation.NONE, DataOrder.LITTLE_ENDIAN); // read a signed int in little-endian order, without transforming it
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

You can either use [big- or little-endian data orders](https://en.wikipedia.org/wiki/Endianness) when interacting with the buffer.

For example, take a value `0x12345678`. In big-endian order (the default), that will be written as `[ 0x12, 0x34, 0x56, 0x78 ]`, because it starts with the MSB. In little-endian order, however, it will start at the LSB and be written as `[ 0x78, 0x56, 0x34, 0x12 ]`.

### Mixed

The only exception to this is the `pushInt` method which takes a `boolean` parameter `mixed`. This will then split the integer into four octets, order them as above based on their endianness, and then switches the first two with the last two.

Again, take the value `0x12345678`. When written using mixed big-endianness, it will be split into the four octets as detailed above, giving us `[ 0x56, 0x78, 0x12, 0x34 ]`. In the same fashion, when written using mixed little-endianness, the output would be `[ 0x34, 0x12, 0x78, 0x56 ]`

## Pushing bits

You can push bits into a writable byte buffer:

```typescript
buf.pushBits(4, 0b1111).pushBits(4, 0b0000); // values will be 0b11110000
```

The first time you call `pushBits` on the buffer, some context is set up to allow for chaining. You can store this context in a variable to keep pushing bits into the same section:

```typescript
const context = buf.pushBits(4, 0b1111);
context.pushBits(2, 0b00);
context.pushBits(2, 0b10);
// values will be 0b11110010
```

Performing any byte-level operations will render that context invalid. There are currently no safety guards around that, so make sure that you don't do this:

```typescript
/* BAD! Do not do this. */

const context = buf.pushBits(4, 0b1111);
buf.pushByte(0xFF);
context.pushBits(4, 0b1111);

/* BAD! Do not do this. */
```
