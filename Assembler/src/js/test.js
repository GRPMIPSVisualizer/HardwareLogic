"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayList_1 = require("./ArrayList");
const DecimalToBinary_1 = require("./DecimalToBinary");
const TransformZeroOne_1 = require("./TransformZeroOne");
const NumArrToString_1 = require("./NumArrToString");
const StringToNumArr_1 = require("./StringToNumArr");
const BinaryAddition_1 = require("./BinaryAddition");
const InstructionR_1 = require("./InstructionR");
const InstructionI_1 = require("./InstructionI");
var list = new ArrayList_1.ArrayList(10);
list.add("张三");
list.add("李四");
list.add("王五");
console.log("-------------测试添加-----------------");
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("-------------测试修改，下标1改为赵六-------------");
list.update(1, "赵六");
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("-------------测试删除，删除下标为2的-------------");
list.remove(2);
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
console.log("-------------测试删除，删除'王五'-------------");
list.remove('张三');
for (var i = 0; i < list.size(); i++) {
    console.log(list.get(i));
}
let nameSiteMapping = new Map();
// 设置 Map 对象
nameSiteMapping.set("Google", "000001");
nameSiteMapping.set("Runoob", 2);
nameSiteMapping.set("Taobao", 3);
// 获取键对应的值
console.log(nameSiteMapping.get("Runoob"));
console.log(nameSiteMapping.get("Google"));
console.log(nameSiteMapping.get("Taobao"));
var name1 = "y";
name1 = "YCY";
let name2 = "YCYYCY";
name2 = "YCY";
var name3 = "YCY";
let name4 = "YCY";
console.log(name1);
console.log(name2);
console.log(name3);
console.log(name4);
var ins = "add $1,$2,$3";
var posOfSpace = ins.indexOf(" ");
var operands = ins.split(",", 3);
console.log(posOfSpace);
console.log(ins.substring(0, 1));
console.log(ins.substring(0, posOfSpace));
console.log(ins.substring(posOfSpace + 1, ins.length));
console.log(operands[0]);
console.log(operands[1]);
console.log(operands[2]);
console.log(NumArrToString_1.numArrToString([0, 1, 0, 1, 1, 0, 0, 1]));
let arr = [];
arr.push(0);
arr.push(1);
arr.push(2);
console.log(arr);
console.log(StringToNumArr_1.stringToNumArr("0110011"));
console.log(TransformZeroOne_1.transformZeroOne("1000111"));
let x = +'1';
console.log(x);
let a = 10;
let b = '1';
let result = b + '' + a;
console.log(result);
console.log(BinaryAddition_1.binaryAddition("101100", "000111"));
console.log(Math.log2(8));
console.log(Math.log2(8) % 1);
console.log(Math.log2(7) % 1);
console.log(Math.ceil(Math.log2(7)) + 1);
console.log(DecimalToBinary_1.decimalToBinary(-8, 6));
let d = undefined;
console.log(d == undefined);
console.log("a" != "a");
console.log("a" == "a");
console.log("-----------------");
let q = "abcde";
let p = "abc";
let o = q.substring(0, 3);
console.log(o == "abc");
console.log(o == p);
console.log(o === "abc");
console.log(o === p);
let e = q.replace("a", "hhh");
console.log(q);
console.log(e);
console.log("---------------");
let instruction = new InstructionR_1.InstructionR("add $1,$2,$3");
console.log(instruction.getBinIns());
let instruction1 = new InstructionI_1.InstructionI("addi $1,$2,10");
console.log(instruction1.getBinIns());
