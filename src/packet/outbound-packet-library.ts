import { ISAACGenerator } from "isaac-crypto";
import { WritableByteBuffer } from "../byte-buffer";
import { OutboundPacket, OutboundPacketBuffer, OutboundPacketMetadata } from "./";

interface MessageToPacketMapping<T> {
    message: new () => T;
    packet: OutboundPacket<T>;
}

export class OutboundPacketLibrary {

    private library: Array<MessageToPacketMapping<{}>>;

    constructor() {
        this.library = [];
    }

    public register<T>(message: new () => T, packet: OutboundPacket<T>) {
        const mapping = {
            message, packet
        };

        this.library.push(mapping);
    }

    public encode<T>(isaac: ISAACGenerator, message: T): Buffer {
        const mapping = this.library.filter(
            (m: MessageToPacketMapping<T>) => message instanceof m.message
        )[0] as MessageToPacketMapping<T>;

        if (!mapping) {
            throw Error("No mapping found");
        }

        const buf = new OutboundPacketBuffer(isaac);

        const data: OutboundPacketMetadata = Reflect.getMetadata(
            "game-packets:outbound-packet-information", mapping.packet
        );

        if(!data) {
            throw Error("No packet information found");
        }

        buf.openPacket(data.opcode, data.lengthType);

        mapping.packet.encode(buf, message);

        return buf.toBuffer();
    }

}