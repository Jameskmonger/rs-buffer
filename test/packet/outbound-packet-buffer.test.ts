import { TestFixture, TestCase, Test, Expect } from "alsatian";

import { OutboundPacketBuffer, PacketHeaderType } from "../../src/packet";

const buildFakeISAAC = (returnValue: number) => {
    return {
        getNextResult: () => returnValue
    } as any
};

const bufferToArray = (buffer: Buffer) => {
    const bytes = [];
    
    for(let i = 0; i < buffer.length; i++) {
        bytes[i] = buffer.readUInt8(i);
    }

    return bytes;
}

@TestFixture("OutboundPacketBuffer tests")
export class OutboundPacketBufferTestFixture {

    @TestCase(17, 10, 0x1B)
    @TestCase(22, -12345678, 0xC8)
    public shouldPushOpcodeWithISAACValue(opcode: number, isaacValue: number, encryptedOpcode: number) {
        const isaac = buildFakeISAAC(isaacValue);

        const packet = new OutboundPacketBuffer(isaac);

        packet.openPacket(opcode);
        
        const buffer = packet.toBuffer();
        Expect(buffer.readUInt8(0)).toBe(encryptedOpcode);
    }

    @TestCase(0xFF, 0xFF)
    @TestCase(0x12, 0x77)
    public shouldCompletePacketCorrectlyForFixedLength(first: number, second: number) {
        const isaac = buildFakeISAAC(0);

        const packet = new OutboundPacketBuffer(isaac);

        packet.openPacket(10); // opcode 10

        packet.pushByte(first);
        packet.pushByte(second);

        const buffer = packet.toBuffer();
        const packetBytes = bufferToArray(buffer);

        Expect(packetBytes).toEqual([ 0x0A, first, second ]);
    }

    @TestCase(0xFF, 0xFF)
    @TestCase(0x12, 0x77)
    public shouldCompletePacketCorrectlyForVariableLengthByte(first: number, second: number) {
        const isaac = buildFakeISAAC(0);

        const packet = new OutboundPacketBuffer(isaac);

        packet.openPacket(10, PacketHeaderType.VARIABLE_LENGTH_BYTE); // opcode 10

        packet.pushByte(first);
        packet.pushByte(second);

        const buffer = packet.toBuffer();
        const packetBytes = bufferToArray(buffer);

        const sizeParts = [ 0x02 ];

        Expect(packetBytes).toEqual([ 0x0A, sizeParts[0], first, second ]);
    }

    @TestCase(0xFF, 0xFF)
    @TestCase(0x12, 0x77)
    public shouldCompletePacketCorrectlyForVariableLengthShort(first: number, second: number) {
        const isaac = buildFakeISAAC(0);

        const packet = new OutboundPacketBuffer(isaac);

        packet.openPacket(10, PacketHeaderType.VARIABLE_LENGTH_SHORT); // opcode 10

        packet.pushByte(first);
        packet.pushByte(second);

        const buffer = packet.toBuffer();
        const packetBytes = bufferToArray(buffer);

        const sizeParts = [ 0x00, 0x02 ];

        Expect(packetBytes).toEqual([ 0x0A, sizeParts[0], sizeParts[1], first, second ]);
    }

}