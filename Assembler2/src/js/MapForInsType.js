"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapForInsType = void 0;
class MapForInsType {
    constructor() { }
    static getMap() {
        if (this.map.size == 0) {
            let typeR = "R";
            let typeI = "I";
            let typeJ = "J";
            let typeP = "P";
            this.map.set("add", typeR);
            this.map.set("addu", typeR);
            this.map.set("sub", typeR);
            this.map.set("subu", typeR);
            this.map.set("and", typeR);
            this.map.set("or", typeR);
            this.map.set("nor", typeR);
            this.map.set("slt", typeR);
            this.map.set("sltu", typeR);
            this.map.set("sll", typeR);
            this.map.set("srl", typeR);
            this.map.set("jr", typeR);
            this.map.set("sra", typeR);
            this.map.set("addi", typeI);
            this.map.set("addiu", typeI);
            this.map.set("andi", typeI);
            this.map.set("beq", typeI);
            this.map.set("bne", typeI);
            this.map.set("lbu", typeI);
            this.map.set("lhu", typeI);
            this.map.set("llOp", typeI);
            this.map.set("lui", typeI);
            this.map.set("lw", typeI);
            this.map.set("ori", typeI);
            this.map.set("slti", typeI);
            this.map.set("sltiu", typeI);
            this.map.set("sb", typeI);
            this.map.set("sc", typeI);
            this.map.set("sh", typeI);
            this.map.set("sw", typeI);
            this.map.set("j", typeJ);
            this.map.set("jal", typeJ);
            this.map.set("abs", typeP);
            this.map.set("blt", typeP);
            this.map.set("bgt", typeP);
            this.map.set("ble", typeP);
            this.map.set("neg", typeP);
            this.map.set("negu", typeP);
            this.map.set("not", typeP);
            this.map.set("bge", typeP);
            this.map.set("li", typeP);
            this.map.set("la", typeP);
            this.map.set("move", typeP);
            this.map.set("sge", typeP);
            this.map.set("sgt", typeP);
        }
        return this.map;
    }
}
exports.MapForInsType = MapForInsType;
MapForInsType.map = new Map();
