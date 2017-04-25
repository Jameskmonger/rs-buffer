const UNSIGNED_8_BIT_MAX = 0xFF;
const UNSIGNED_16_BIT_MAX = 0xFFFF;
const UNSIGNED_24_BIT_MAX = 0xFFFFFF;
const UNSIGNED_32_BIT_MAX = 0xFFFFFFFF;

const isUnsigned8BitInt = (value) => value >= 0 && value <= UNSIGNED_8_BIT_MAX;
const isUnsigned16BitInt = (value) => value >= 0 && value <= UNSIGNED_16_BIT_MAX;
const isUnsigned24BitInt = (value) => value >= 0 && value <= UNSIGNED_24_BIT_MAX;
const isUnsigned32BitInt = (value) => value >= 0 && value <= UNSIGNED_32_BIT_MAX;
const isUnsigned64BitInt = (high, low) => isUnsigned32BitInt(high) && isUnsigned32BitInt(low);

export {
    UNSIGNED_8_BIT_MAX,
    UNSIGNED_16_BIT_MAX,
    UNSIGNED_24_BIT_MAX,
    UNSIGNED_32_BIT_MAX,

    isUnsigned8BitInt,
    isUnsigned16BitInt,
    isUnsigned24BitInt,
    isUnsigned32BitInt,
    isUnsigned64BitInt
}