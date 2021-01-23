"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//待解决问题：
//正则表达式：小写字母 数字 美元符号 逗号 左右小括号 空格 换行符 Assembler 
//shamt字段的二进制转码方式 二进制码还是二进制补码 shamt字段的取值范围 sll srl DecoderForR
//immediate立即数的转码方式 取值范围 beq bne 算数指令 逻辑指令 DecoderForI
//address的取值范围 DecoderForJ
const Assembler_1 = require("./Assembler");
const InstructionR_1 = require("./InstructionR");
let assembler = Assembler_1.Assembler.getAssembler();
let binIns = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
assembler.setIns("add $s1,$s2,$s3");
if (assembler.assemble() == true) {
    binIns = assembler.getBinIns();
}
else {
    console.log("Error");
}
console.log(binIns);
let instruction = new InstructionR_1.InstructionR("add $17,$18,$19");
console.log(instruction.getBinIns());
