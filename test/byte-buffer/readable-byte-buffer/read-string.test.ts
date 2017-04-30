import { TestFixture, TestCase, Expect, FocusTest } from "alsatian";

import { ReadableByteBuffer, Transformation } from "../../../src/byte-buffer";

@TestFixture("ByteBuffer#readString tests")
export class ByteBufferReadStringTestFixture {

    @TestCase([ 0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x0A ], "hello")
    @TestCase([ 
        0x4A, 0x61, 0x6D, 0x65, 0x73, 
        0x20, 0x2D, 0x20, 0x61, 0x6E, 
        0x64, 0x20, 0x73, 0x79, 0x6D, 
        0x62, 0x6F, 0x6C, 0x73, 0x21, 
        0x0A
    ], "James - and symbols!")
    public shouldReadSingleString(input: Array<number>, expected: string) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = buffer.readString();

        Expect(output).toBe(expected);
    }

    @TestCase([ 
        0x68, 0x65, 0x6C, 0x6C, 0x6F, 
        0x0A,
        0x48, 0x69, 0x21, 0x0A
    ], [ "hello", "Hi!" ])
    @TestCase([
        0x77, 0x61, 0x67, 0x31, 0x20, 
        0x62, 0x72, 0x6F, 0x0A,
        0x49, 0x74, 0x20, 0x69, 0x73, 
        0x20, 0x49, 0x20, 0x2D, 0x20, 
        0x42, 0x65, 0x6E, 0x64, 0x65, 
        0x72, 0x21, 0x0A
    ], [ "wag1 bro", "It is I - Bender!" ])
    public shouldReadTwoStrings(input: Array<number>, expected: Array<string>) {
        const buffer = new ReadableByteBuffer(input);
        
        const output = [
            buffer.readString(),
            buffer.readString()
        ];

        Expect(output).toEqual(expected);
    }

}