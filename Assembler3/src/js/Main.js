"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//待解决问题：
//正则表达式：小写字母 数字 美元符号 逗号 左右小括号 空格 换行符 Assembler 
//shamt字段的二进制转码方式 二进制码还是二进制补码 shamt字段的取值范围 sll srl DecoderForR
//immediate立即数的转码方式 取值范围 beq bne 算数指令 逻辑指令 DecoderForI
//address的取值范围 DecoderForJ
const ArrayList_1 = require("./ArrayList");
const Assembler_1 = require("./Assembler");
let assembler = Assembler_1.Assembler.getAssembler();
assembler.setSources(".data" + "\n" + "item:" + "\n" + ".ascii \"s\"" + "\n" + ".word 33" + "\n" + "item:" + "\n" + ".asciiz" + "\n" + "\"scc\"" + "\n" + ".text" + "\n" + "la $t1,item");
//assembler.setSources("sub $s1, $s2, $s3" + "\n" + ".text" + "\n" + ".globl main" + "\n" + "addi $s1,$s2,100" + "\n" + ".text" + "\n" + "addi $s1,$s2,10" + "\n" + ".data" + "\n" + ".asciiz  10000" + "\n" + ".data" + "\n" + ".byte 7890" + "\n" + ".text" + "\n" + "beq $t1,$t2,main" + "\n" + "main:" + "addi $s1,$s2,10" + "\n" + "j main" + "\n" + "beq $t1,$t2,-1");
if (assembler.preprocess()) {
    if (assembler.assemble()) {
        let i;
        let bin = new ArrayList_1.ArrayList(10);
        bin = assembler.getBin();
        for (i = 0; i < bin.size(); i++) {
            console.log(bin.get(i).toString());
        }
    }
}
console.log(assembler.getMapForDataLabel().keys());
console.log(assembler.getMapForDataLabel().values());
let printer = new Array(10);
let i;
printer = assembler.getSourceIns();
for (i = 0; i < printer.length; i++) {
    console.log(printer[i]);
}
console.log("-----------------------");
let printer3 = assembler.getBasic();
for (i = 0; i < printer3.size(); i++) {
    console.log(printer3.get(i));
}
console.log("-----------------------");
let printer2 = new ArrayList_1.ArrayList(10);
printer2 = assembler.getData();
for (i = 0; i < printer2.size(); i++) {
    console.log(printer2.get(i));
}
console.log("-----------------------");
// let printer3: Array<string> = [];
// printer3 = assembler.getSourceIns();
// for (i = 0; i < printer3.length; i++) {
//     console.log(printer3[i]);
// }
// console.log(assembler.getSourceIns().length);
//assembler.setSource("addi $s1,$s2,10");
// console.log(assembler.getSource().size());
// console.log(assembler.getBasic().size());
// if(assembler.assemble() == true) {
//     for (let i = 0; i < assembler.getBin().size(); i++) {
//         console.log(assembler.getBin().get(i));
//     }
// } else {
//     console.log("Error");
// }
// let instruction: InstructionI = new InstructionI("addi $17,$18,10");
// console.log(instruction.getBinIns());
//assembler.setSource("addi $s1,$s2,100" + "\n" + ".text" + "\n" + "addi $s1,$s2,10" + "\n" + ".data" + "\n" + ".asciiz  10000" + "\n" + ".data" + "\n" + ".byte 7890" + "\n" + ".text" + "\n" + "beq $t1,$t2,-1" + "\n" + "main:" + "\n" + "addi $s1,$s2,10" + "\n" + "j 1");
// let printer: ArrayList<string> = new ArrayList<string>(10);
// let i: number;
// printer = assembler.getSource();
// for (i = 0; i < printer.size(); i++) {
//     console.log(printer.get(i));
// }
// console.log("-----------------------");
// let printer2: ArrayList<string> = new ArrayList<string>(10);
// printer2 = assembler.getData();
// for (i = 0; i < printer2.size(); i++) {
//     console.log(printer2.get(i));
// }
//assembler.setSource("addi $s1,$s2,10");
// console.log(assembler.getSource().size());
// console.log(assembler.getBasic().size());
// if(assembler.assemble() == true) {
//     for (let i = 0; i < assembler.getBin().size(); i++) {
//         console.log(assembler.getBin().get(i));
//     }
// } else {
//     console.log("Error");
// }
// let instruction: InstructionI = new InstructionI("addi $17,$18,10");
// console.log(instruction.getBinIns());
