import { PacketLengthType } from "./";

export interface OutboundPacketMetadata {
    opcode: number;
    lengthType: PacketLengthType;
}