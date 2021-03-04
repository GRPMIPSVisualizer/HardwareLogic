import { DecoderForR } from "./DecoderForR";
import { DecoderForI } from "./DecoderForI";
import { DecoderForJ } from "./DecoderForJ";
import { MapForCommaNum } from "./MapForCommaNum";
import { MapForInsType } from "./MapForInsType";
import { ArrayList } from "./ArrayList";
import { trimSpace } from "./TrimSpace";

export class Assembler {

    private static assembler: Assembler = new Assembler();
    private decoderForR: DecoderForR = DecoderForR.getDecoder();
    private decoderForI: DecoderForI = DecoderForI.getDecoder();
    private decoderForJ: DecoderForJ = DecoderForJ.getDecoder();
    private sources: Array<string> = []; //The raw input from the user
    private data: ArrayList<string> = new ArrayList<string>(10); //The contents contained in the .data segment
    private sourceInsAL: ArrayList<string> = new ArrayList<string>(10); //The contents contained in the .text segment in the form of an ArrayList
    private sourceIns: Array<string> = []; //The contents stored in the .text segment in the form of an array
    private source: ArrayList<string> = new ArrayList<string>(10);
    private basic: ArrayList<string> = new ArrayList<string>(10);
    private bin: ArrayList<string> = new ArrayList<string>(10);

    private constructor() { }

    public static getAssembler(): Assembler {
        return this.assembler;
    }

    public getSource(): ArrayList<string> {
        return this.source;
    }

    // public getSourceIns(): Array<string> {
    //     return this.sourceIns;
    // }

    public getBasic(): ArrayList<string> {
        return this.basic;
    }

    public getData(): ArrayList<string> {
        return this.data;
    }

    public getBin(): ArrayList<string> {
        return this.bin;
    }

    /**
     * Set the sources using the raw input from the user.
     * @param input the raw input from the user
     */
    public setSources(input: string): void {
        //let result = true;
        this.sources = input.split("\n");
        //let sourceInsAl: ArrayList<string> = new ArrayList<string>(10);
        let i: number;
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
    public segmentDataText(): void {
        let i: number;
        let j: number;
        let indices: Array<number> = new Array<number>();
        for (i = 0; i < this.sources.length; i++) {
            if (this.sources[i] == ".data" || this.sources[i] == ".text") {
                indices.push(i);
            }
            if (this.sources[i] == ".globl main") {
                this.sources[i] = "";
            }
        }

        if (indices.length == 0) {
            for (i = 0; i < this.sources.length; i++) {
                this.sourceInsAL.add(this.sources[i]);
            }
        } else {
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
                        } else {
                            for (j = indices[0] + 1; j < this.sources.length; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    } else {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[0] + 1; j < indices[1]; j++) {
                                this.data.add(this.sources[j]);
                            }
                        } else {
                            for (j = indices[0] + 1; j < indices[1]; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                } else {
                    if (indices.length == (i + 1)) {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[i] + 1; j < this.sources.length; j++) {
                                this.data.add(this.sources[j]);
                            }
                        } else {
                            for (j = indices[i] + 1; j < this.sources.length; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    } else {
                        if (this.sources[indices[i]] == ".data") {
                            for (j = indices[i] + 1; j < indices[i + 1]; j++) {
                                this.data.add(this.sources[j]);
                            }
                        } else {
                            for (j = indices[i] + 1; j < indices[i + 1]; j++) {
                                this.sourceInsAL.add(this.sources[j]);
                            }
                        }
                    }
                }
            }
        }

        for (i = 0; i < this.sourceInsAL.size(); i++) {
            if (this.sourceInsAL.get(i) == "") {
                this.sourceInsAL.remove(i);
            }
        }

        for (i = 0; i < this.sourceInsAL.size(); i++) {
            this.sourceIns[i] = this.sourceInsAL.get(i).toString();
        }
    }

