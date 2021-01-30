import {DecoderForR} from "./DecoderForR";
import {DecoderForI} from "./DecoderForI";
import {DecoderForJ} from "./DecoderForJ";
import { MapForCommaNum } from "./MapForCommaNum";
import { MapForInsType } from "./MapForInsType";

export class Assembler {

    private static assembler: Assembler = new Assembler();
    private decoderForR: DecoderForR = DecoderForR.getDecoder();
    private decoderForI: DecoderForI = DecoderForI.getDecoder();
    private decoderForJ: DecoderForJ = DecoderForJ.getDecoder();
    private ins: string = "";
    private binIns: string = "";

    private constructor(){}

    public static getAssembler(): Assembler {
        return this.assembler;
    }

    public setIns(ins: string): void {
        this.ins = ins;
    }

    public getBinIns(): string {
        return this.binIns;
    }

    public assemble(): boolean {
        let patt = /[^a-z\s\$0-9\,\(\)\n\-]/;
        if (patt.test(this.ins)) {
            console.log("Error 9 in Assembler. Unrecognized character.");
            return false;
        }
        let posOfSpace: number = this.ins.indexOf(" ");
        let operator: string = this.ins.substring(0,posOfSpace);
        if (MapForCommaNum.getMap().has(operator)) {
            let expectedNumComma: number | undefined = MapForCommaNum.getMap().get(operator);
            let actualNumComma = this.ins.split(",").length - 1;
            if (expectedNumComma == undefined) {
                console.log("Error 1 in Assembler. Instruction unrecognized.");
                return false;
            } else if (expectedNumComma == actualNumComma) {
                let type: string | undefined = MapForInsType.getMap().get(operator);
                if (type == undefined) {
                    console.log("Error 2 in Assembler.");
                    return false;
                } else {
                    switch(type) {
                        case "R":
                            this.decoderForR.setIns(this.ins);
                            if (this.decoderForR.validate() == true) {
                                this.decoderForR.decode();
                                this.binIns = this.decoderForR.getBinIns();
                                return true;
                            } else {
                                console.log("Error 3 in Assembler. Invalid instruction.");
                                return false;
                            }
                        case "I":
                            this.decoderForI.setIns(this.ins);
                            if (this.decoderForI.validate() == true) {
                                this.decoderForI.decode();
                                this.binIns = this.decoderForI.getBinIns();
                                return true;
                            } else {
                                console.log("Error 4 in Assembler. Invalid instruction.");
                                return false;
                            }
                        case "J":
                            this.decoderForJ.setIns(this.ins);
                            if (this.decoderForJ.validate() == true) {
                                this.decoderForJ.decode();
                                this.binIns = this.decoderForJ.getBinIns();
                                return true;
                            } else {
                                console.log("Error 5 in Assembler. Invalid instruction.");
                                return false;
                            }
                        default:
                            console.log("Error 6 in Assembler.");
                            return false;
                    }
                }
            } else {
                console.log("Error 7 in Assembler. Invalid instruction.");
                return false;
            }
        } else {
            console.log("Error 8 in Assembler. Instruction unrecognized.");
            return false;
        }
    }
}