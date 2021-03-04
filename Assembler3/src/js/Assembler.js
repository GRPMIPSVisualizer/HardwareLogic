"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
const DecoderForR_1 = require("./DecoderForR");
const DecoderForI_1 = require("./DecoderForI");
const DecoderForJ_1 = require("./DecoderForJ");
const MapForCommaNum_1 = require("./MapForCommaNum");
const MapForInsType_1 = require("./MapForInsType");
const ArrayList_1 = require("./ArrayList");
const TrimSpace_1 = require("./TrimSpace");
class Assembler {
    constructor() {
        this.decoderForR = DecoderForR_1.DecoderForR.getDecoder();
        this.decoderForI = DecoderForI_1.DecoderForI.getDecoder();
        this.decoderForJ = DecoderForJ_1.DecoderForJ.getDecoder();
        this.sources = []; //The raw input from the user
        this.data = new ArrayList_1.ArrayList(10); //The contents contained in the .data segment
        this.sourceInsAL = new ArrayList_1.ArrayList(10); //The contents contained in the .text segment in the form of an ArrayList
        this.sourceIns = []; //The contents stored in the .text segment in the form of an array
        this.source = new ArrayList_1.ArrayList(10);
        this.basic = new ArrayList_1.ArrayList(10);
        this.bin = new ArrayList_1.ArrayList(10);
    }
    static getAssembler() {
        return this.assembler;
    }
    getSource() {
        return this.source;
    }
    getBasic() {
        return this.basic;
    }
    getData() {
        return this.data;
    }
    getBin() {
        return this.bin;
    }
    /**
     * Set the sources using the raw input from the user.
     * @param input the raw input from the user
     */
    setSources(input) {
        //let result = true;
        this.sources = input.split("\n");
        //let sourceInsAl: ArrayList<string> = new ArrayList<string>(10);
        let i;
        //let j: number;
        //Deal with MIPS comments which start with a hash sign
        for (i = 0; i < this.sources.length; i++) {
            this.sources[i] = this.sources[i].trim();
            if (this.sources[i].search("#") != -1) {
                let posOfHash = this.sources[i].search("#");
                this.sources[i] = this.sources[i].substring(0, posOfHash);
            }
        }
    }
    /**
     * Divide the sources(the raw input from the user) into two segments -- data segment and text segment.
     * The contents of the data segment are stored into an ArrayList called data.
     * The contents of the text segment are stored into an ArrayList called sourceInsAL
     * and an Array called sourceIns.
     */
    segmentDataText() {
        let i;
        let j;
        let indices = new Array();
        for (i = 0; i < this.sources.length; i++) {
            if (this.sources[i] == ".data" || this.sources[i] == ".text") {
                indices.push(i);
            }
        }
        if (indices.length == 0) {
            for (i = 0; i < this.sources.length; i++) {
                this.sourceInsAL.add(this.sources[i]);
            }
        }
        else {
            for (i = 0; i < indices.length; i++) {
                if (i == 0) {
                    if (indices[0] != 0) {
                        for (j = 0; j < indices[0]; j++) {
                            this.sourceInsAL.add(this.sources[j]);
                        }
                    }
                    if (indices.length == 1) {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[0] + 1; j < this.sources.length; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[0] + 1; j < this.sources.length; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                    else {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[0] + 1; j < indices[1]; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[0] + 1; j < indices[1]; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                }
                else {
                    if (indices.length == (i + 1)) {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[i] + 1; j < this.sources.length; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[i] + 1; j < this.sources.length; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                    else {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[i] + 1; j < indices[i + 1]; j++) {
                                this.data.add(this.sources[j]);
                            }
                        }
                        else {
                            for (j = indices[i] + 1; j < indices[i + 1]; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                }
            }
        }
        for (i = 0; i < this.sourceInsAL.size(); i++) {
            this.sourceIns[i] = this.sourceInsAL.get(i).toString();
        }
    }
    expandPseudo() {
        let i;
        let result = true;
        let posOfSpace;
        let operator;
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "syscall") {
                continue;
            }
            posOfSpace = this.sourceIns[i].indexOf(" ");
            operator = this.sourceIns[i].substring(0, posOfSpace);
            if (MapForCommaNum_1.MapForCommaNum.getMap().has(operator)) {
                let expectedNumComma = MapForCommaNum_1.MapForCommaNum.getMap().get(operator);
                let actualNumComma = this.sourceIns[i].split(",").length - 1;
                if (expectedNumComma == undefined) {
                    console.log("Error 11 in Assembler. Instruction unrecognized.");
                    return false;
                }
                else if (expectedNumComma == actualNumComma) {
                    let type = MapForInsType_1.MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        console.log("Error 12 in Assembler.");
                        return false;
                    }
                    else if (type == "P") {
                        if (operator == "abs") {
                        }
                        else if (operator == "blt") {
                        }
                        else if (operator == "bgt") {
                        }
                        else if (operator == "ble") {
                        }
                        else if (operator == "neg") {
                        }
                        else if (operator == "negu") {
                        }
                        else if (operator == "not") {
                        }
                        else if (operator == "bge") {
                        }
                        else if (operator == "li") {
                        }
                        else if (operator == "la") {
                        }
                        else if (operator == "move") {
                        }
                        else if (operator == "sge") {
                        }
                        else if (operator == "sgt") {
                        }
                    }
                }
            }
        }
        return result;
    }
    translateLabel() {
        let result = true;
        let i;
        let j;
        let label;
        let mapForLabel = new Map();
        let address = "4194304";
        let posOfSpace;
        let operator;
        let jumpLabel;
        let instructionCounter = 0;
        let labelCounter = 0;
        let mapForCounter = new Map();
        let relativeJump = 0;
        let patt = /^[\s]$/;
        let patt2 = /^[0-9]+$/;
        let labelFlag = true;
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "" || patt.test(this.sourceIns[i])) {
                continue;
            }
            else if (this.sourceIns[i].substring(this.sourceIns[i].length - 1, this.sourceIns[i].length) == ":") {
                label = this.sourceIns[i].substring(0, this.sourceIns[i].lastIndexOf(":")).trim();
                if (label.search(" ") != -1) {
                    console.log("Error 9 in Assembler. Label unrecognized.");
                    return false;
                }
                else {
                    mapForLabel.set(label, address);
                    labelCounter = instructionCounter;
                    mapForCounter.set(label, labelCounter.toFixed());
                }
            }
            instructionCounter++;
        }
        instructionCounter = 0;
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "" || patt.test(this.sourceIns[i]) || this.sourceIns[i].substring(this.sourceIns[i].length - 1, this.sourceIns[i].length) == ":") {
                continue;
            }
            else {
                posOfSpace = this.sourceIns[i].indexOf(" ");
                operator = this.sourceIns[i].substring(0, posOfSpace);
                this.source.add(this.sourceIns[i]);
                if (operator == "j" || operator == "jal") {
                    jumpLabel = this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].length).trim();
                    for (j = 0; j < jumpLabel.length; j++) {
                        if (!patt2.test(jumpLabel.charAt(j))) {
                            labelFlag = true;
                            break;
                        }
                        else {
                            labelFlag = false;
                        }
                    }
                    if (labelFlag) {
                        if (mapForLabel.has(jumpLabel)) {
                            if (operator == "j") {
                                this.sourceIns[i] = "j " + mapForLabel.get(jumpLabel);
                            }
                            else {
                                this.sourceIns[i] = "jal " + mapForLabel.get(jumpLabel);
                            }
                            address = (+address + 4).toFixed();
                        }
                        else {
                            console.log("Error 10 in Assembler. Label is not found.");
                            return false;
                        }
                    }
                    else {
                        address = (+address + 4).toFixed();
                    }
                }
                else if (operator == "beq" || operator == "bne") {
                    jumpLabel = this.sourceIns[i].substring(this.sourceIns[i].lastIndexOf(",") + 1, this.sourceIns[i].length).trim();
                    for (j = 0; j < jumpLabel.length; j++) {
                        if (j == 0 && jumpLabel.charAt(0) == "-") {
                            continue;
                        }
                        if (!patt2.test(jumpLabel.charAt(j))) {
                            labelFlag = true;
                            break;
                        }
                        else {
                            labelFlag = false;
                        }
                    }
                    if (labelFlag) {
                        if (mapForLabel.has(jumpLabel)) {
                            relativeJump = +(mapForCounter.get(jumpLabel) + "") - instructionCounter - 1;
                            if (operator == "beq") {
                                this.sourceIns[i] = "beq" + this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                            }
                            else {
                                this.sourceIns[i] = "bne" + this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                            }
                            address = (+address + 4).toFixed();
                        }
                        else {
                            console.log("Error 11 in Assembler. Label is not found.");
                            return false;
                        }
                    }
                    else {
                        address = (+address + 4).toFixed();
                    }
                }
                this.basic.add(TrimSpace_1.trimSpace(this.sourceIns[i]));
                instructionCounter++;
            }
        }
        return result;
    }
    storeData() {
        let result = true;
        let i;
        for (i = 0; i < this.data.size(); i++) {
            let ins = this.data.get(i).toString();
            let posOfColon = ins.indexOf(":");
            //先处理Label
            //再处理.asciiz / .byte ........
        }
        return result;
    }
    assemble() {
        let result = true;
        let i;
        for (i = 0; i < this.basic.size(); i++) {
            let ins = this.basic.get(i).toString();
            if (ins == "syscall") {
                this.bin.add("00000000000000000000000000001100");
                continue;
            }
            let posOfSpace = ins.indexOf(" ");
            let operator = ins.substring(0, posOfSpace);
            if (MapForCommaNum_1.MapForCommaNum.getMap().has(operator)) {
                let expectedNumComma = MapForCommaNum_1.MapForCommaNum.getMap().get(operator);
                let actualNumComma = ins.split(",").length - 1;
                if (expectedNumComma == undefined) {
                    console.log("Error 1 in Assembler. Instruction unrecognized.");
                    return false;
                }
                else if (expectedNumComma == actualNumComma) {
                    let type = MapForInsType_1.MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        console.log("Error 2 in Assembler.");
                        return false;
                    }
                    else {
                        switch (type) {
                            case "R":
                                this.decoderForR.setIns(ins);
                                if (this.decoderForR.validate() == true) {
                                    this.decoderForR.decode();
                                    this.bin.add(this.decoderForR.getBinIns());
                                }
                                else {
                                    console.log("Error 3 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            case "I":
                                this.decoderForI.setIns(ins);
                                if (this.decoderForI.validate() == true) {
                                    this.decoderForI.decode();
                                    this.bin.add(this.decoderForI.getBinIns());
                                }
                                else {
                                    console.log("Error 4 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            case "J":
                                this.decoderForJ.setIns(ins);
                                if (this.decoderForJ.validate() == true) {
                                    this.decoderForJ.decode();
                                    this.bin.add(this.decoderForJ.getBinIns());
                                }
                                else {
                                    console.log("Error 5 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            default:
                                console.log("Error 6 in Assembler. Unrecognized instruction type.");
                                return false;
                        }
                    }
                }
                else {
                    console.log("Error 7 in Assembler. Invalid instruction.");
                    return false;
                }
            }
            else {
                console.log("Error 8 in Assembler. Instruction unrecognized.");
                return false;
            }
        }
        return result;
    }
}
exports.Assembler = Assembler;
Assembler.assembler = new Assembler();
