"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assembler = void 0;
const DecoderForR_1 = require("./DecoderForR");
const DecoderForI_1 = require("./DecoderForI");
const DecoderForJ_1 = require("./DecoderForJ");
const MapForCommaNum_1 = require("./MapForCommaNum");
const MapForInsType_1 = require("./MapForInsType");
class Assembler {
    constructor() {
        this.decoderForR = DecoderForR_1.DecoderForR.getDecoder();
        this.decoderForI = DecoderForI_1.DecoderForI.getDecoder();
        this.decoderForJ = DecoderForJ_1.DecoderForJ.getDecoder();
        this.ins = "";
        this.binIns = "";
    }
    static getAssembler() {
        return this.assembler;
    }
    setIns(ins) {
        this.ins = ins;
    }
    getBinIns() {
        return this.binIns;
    }
    assemble() {
        let posOfSpace = this.ins.indexOf(" ");
        let operator = this.ins.substring(0, posOfSpace);
        if (MapForCommaNum_1.MapForCommaNum.getMap().has(operator)) {
            let expectedNumComma = MapForCommaNum_1.MapForCommaNum.getMap().get(operator);
            let actualNumComma = this.ins.split(",").length - 1;
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
                            this.decoderForR.setIns(this.ins);
                            if (this.decoderForR.validate() == true) {
                                this.decoderForR.decode();
                                this.binIns = this.decoderForR.getBinIns();
                                return true;
                            }
                            else {
                                console.log("Error 3 in Assembler. Invalid instruction.");
                                return false;
                            }
                        case "I":
                            this.decoderForI.setIns(this.ins);
                            if (this.decoderForI.validate() == true) {
                                this.decoderForI.decode();
                                this.binIns = this.decoderForI.getBinIns();
                                return true;
                            }
                            else {
                                console.log("Error 4 in Assembler. Invalid instruction.");
                                return false;
                            }
                        case "J":
                            this.decoderForJ.setIns(this.ins);
                            if (this.decoderForJ.validate() == true) {
                                this.decoderForJ.decode();
                                this.binIns = this.decoderForJ.getBinIns();
                                return true;
                            }
                            else {
                                console.log("Error 5 in Assembler. Invalid instruction.");
                                return false;
                            }
                        default:
                            console.log("Error 6 in Assembler.");
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
}
exports.Assembler = Assembler;
Assembler.assembler = new Assembler();
