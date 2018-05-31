# rs-buffer

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
