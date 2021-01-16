export abstract class Decoder {
    protected ins: string = "";
    protected operator: string = "";
    protected binIns: string = "";

    setIns(ins: string): void {
        this.ins = ins;
        
        var posOfSpace: number = this.ins.indexOf(" ");
        this.operator = ins.substring(0, posOfSpace);
    }

    setBinIns(binIns: string): void {
        this.binIns = binIns;
    }

    getIns(): string {
        return this.ins;
    }

    getBinIns(): string {
        return this.binIns;
    }

    abstract validate(): boolean;

    abstract decode(): void;
}