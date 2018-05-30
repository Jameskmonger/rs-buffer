import { Expect } from "alsatian";

export const ExpectBuffersToBeEqual = (a: Buffer, b: Buffer) => {
    Expect(a.equals(b)).toBe(true);
};
