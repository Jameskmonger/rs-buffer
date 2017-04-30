import { WritableByteBuffer } from "../byte-buffer";

export abstract class OutboundPacket<TData> {

    public abstract encode(buffer: WritableByteBuffer, data: TData): void;
    
}