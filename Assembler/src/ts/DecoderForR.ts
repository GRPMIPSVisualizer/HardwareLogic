import {Decoder} from "./Decoder";
import {InstructionR} from "./InstructionR";
import {MapForRegister} from "./MapForRegister";

export class DecoderForR extends Decoder {
    validate(): boolean {
        let posOfSpace: number = this.ins.indexOf(" ");
        let operandRS: string = "";
        let operandRT: string = "";
        let operandRD: string = "";
        if (this.operator == "jr") {
            operandRS = this.ins.substring(posOfSpace + 1, this.ins.length);
        } else if (this.operator == "sll" || this.operator == "srl") {
            let operands: string[] = this.ins.substring(posOfSpace, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRT = operands[1];
        } else {
            let operands: string[] = this.ins.substring(posOfSpace, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRS = operands[1];
            operandRT = operands[2]; 
        }

        let operands: Array<string> = [operandRS, operandRT, operandRD];
        let i: number;
        let patt1 = /^[0-9]+$/;
        let patt2 = /^[a-z0-9]+$/;
        for (i = 0; i < operands.length; i++) {
            let operand: string = operands[i].substring(1,operands[i].length);
            if (operands[i] == "" || patt1.test(operands[i]) || (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand <= 31)) {
                break;
            } else if (operands[i].charAt(0) == "$" && patt2.test(operand)) {
                if (MapForRegister.getMap().has(operand)) {
                    let operandID: string | undefined = MapForRegister.getMap().get(operand);
                    if (operandID == undefined) {
                        console.log("Error in DecoderForR. Invalid operand.");
                        return false;
                    } else {
                        this.ins = this.ins.replace(operand, operandID);
                    }
                }
            } else {
                console.log("Error in DecoderForR. Invalid operand.");
                return false;
            }
        }
        
        return true;
    }

    decode(): void {
        let instruction: InstructionR = new InstructionR(this.ins);
        this.binIns = instruction.getBinIns();
    }
}