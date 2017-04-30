import { ISAACGenerator } from "isaac-crypto";
import { WritableByteBuffer, DataOrder } from "../byte-buffer";
import { PacketLengthType } from "./";

export class OutboundPacketBuffer extends WritableByteBuffer {
    
    private isaac: ISAACGenerator;
    private lengthType: PacketLengthType;
    private startPosition: number;

    constructor (isaac: ISAACGenerator) {
        super();

        this.isaac = isaac;
    }

    public toBuffer(): Buffer {
        this.closePacket();

        return super.toBuffer();
    }

    private pushOpcode(opcode): void {
        this.pushByte(opcode + this.isaac.getNextResult());
    }

    public openPacket(opcode: number = null, lengthType: PacketLengthType = PacketLengthType.FIXED_LENGTH): void {        
        if (opcode) {
            this.pushOpcode(opcode);
        }

        this.lengthType = lengthType;

        if (this.lengthType === PacketLengthType.FIXED_LENGTH) {
            return;
        }

        // do nothing for fixed length packets
        switch (this.lengthType) {
            case PacketLengthType.VARIABLE_LENGTH_BYTE:
                this.pushByte(0); // size placeholder
                break;
            case PacketLengthType.VARIABLE_LENGTH_SHORT:
                this.pushShort(0, DataOrder.BIG_ENDIAN); // size placeholder
                break;
        }
		
		this.startPosition = this.getPosition();
    }

    private closePacket(): void {
        if (this.lengthType === PacketLengthType.FIXED_LENGTH) {
            return;
        }

        const packetSize = this.getPosition() - this.startPosition;

        // do nothing for fixed length packets
        switch (this.lengthType) {
            case PacketLengthType.VARIABLE_LENGTH_BYTE:
				this.setPosition(this.startPosition - 1);
                this.pushByte(packetSize); // size placeholder
                break;
            case PacketLengthType.VARIABLE_LENGTH_SHORT:
				this.setPosition(this.startPosition - 2);
                this.pushShort(packetSize, DataOrder.BIG_ENDIAN); // size placeholder
                break;
        }
    }

}