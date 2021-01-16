"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoderForR = void 0;
const Decoder_1 = require("./Decoder");
const InstructionR_1 = require("./InstructionR");
const MapForRegister_1 = require("./MapForRegister");
class DecoderForR extends Decoder_1.Decoder {
    validate() {
        let posOfSpace = this.ins.indexOf(" ");
        let operandRS = "";
        let operandRT = "";
        let operandRD = "";
        if (this.operator == "jr") {
            operandRS = this.ins.substring(posOfSpace + 1, this.ins.length);
        }
        else if (this.operator == "sll" || this.operator == "srl") {
            let operands = this.ins.substring(posOfSpace, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRT = operands[1];
        }
        else {
            let operands = this.ins.substring(posOfSpace, this.ins.length).split(",", 3);
            operandRD = operands[0];
            operandRS = operands[1];
            operandRT = operands[2];
        }
        let operands = [operandRS, operandRT, operandRD];
        let i;
        let patt1 = /^[0-9]+$/;
        let patt2 = /^[a-z0-9]+$/;
        for (i = 0; i < operands.length; i++) {
            let operand = operands[i].substring(1, operands[i].length);
            if (operands[i] == "" || patt1.test(operands[i]) || (operands[i].charAt(0) == "$" && patt1.test(operand) && +operand <= 31)) {
                break;
            }
            else if (operands[i].charAt(0) == "$" && patt2.test(operand)) {
                if (MapForRegister_1.MapForRegister.getMap().has(operand)) {
                    let operandID = MapForRegister_1.MapForRegister.getMap().get(operand);
                    if (operandID == undefined) {
                        console.log("Error in DecoderForR. Invalid operand.");
                        return false;
                    }
                    else {
                        this.ins = this.ins.replace(operand, operandID);
                    }
                }
            }
            else {
                console.log("Error in DecoderForR. Invalid operand.");
                return false;
            }
        }
        return true;
    }
    decode() {
        let instruction = new InstructionR_1.InstructionR(this.ins);
        this.binIns = instruction.getBinIns();
    }
}
exports.DecoderForR = DecoderForR;
