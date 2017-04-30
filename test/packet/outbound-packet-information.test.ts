import "reflect-metadata";

import { TestFixture, TestCase, Test, Expect } from "alsatian";

import { OutboundPacketInformation, PacketLengthType } from "../../src/packet";

@TestFixture("OutboundPacketInformation tests")
export class OutboundPacketInformationTestFixture {

    @TestCase(50)
    @TestCase(10)
    public shouldAddOpcode(opcode: number) {
        const decorator = OutboundPacketInformation(opcode, PacketLengthType.FIXED_LENGTH);

        const ctor = () => { };

        decorator(ctor);

        const metadata = Reflect.getMetadata("game-packets:outbound-packet-information", ctor);

        Expect(metadata.opcode).toBe(opcode);
    }

    @TestCase(PacketLengthType.FIXED_LENGTH)
    @TestCase(PacketLengthType.VARIABLE_LENGTH_BYTE)
    @TestCase(PacketLengthType.VARIABLE_LENGTH_SHORT)
    public shouldAddLengthType(lengthType: PacketLengthType) {
        const decorator = OutboundPacketInformation(50, lengthType);

        const ctor = () => { };

        decorator(ctor);

        const metadata = Reflect.getMetadata("game-packets:outbound-packet-information", ctor);

        Expect(metadata.lengthType).toBe(lengthType);
    }

}