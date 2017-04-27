import { ISAACGenerator } from "isaac-crypto";
import { WritableByteBuffer, DataOrder } from "../byte-buffer";

enum PacketHeaderType {
    FIXED_LENGTH,
    VARIABLE_LENGTH_BYTE,
    VARIABLE_LENGTH_SHORT
}

export class OutboundPacketBuffer extends WritableByteBuffer {
    
    private isaac: ISAACGenerator;
    private opcode: number;
    private headerType: PacketHeaderType;
    private startPosition: number;

    constructor (isaac: ISAACGenerator, opcode: number, headerType: PacketHeaderType = PacketHeaderType.FIXED_LENGTH) {
        super();

        this.isaac = isaac;
        this.opcode = opcode;
        this.headerType = headerType;
    }

    private pushOpcode(opcode): void {
        this.pushByte(opcode + this.isaac.getNextResult());
    }

    private openPacket(): void {
        this.startPosition = this.getPosition();
        this.pushOpcode(this.opcode);

        if (this.headerType === PacketHeaderType.FIXED_LENGTH) {
            return;
        }

        // do nothing for fixed length packets
        switch (this.headerType) {
            case PacketHeaderType.VARIABLE_LENGTH_BYTE:
                this.pushByte(0); // size placeholder
                break;
            case PacketHeaderType.VARIABLE_LENGTH_SHORT:
                this.pushShort(0, DataOrder.BIG_ENDIAN); // size placeholder
                break;
        }
    }

    private closePacket(): void {
        if (this.headerType === PacketHeaderType.FIXED_LENGTH) {
            return;
        }

        const packetSize = this.getPosition() - this.startPosition;

        // go back to the placeholder
        this.setPosition(this.startPosition);

        // do nothing for fixed length packets
        switch (this.headerType) {
            case PacketHeaderType.VARIABLE_LENGTH_BYTE:
                this.pushByte(packetSize); // size placeholder
                break;
            case PacketHeaderType.VARIABLE_LENGTH_SHORT:
                this.pushShort(packetSize, DataOrder.BIG_ENDIAN); // size placeholder
                break;
        }
    }

}