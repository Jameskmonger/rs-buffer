import { PacketLengthType, OutboundPacketMetadata } from "./";

export function OutboundPacketInformation(opcode: number, lengthType: PacketLengthType) {
    return (constructor: Function) => {
        const key = "game-packets:outbound-packet-information";
        
        const metadata: OutboundPacketMetadata = {
            opcode,
            lengthType
        };

        Reflect.defineMetadata(key, metadata, constructor);
    };
}