//Basic assembler, for example, change the instruction "addi $s1,$s2,32768" into lui, ori and add when the immediated number is longer than 16 bits
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BinaryToDecimal_1 = require("./BinaryToDecimal");
const DecimalToBinary_1 = require("./DecimalToBinary");
function basicAssembler(ins) {
    let posOfSpace = ins.indexOf(" ");
    let operator = ins.substring(0, posOfSpace);
    let result = ["", "", ""];
    if (operator == "addi" || operator == "addiu") {
        let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
        if (+operands[2] <= 32767 && +operands[2] >= -32768) {
            return ins;
        }
        else {
            let operandRS = operands[0];
            let operandRT = operands[1];
            let imm = DecimalToBinary_1.decimalToBinary(+operands[2], 32);
            let highBits = imm.substring(0, 16);
            let lowBits = imm.substring(16, 32);
            let highImm = BinaryToDecimal_1.binaryToDecimal(highBits);
            let lowImm = BinaryToDecimal_1.binaryToDecimal(lowBits);
            result[0] = "lui $1," + highImm;
            result[1] = "ori $1,$1," + lowImm;
            if (operator == "addi") {
                result[2] = "add " + operandRS + "," + operandRT + ",$1";
            }
            else {
                result[2] = "addu " + operandRS + "," + operandRT + ",$1";
            }
            return result;
        }
    }
    else if (operator == "andi" || operator == "ori") {
        let operands = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
        if (+operands[2] <= 65535 && +operands[2] >= 0) {
            return ins;
        }
        else {
            let operandRS = operands[0];
            let operandRT = operands[1];
            let imm = DecimalToBinary_1.decimalToBinary(+operands[2], 32);
            let highBits = imm.substring(0, 16);
            let lowBits = imm.substring(16, 32);
            let highImm = BinaryToDecimal_1.binaryToDecimal(highBits);
            let lowImm = BinaryToDecimal_1.binaryToDecimal(lowBits);
            result[0] = "lui $1," + highImm;
            result[1] = "ori $1,$1," + lowImm;
            if (operator == "andi") {
                result[2] = "and " + operandRS + "," + operandRT + ",$1";
            }
            else {
                result[2] = "or " + operandRS + "," + operandRT + ",$1";
            }
            return result;
        }
    }
    
}