    public expandPseudo(): boolean {//Deal with pseudo instruction
        let i: number;
        let result: boolean = true;
        let posOfSpace: number;
        let operator: string;
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "syscall") {
                continue;
            }
            posOfSpace = this.sourceIns[i].indexOf(" ");
            operator = this.sourceIns[i].substring(0, posOfSpace);
            if (MapForCommaNum.getMap().has(operator)) {
                let expectedNumComma: number | undefined = MapForCommaNum.getMap().get(operator);
                let actualNumComma = this.sourceIns[i].split(",").length - 1;
                if (expectedNumComma == undefined) {
                    console.log("Error 11 in Assembler. Instruction unrecognized.");
                    return false;
                } else if (expectedNumComma == actualNumComma) {
                    let type: string | undefined = MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        console.log("Error 12 in Assembler.");
                        return false;
                    } else if (type == "P") {
                        if (operator == "abs") {

                        } else if (operator == "blt") {

                        } else if (operator == "bgt") {

                        } else if (operator == "ble") {

                        } else if (operator == "neg") {

                        } else if (operator == "negu") {

                        } else if (operator == "not") {

                        } else if (operator == "bge") {

                        } else if (operator == "li") {

                        } else if (operator == "la") {

                        } else if (operator == "move") {

                        } else if (operator == "sge") {

                        } else if (operator == "sgt") {

                        }
                    }
                }
            }
        }
        return result;
    }

    public translateLabel(): boolean {
        let result: boolean = true;
        let i: number;
        let j: number;
        let label: string;
        let mapForLabel: Map<string, string> = new Map();
        let address: string = "4194304";
        let posOfSpace: number;
        let operator: string;
        let jumpLabel: string;
        let instructionCounter: number = 0;
        let labelCounter: number = 0;
        let mapForCounter: Map<string, string> = new Map();
        let relativeJump: number = 0;
        let patt = /^[\s]$/;
        let patt2 = /^[0-9]+$/;
        let labelFlag: boolean = true;

        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "" || patt.test(this.sourceIns[i])) {
                continue;
            } else if (this.sourceIns[i].substring(this.sourceIns[i].length - 1, this.sourceIns[i].length) == ":") {
                label = this.sourceIns[i].substring(0, this.sourceIns[i].lastIndexOf(":")).trim();
                if (label.search(" ") != -1) {
                    console.log("Error 9 in Assembler. Label unrecognized.");
                    return false;
                } else {
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
            } else {
                posOfSpace = this.sourceIns[i].indexOf(" ");
                operator = this.sourceIns[i].substring(0, posOfSpace);
                this.source.add(this.sourceIns[i]);
                if (operator == "j" || operator == "jal") {
                    jumpLabel = this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].length).trim();
                    for (j = 0; j < jumpLabel.length; j++) {
                        if (!patt2.test(jumpLabel.charAt(j))) {
                            labelFlag = true;
                            break;
                        } else {
                            labelFlag = false;
                        }
                    }
                    if (labelFlag) {
                        if (mapForLabel.has(jumpLabel)) {
                            if (operator == "j") {
                                this.sourceIns[i] = "j " + mapForLabel.get(jumpLabel);
                            } else {
                                this.sourceIns[i] = "jal " + mapForLabel.get(jumpLabel);
                            }
                            address = (+address + 4).toFixed();
                        } else {
                            console.log("Error 10 in Assembler. Label is not found.");
                            return false;
                        }
                    } else {
                        address = (+address + 4).toFixed();
                    }
                } else if (operator == "beq" || operator == "bne") {
                    jumpLabel = this.sourceIns[i].substring(this.sourceIns[i].lastIndexOf(",") + 1, this.sourceIns[i].length).trim();
                    for (j = 0; j < jumpLabel.length; j++) {
                        if (j == 0 && jumpLabel.charAt(0) == "-") {
                            continue;
                        }
                        if (!patt2.test(jumpLabel.charAt(j))) {
                            labelFlag = true;
                            break;
                        } else {
                            labelFlag = false;
                        }
                    }
                    if (labelFlag) {
                        if (mapForLabel.has(jumpLabel)) {
                            relativeJump = +(mapForCounter.get(jumpLabel) + "") - instructionCounter - 1;
                            if (operator == "beq") {
                                this.sourceIns[i] = "beq" + this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                            } else {
                                this.sourceIns[i] = "bne" + this.sourceIns[i].substring(posOfSpace, this.sourceIns[i].lastIndexOf(",") + 1) + relativeJump.toFixed();
                            }
                            address = (+address + 4).toFixed();
                        } else {
                            console.log("Error 11 in Assembler. Label is not found.");
                            return false;
                        }
                    } else {
                        address = (+address + 4).toFixed();
                    }
                }
                this.basic.add(trimSpace(this.sourceIns[i]));
                instructionCounter++;
            }
        }
        return result;
    }

    public storeData(): boolean {
        let result: boolean = true;
        let i: number;
        for (i = 0; i < this.data.size(); i++) {
            let ins: string =  this.data.get(i).toString();
            let posOfColon: number = ins.indexOf(":");
            //先处理Label
            //再处理.asciiz / .byte ........
        }
        return result;
    }
    

    public assemble(): boolean {
        let result: boolean = true;
        let i: number;
        for (i = 0; i < this.basic.size(); i++) {
            let ins: string = this.basic.get(i).toString();
            if (ins == "syscall") {
                this.bin.add("00000000000000000000000000001100");
                continue;
            }
            let posOfSpace: number = ins.indexOf(" ");
            let operator: string = ins.substring(0, posOfSpace);
            if (MapForCommaNum.getMap().has(operator)) {
                let expectedNumComma: number | undefined = MapForCommaNum.getMap().get(operator);
                let actualNumComma = ins.split(",").length - 1;
                if (expectedNumComma == undefined) {
                    console.log("Error 1 in Assembler. Instruction unrecognized.");
                    return false;
                } else if (expectedNumComma == actualNumComma) {
                    let type: string | undefined = MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        console.log("Error 2 in Assembler.");
                        return false;
                    } else {
                        switch (type) {
                            case "R":
                                this.decoderForR.setIns(ins);
                                if (this.decoderForR.validate() == true) {
                                    this.decoderForR.decode();
                                    this.bin.add(this.decoderForR.getBinIns());
                                } else {
                                    console.log("Error 3 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            case "I":
                                this.decoderForI.setIns(ins);
                                if (this.decoderForI.validate() == true) {
                                    this.decoderForI.decode();
                                    this.bin.add(this.decoderForI.getBinIns());
                                } else {
                                    console.log("Error 4 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            case "J":
                                this.decoderForJ.setIns(ins);
                                if (this.decoderForJ.validate() == true) {
                                    this.decoderForJ.decode();
                                    this.bin.add(this.decoderForJ.getBinIns());
                                } else {
                                    console.log("Error 5 in Assembler. Invalid instruction.");
                                    return false;
                                }
                                break;
                            default:
                                console.log("Error 6 in Assembler. Unrecognized instruction type.");
                                return false;
                        }
                    }
                } else {
                    console.log("Error 7 in Assembler. Invalid instruction.");
                    return false;
                }
            } else {
                console.log("Error 8 in Assembler. Instruction unrecognized.");
                return false;
            }
        }
        return result;
    }
}