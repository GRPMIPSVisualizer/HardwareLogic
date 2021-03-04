//待解决问题：
//正则表达式：小写字母 数字 美元符号 逗号 左右小括号 空格 换行符 Assembler 
//shamt字段的二进制转码方式 二进制码还是二进制补码 shamt字段的取值范围 sll srl DecoderForR
//immediate立即数的转码方式 取值范围 beq bne 算数指令 逻辑指令 DecoderForI
//address的取值范围 DecoderForJ
import { ArrayList } from "./ArrayList";
import { Assembler } from "./Assembler";
import { InstructionI } from "./InstructionI";
let assembler: Assembler = Assembler.getAssembler();
assembler.setSources("sub $s1, $s2, $s3" + "\n" + ".text" + "\n" + "addi $s1,$s2,100" + "\n" + ".text" + "\n" + "addi $s1,$s2,10" + "\n" + ".data" + "\n" + ".asciiz  10000" + "\n" + ".data" + "\n" + ".byte 7890" + "\n" + ".text" + "\n" + "beq $t1,$t2,-1" + "\n" + "main:" + "\n" + "addi $s1,$s2,10" + "\n" + "j 1");
assembler.segmentDataText();
//assembler.expandPseudo();
assembler.translateLabel();


let printer: ArrayList<string> = new ArrayList<string>(10);
let i: number;
printer = assembler.getSource();
for (i = 0; i < printer.size(); i++) {
    console.log(printer.get(i));
}

console.log("-----------------------");
let printer2: ArrayList<string> = new ArrayList<string>(10);
printer2 = assembler.getData();
for (i = 0; i < printer2.size(); i++) {
    console.log(printer2.get(i));
}
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