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
    private basic: ArrayList<string> = new ArrayList<string>(10);
    private bin: ArrayList<string> = new ArrayList<string>(10);
    private mapForDataLabel: Map<string, string> = new Map();
    private mapForWord: Map<string, number> = new Map();
    private mapForAscii: Map<string, string> = new Map();
    private mapForByte: Map<string, number> = new Map();

    private constructor() { }

    public static getAssembler(): Assembler {
        return this.assembler;
    }

    public getMapForWord(): Map<string, number> {
        return this.mapForWord;
    }

    public getMapForAscii(): Map<string, string> {
        return this.mapForAscii;
    }
     
    public getMapForByte(): Map<string, number> {
        return this.mapForByte;
    }

    //To be deleted
    public getSourceInsAL(): ArrayList<string> {
        return this.sourceInsAL;
    }

    public getSourceIns(): Array<string> {
        return this.sourceIns;
    }

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

    public separateLabelIns(): boolean {
        let result: boolean = true;
        let posOfColon: number;
        let patt = /^[\s]$/;
        let pattLabel = /^[A-Za-z0-9._]+$/;
        let pattnumber = /[0-9]/;
        let i: number;
        let label: string;
        for (i = 0; i < this.sourceIns.length; i++) {
            posOfColon = this.sourceIns[i].indexOf(":");
            if (posOfColon != -1) {
                label = this.sourceIns[i].substring(0, posOfColon).trim();
                if (pattLabel.test(label) && pattnumber.test(label.charAt(0))) {
                    console.log("Error 14 in Assembler. Invalid label.");
                    return false;
                } else if (this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length) == "" || !patt.test(this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length))) {
                    this.sourceIns.splice(i, 1, label + ":", this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length));
                }
            }
        }
        return result;
    }

    public formatData(): boolean {
        let result: boolean = true;
        let i: number;
        let posOfColon: number;
        let posOfQuo: number;
        let label: string;
        let patt = /^[\s]$/;
        let pattLabel = /^[A-Za-z0-9._]+$/;
        let pattnumber = /[0-9]/;
        let resultData: ArrayList<string> = new ArrayList<string>();
        for (i = 0; i < this.data.size(); i++) {
            posOfColon = this.data.get(i).toString().indexOf(":");
            if (posOfColon != -1) {
                label = this.data.get(i).toString().substring(0, posOfColon);
                if (pattLabel.test(label) && pattnumber.test(label.charAt(0))) {
                    console.log("Error 15 in Assembler. Invalid label.");
                    return false;
                }
                if (this.data.get(i).toString().substring(posOfColon + 1, this.data.get(i).toString.length) == "" || !patt.test(this.data.get(i).toString().substring(posOfColon + 1, this.data.get(i).toString.length))) {
                    if (i == this.data.size() - 1) {
                        resultData.add(label + ":");
                        return true;
                    } else if (this.data.get(i + 1).toString().indexOf(":") != -1) {
                        resultData.add(label + ":");
                        continue;
                    } else {
                        if (this.data.get(i + 1).toString().trim() == ".word" || this.data.get(i + 1).toString().trim() == ".byte" || this.data.get(i + 1).toString().trim() == ".ascii" || this.data.get(i + 1).toString().trim() == ".asciiz") {
                            if (i != this.data.size() - 2) {
                                if (this.data.get(i + 2).toString().trim().charAt(0) != ".") {
                                    resultData.add(label + ": " + this.data.get(i + 1).toString() + " " + this.data.get(i + 2).toString());
                                    i = i + 2;
                                    continue;
                                }
                            }
                        } else {
                            resultData.add(label + ": " + this.data.get(i + 1).toString());
                            i++;
                            continue;
                        }
                    }
                } else {
                    resultData.add(label + ": " + this.data.get(i).toString().substring(posOfColon + 1, this.data.get(i).toString.length));
                }
            } else {
                if (this.data.get(i).toString().trim() == ".ascii" || this.data.get(i).toString().trim() == ".asciiz") {
                    if (i == this.data.size() - 1) {
                        return true;
                    } else if (this.data.get(i + 1).toString().trim().charAt(0) == "\"" && this.data.get(i + 1).toString().trim().endsWith("\"")) {
                        resultData.add(this.data.get(i).toString().trim() + " " + this.data.get(i + 1).toString().trim());
                        i++;
                        continue;
                    } else {
                        continue;
                    }
                } else if (this.data.get(i).toString().trim() == ".word") {
                    if (i == this.data.size() - 1) {
                        return true;
                    } else if (pattnumber.test(this.data.get(i + 1).toString().trim())) {
                        resultData.add(".word " + this.data.get(i + 1).toString().trim());
                        i++;
                        continue;
                    } else {
                        continue;
                    }
                } else if (this.data.get(i).toString().trim() == ".byte") {
                    if (i == this.data.size() - 1) {
                        return true;
                    } else if (pattnumber.test(this.data.get(i + 1).toString().trim())) {
                        resultData.add(".byte " + this.data.get(i + 1).toString().trim());
                        i++;
                        continue;
                    } else {
                        continue;
                    }
                }
                posOfQuo = this.data.get(i).toString().indexOf("\"");
                if (posOfQuo != -1) {
                    resultData.add(this.data.get(i).toString().substring(0, posOfQuo).trim() + " " + this.data.get(i).toString().substring(posOfQuo, this.data.get(i).toString().length).trim());
                    continue;
                }
                resultData.add(this.data.get(i).toString().trim());
            }
        }

        for (i = 0; i < resultData.size(); i++) {
            this.data.update(i, resultData.get(i).toString());
        }
        let sizeOfData: number = this.data.size();
        if (sizeOfData > resultData.size()) {
            for (i = resultData.size(); i < sizeOfData; i++) {
                this.data.remove(i);
            }
        }
        return result;
    }

    public storeData(): boolean {
        let result: boolean = true;
        let i: number;
        let j: number;
        let label: string;
        let address: string = "268500992";
        let posOfSpace: number;
        let dataIns: string;
        let patt = /[0-9]/;
        for (i = 0; i < this.data.size(); i++) {
            let ins: string = this.data.get(i).toString();
            let posOfColon: number = ins.indexOf(":");
            if (posOfColon != -1) {
                label = ins.substring(0, posOfColon);
                this.mapForDataLabel.set(label, address);
                let insAfterLabel = ins.substring(posOfColon + 2, ins.length);
                posOfSpace = insAfterLabel.indexOf(" ");
                dataIns = insAfterLabel.substring(0, posOfSpace);
                if (dataIns == ".word") {
                    if (insAfterLabel.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let wordArray = insAfterLabel.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < wordArray.length; j++) {
                            if (!patt.test(wordArray[j])) {
                                console.log("Error 18, Invalid instruction after .word.");
                                return false;
                            } else if (+wordArray[j] > 2147483647 || +wordArray[j] < -2147483648) {
                                console.log("Error 19, .word value out of range.");
                                return false;
                            } else {
                                this.mapForWord.set(address, +wordArray[j]);
                                address = (+address + 4).toFixed();
                            }
                        }
                    } else {
                        if (insAfterLabel.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (patt.test(insAfterLabel.substring(posOfSpace, ins.length).trim())) {
                            console.log("Error 16, Invalid instruction after .word.");
                            return false;
                        } else {
                            let wordNumber: number = +ins.substring(posOfSpace, ins.length).trim();
                            if (wordNumber > 2147483647 || wordNumber < -2147483648) {
                                console.log("Error 17, .word value out of range.");
                                return false;
                            } else {
                                this.mapForWord.set(address, wordNumber);
                                address = (+address + 4).toFixed();
                            }
                        }
                    }
                } else if (dataIns == ".byte") {
                    if (insAfterLabel.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let byteArray = insAfterLabel.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < byteArray.length; j++) {
                            if (!patt.test(byteArray[j])) {
                                console.log("Error 20, Invalid instruction after .byte.");
                                return false;
                            } else if (+byteArray[j] > 127 || +byteArray[j] < -128) {
                                console.log("Error 21, .byte value out of range.");
                                return false;
                            } else {
                                this.mapForByte.set(address, +byteArray[j]);
                                address = (+address + 1).toFixed();
                            }
                        }
                    } else {
                        if (insAfterLabel.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (!patt.test(ins.substring(posOfSpace, ins.length).trim())) {
                            console.log("Error 22, Invalid instruction after .word.");
                            return false;
                        } else {
                            let byteNumber: number = +insAfterLabel.substring(posOfSpace, ins.length).trim();
                            if (byteNumber > 127 || byteNumber < -128) {
                                console.log("Error 23, .byte value out of range.");
                                return false;
                            } else {
                                this.mapForWord.set(address, byteNumber);
                                address = (+address + 1).toFixed();
                            }
                        }
                    }
                } else if (dataIns == ".ascii" || dataIns == ".asciiz") {
                    if (insAfterLabel.substring(posOfSpace, ins.length).trim().charAt(0) != "\"" || !insAfterLabel.substring(posOfSpace, ins.length).trim().endsWith("\"")) {
                        console.log("Error 24, invalid string after .ascii.");
                        return false;
                    } else {
                        if (dataIns == ".ascii") {
                            this.mapForAscii.set(address, insAfterLabel.substring(posOfSpace + 2, insAfterLabel.length - 1));
                            address = (+address + insAfterLabel.substring(posOfSpace + 2, ins.length - 1).length).toFixed();
                        } else {
                            this.mapForAscii.set(address, insAfterLabel.substring(posOfSpace + 2, insAfterLabel.length - 1) + "\n");
                            address = (+address + insAfterLabel.substring(posOfSpace + 2, ins.length - 1).length + 1).toFixed();
                        }
                    }
                }
            } else {
                posOfSpace = ins.indexOf(" ");
                dataIns = ins.substring(0, posOfSpace);
                if (dataIns == ".word") {
                    if (ins.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let wordArray = ins.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < wordArray.length; j++) {
                            if (!patt.test(wordArray[j])) {
                                console.log("Error 18, Invalid instruction after .word.");
                                return false;
                            } else if (+wordArray[j] > 2147483647 || +wordArray[j] < -2147483648) {
                                console.log("Error 19, .word value out of range.");
                                return false;
                            } else {
                                this.mapForWord.set(address, +wordArray[j]);
                                address = (+address + 4).toFixed();
                            }
                        }
                    } else {
                        if (ins.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (!patt.test(ins.substring(posOfSpace, ins.length).trim())) {
                            console.log("Error 16, Invalid instruction after .word.");
                            return false;
                        } else {
                            let wordNumber: number = +ins.substring(posOfSpace, ins.length).trim();
                            if (wordNumber > 2147483647 || wordNumber < -2147483648) {
                                console.log("Error 17, .word value out of range.");
                                return false;
                            } else {
                                this.mapForWord.set(address, wordNumber);
                                address = (+address + 4).toFixed();
                            }
                        }
                    }
                } else if (dataIns == ".byte") {
                    if (ins.substring(posOfSpace, ins.length).trim().indexOf(",") != -1) {
                        let byteArray = ins.substring(posOfSpace, ins.length).trim().split(",");
                        for (j = 0; j < byteArray.length; j++) {
                            if (!patt.test(byteArray[j])) {
                                console.log("Error 20, Invalid instruction after .byte.");
                                return false;
                            } else if (+byteArray[j] > 127 || +byteArray[j] < -128) {
                                console.log("Error 21, .byte value out of range.");
                                return false;
                            } else {
                                this.mapForByte.set(address, +byteArray[j]);
                                address = (+address + 1).toFixed();
                            }
                        }
                    } else {
                        if (ins.substring(posOfSpace, ins.length).trim() == "") {
                            continue;
                        }
                        if (!patt.test(ins.substring(posOfSpace, ins.length).trim())) {
                            console.log("Error 22, Invalid instruction after .word.");
                            return false;
                        } else {
                            let byteNumber: number = +ins.substring(posOfSpace, ins.length).trim();
                            if (byteNumber > 127 || byteNumber < -128) {
                                console.log("Error 23, .byte value out of range.");
                                return false;
                            } else {
                                this.mapForWord.set(address, byteNumber);
                                address = (+address + 1).toFixed();
                            }
                        }
                    }
                } else if (dataIns == ".ascii" || dataIns == ".asciiz") {
                    if (ins.substring(posOfSpace, ins.length).trim().charAt(0) != "\"" || !ins.substring(posOfSpace, ins.length).trim().endsWith("\"")) {
                        console.log("Error 24, invalid string after .ascii.");
                        return false;
                    } else {
                        this.mapForAscii.set(address, ins.substring(posOfSpace + 2, ins.length - 1));
                        if (dataIns == ".ascii") {
                            address = (+address + ins.substring(posOfSpace + 2, ins.length - 1).length).toFixed();
                        } else {
                            address = (+address + ins.substring(posOfSpace + 2, ins.length - 1).length + 1).toFixed();
                        }
                    }
                }
            }

        }
        return result;
    }

    /**
     * Expand the pseudo instructions into basic instructions.
     * @returns true if there is no error in the pseudo instructions, otherwise false
     */
    public expandPseudo(): boolean {
        let i: number;
        let result: boolean = true;
        let posOfSpace: number;
        let operator: string;
        let temp: Array<string> = [];
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
                    console.log("Error 12 in Assembler. Instruction unrecognized.");
                    return false;
                } else if (expectedNumComma == actualNumComma) {
                    let type: string | undefined = MapForInsType.getMap().get(operator);
                    if (type == undefined) {
                        console.log("Error 13 in Assembler. Invalid instruction type.");
                        return false;
                    } else if (type == "P") {
                        let ins0: string = "";
                        let ins1: string = "";
                        let ins2: string = "";
                        let operands: Array<string>;
                        let operand0: string = "";
                        let operand1: string = "";
                        let operand2: string = "";

                        operands = this.sourceIns[i].substring(posOfSpace + 1).split(",");

                        if (operands[0] != "") {
                            operand0 = operands[0];
                        }
                        if (operands[1] != "") {
                            operand1 = operands[1];
                        }
                        if (operands[2] != "") {
                            operand2 = operands[2];
                        }

                        if (operator == "abs") {
                            ins0 = "sra $1," + operand1 + ",31";
                            ins1 = "xor " + operand0 + ",$1," + operand1;
                            ins2 = "subu " + operand0 + "," + operand0 + ",$1";
                        } else if (operator == "blt") {
                            ins0 = "slt $1," + operand0 + "," + operand1;
                            ins1 = "bne $1,$0," + operand2;
                        } else if (operator == "bgt") {
                            ins0 = "slt $1," + operand1 + "," + operand0;
                            ins1 = "bne $1,$0," + operand2;
                        } else if (operator == "ble") {
                            ins0 = "slt $1," + operand1 + "," + operand0;
                            ins1 = "beq $1,$0," + operand2;
                        } else if (operator == "neg") {
                            ins0 = "sub " + operand0 + ",$0," + operand1;
                        } else if (operator == "negu") {
                            ins0 = "subu " + operand0 + ",$0," + operand1;
                        } else if (operator == "not") {
                            ins0 = "nor " + operand0 + "," + operand1 + ",$0";
                        } else if (operator == "bge") {
                            ins0 = "slt $1," + operand0 + "," + operand1;
                            ins1 = "beq $1,$0," + operand2;
                        } else if (operator == "li") {
                            ins0 = "addiu " + operand0 + ",$0," + operand1;
                        } else if (operator == "la") {
                            //la $reg, label
                            //->
                            //lui $1, first 16 bits of label
                            //ori $reg, $1, last 16 bits of label　　　
                        } else if (operator == "move") {
                            ins0 = "addu " + operand0 + ",$0," + operand1;
                        } else if (operator == "sge") {
                            ins0 = "slt " + operand0 + "," + operand1 + "," + operand2;
                            ins1 = "ori $1,$0,1";
                            ins2 = "subu " + operand0 + ",$1," + operand0;
                        } else if (operator == "sgt") {
                            ins0 = "slt" + operand0 + "," + operand2 + "," + operand1;
                        }

                        if (ins0 != "") {
                            temp.push(ins0);
                        }
                        if (ins1 != "") {
                            temp.push(ins1);
                        }
                        if (ins2 != "") {
                            temp.push(ins2);
                        }
                    } else {
                        temp.push(this.sourceIns[i]);
                    }
                }
            } else if (this.sourceIns[i].trim().split(":").length != 0) {
                continue;

            } else {
                console.log("Error. Unrecognized instruction.");
                return false;
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
        let pattLabel = /^[A-Za-z0-9._]+$/;
        let pattnumber = /[0-9]/;
        let labelFlag: boolean = true;
        let posOfColon: number;

        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "" || patt.test(this.sourceIns[i])) {
                continue;
            } else {
                posOfColon = this.sourceIns[i].indexOf(":");
                if (posOfColon != -1) {
                    label = this.sourceIns[i].substring(0, posOfColon).trim();
                    if (pattLabel.test(label) && pattnumber.test(label.charAt(0))) {
                        console.log("Error 9 in Assembler. Invalid label.");
                        return false;
                        // } else if (this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length) == "" || patt.test(this.sourceIns[i].substring(posOfColon + 1, this.sourceIns[i].length))) {
                        //     mapForLabel.set(label, address);
                        //     labelCounter = instructionCounter;
                        //     mapForCounter.set(label, labelCounter.toFixed());
                    } else {
                        mapForLabel.set(label, address);
                        labelCounter = instructionCounter;
                        mapForCounter.set(label, labelCounter.toFixed());
                    }
                }
                address = (+address + 4).toFixed();
            }
            //     if (this.sourceIns[i].substring(this.sourceIns[i].length - 1, this.sourceIns[i].length) == ":") {
            //     label = this.sourceIns[i].substring(0, this.sourceIns[i].lastIndexOf(":")).trim();
            //     if (label.search(" ") != -1) {
            //         console.log("Error 9 in Assembler. Label unrecognized.");
            //         return false;
            //     } else {
            //         mapForLabel.set(label, address);
            //         labelCounter = instructionCounter;
            //         mapForCounter.set(label, labelCounter.toFixed());
            //     }
            // }
            instructionCounter++;
        }

        instructionCounter = 0;
        for (i = 0; i < this.sourceIns.length; i++) {
            if (this.sourceIns[i] == "" || patt.test(this.sourceIns[i]) || this.sourceIns[i].substring(this.sourceIns[i].length - 1, this.sourceIns[i].length) == ":") {
                continue;
            } else {
                posOfSpace = this.sourceIns[i].indexOf(" ");
                operator = this.sourceIns[i].substring(0, posOfSpace);
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

    public preprocess(): boolean {
        this.segmentDataText();
        if (this.formatData()) {
            if (this.separateLabelIns()) {
                if (this.storeData()) {
                    if (this.expandPseudo()) {
                        if (this.translateLabel()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }


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