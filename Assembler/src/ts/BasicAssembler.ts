//Basic assembler, for example, change the instruction "addi $s1,$s2,32768" into lui, ori and add when the immediated number is longer than 16 bits
import { binaryToDecimal } from "./BinaryToDecimal";
import {decimalToBinary} from "./DecimalToBinary";

export function basicAssembler(ins: string) {
  let posOfSpace: number = ins.indexOf(" ");
  let operator: string = ins.substring(0, posOfSpace);
  let result: string[] = ["", "", ""];

  if (operator == "addi" || operator == "addiu") {
    let operands: string[] = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
    if (+operands[2] <= 32767 && +operands[2] >= -32768) {
      return ins;
    } else {
      let operandRS: string = operands[0];
      let operandRT: string = operands[1];
      let imm: string = decimalToBinary(+operands[2], 32);
      let highBits: string = imm.substring(0, 16);
      let lowBits: string = imm.substring(16, 32);
      let highImm: number = binaryToDecimal(highBits);
      let lowImm: number = binaryToDecimal(lowBits);
      result[0] = "lui $1," + highImm;
      result[1] = "ori $1,$1," + lowImm;
      if (operator == "addi") {
        result[2] = "add " + operandRS + "," + operandRT + ",$1";
      } else {
        result[2] = "addu " + operandRS + "," + operandRT + ",$1";
      }
      return result;
    }
  } else if (operator == "andi" || operator == "ori") {
    let operands: string[] = ins.substring(posOfSpace + 1, ins.length).split(",", 3);
    if (+operands[2] <= 65535 && +operands[2] >= 0) {
      return ins;
    } else {
      let operandRS: string = operands[0];
      let operandRT: string = operands[1];
      let imm: string = decimalToBinary(+operands[2], 32);
      let highBits: string = imm.substring(0, 16);
      let lowBits: string = imm.substring(16, 32);
      let highImm: number = binaryToDecimal(highBits);
      let lowImm: number = binaryToDecimal(lowBits);
      result[0] = "lui $1," + highImm;
      result[1] = "ori $1,$1," + lowImm;
      if (operator == "andi") {
        result[2] = "and " + operandRS + "," + operandRT + ",$1";
      } else {
        result[2] = "or " + operandRS + "," + operandRT + ",$1";
      }
      return result;
    }
  }

  
}

