export class MapForOperandNum {

    private static map = new Map();

    private constructor() {}

    public static getMap(): Map<string, string> {
        if (this.map.size == 0) {
            this.map.set("add", "3");
            this.map.set("addu", "3");
            this.map.set("sub", "3");
            this.map.set("subu", "3");
            this.map.set("and", "3");
            this.map.set("or", "3");
            this.map.set("nor", "3");
            this.map.set("slt", "3");
            this.map.set("sltu", "3");
            this.map.set("sll", "3");
            this.map.set("srl", "3");
            this.map.set("jr", "1");
            this.map.set("addi", "3");
            this.map.set("addiu", "3");
            this.map.set("andi", "3");
            this.map.set("beq", "3");
            this.map.set("bne", "3");
            this.map.set("lbu", "3");
            this.map.set("lhu", "3");
            this.map.set("ll", "3");
            this.map.set("lui", "2");
            this.map.set("lw", "3");
            this.map.set("ori", "3");
            this.map.set("slti", "3");
            this.map.set("sltiu", "3");
            this.map.set("sb", "3");
            this.map.set("sc", "3");
            this.map.set("sh", "3");
            this.map.set("sw", "3");
            this.map.set("j", "1");
            this.map.set("jal", "1");
        }
        return this.map;
    }
}
