"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionJ = void 0;
const DecimalToBinary_1 = require("./DecimalToBinary");
const Instruction_1 = require("./Instruction");
const MapForJ_1 = require("./MapForJ");
class InstructionJ extends Instruction_1.Instruction {
    //The ins should be in the form like "j 10000".
    //There should be only one space between the operator and the first operand, no other space existing.
    //The address should be represented by a decimal number.
    constructor(ins) {
        super(ins);
        this.errMsg = "";
        let opBin = MapForJ_1.MapForJ.getMap().get(this.operator);
        if (opBin == undefined) {
            this.op = "XXXXXX";
            this.errMsg = this.errMsg + "Error 102: Failed to construct type-J instruction. -- " + ins + "\n";
        }
        else {
            this.op = opBin;
        }
        let posOfSpace = ins.indexOf(" ");
        this.operandADDRESS = ins.substring(posOfSpace + 1, ins.length);
        this.address = DecimalToBinary_1.decimalToBinary(+this.operandADDRESS, 26);
        this.binIns = this.op + this.address;
    }
    getErrMsg() {
        return this.errMsg;
    }
}
exports.InstructionJ = InstructionJ;
