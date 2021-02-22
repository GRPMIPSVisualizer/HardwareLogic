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
    setSource(source) {
        let sourceIns = source.split("\n");
        let i;
        let patt = /^[\s]$/;
        let label;
        let mapForLabel = new Map();
        let address = "4194304";
        let posOfSpace;
        let operator;
        let jumpLabel;
        for (i = 0; i < sourceIns.length; i++) {
            if (sourceIns[i] == "" || patt.test(sourceIns[i])) {
                continue;
            }
            else {
                posOfSpace = sourceIns[i].indexOf(" ");
                operator = sourceIns[i].substring(0, posOfSpace);
                if (sourceIns[i].substring(sourceIns[i].length - 1, sourceIns[i].length) == ":") {
                    label = sourceIns[i].substring(0, sourceIns[i].lastIndexOf(":")).trim();
                    if (label.search(" ") != -1) {
                        console.log("Error 9 in Assembler. Label unrecognized.");
                    }
                    else {
                        mapForLabel.set(label, address);
                        continue;
                    }
                }
                else if (operator == "j" || operator == "jal") {
                    jumpLabel = sourceIns[i].substring(posOfSpace, sourceIns[i].length).trim();
                    if (mapForLabel.has(jumpLabel)) {
                        if (operator == "j") {
                            sourceIns[i] = "j " + mapForLabel.get(jumpLabel);
                        }
                        else {
                            sourceIns[i] = "jal " + mapForLabel.get(jumpLabel);
                        }
                        address = (+address + 4).toFixed();
                    }
                    else {
                        console.log("Error 10 in Assembler. Label is not found.");
                    }
                }
                else if (operator == "beq" || operator == "bne") {
                    jumpLabel = sourceIns[i].substring(sourceIns[i].lastIndexOf(","), sourceIns[i].length).trim();
                    if (mapForLabel.has(jumpLabel)) {
                        if (operator == "beq") {
                            sourceIns[i] = "beq" + sourceIns[i].substring(posOfSpace, sourceIns[i].lastIndexOf(",")) + mapForLabel.get(jumpLabel);
                        }
                        else {
                            sourceIns[i] = "bne" + sourceIns[i].substring(posOfSpace, sourceIns[i].lastIndexOf(",")) + mapForLabel.get(jumpLabel);
                        }
                        address = (+address + 4).toFixed();
                    }
                    else {
                        console.log("Error 11 in Assembler. Label is not found.");
                    }
                }
                this.source.add(sourceIns[i]);
                this.basic.add(TrimSpace_1.trimSpace(sourceIns[i]));
            }
        }
    }
    getBin() {
        return this.bin;
    }
    assemble() {
        let result = true;
        let i;
        for (i = 0; i < this.basic.size(); i++) {
            let ins = this.basic.get(i).toString();
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
