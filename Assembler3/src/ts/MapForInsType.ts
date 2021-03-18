/**
 * MapForCommaNum stores core instructions and the types of instructions.
 * The types contain "R", "I", "J" and "P", which type-P is for pseudo instructions.
 */
export class MapForInsType {

    /**
     * The map which the keys are instructions and the values are the types of instructions.
     */
    private static map = new Map([
        ["add", "R"],
        ["addu", "R"],
        ["sub", "R"],
        ["subu", "R"],
        ["and", "R"],
        ["or", "R"],
        ["nor", "R"],
        ["slt", "R"],
        ["sltu", "R"],
        ["sll", "R"],
        ["srl", "R"],
        ["jr", "R"],
        ["sra", "R"],

        ["addi", "I"],
        ["addiu", "I"],
        ["andi", "I"],
        ["beq", "I"],
        ["bne", "I"],
        ["lbu", "I"],
        ["lhu", "I"],
        ["ll", "I"],
        ["lui", "I"],
        ["lw", "I"],
        ["ori", "I"],
        ["slti", "I"],
        ["sltiu", "I"],
        ["sb", "I"],
        ["sc", "I"],
        ["sh", "I"],
        ["sw", "I"],

        ["j", "J"],
        ["jal", "J"],

        ["abs", "P"],
        ["blt", "P"],
        ["bgt", "P"],
        ["ble", "P"],
        ["neg", "P"],
        ["negu", "P"],
        ["not", "P"],
        ["bge", "P"],
        ["li", "P"],
        ["la", "P"],
        ["move", "P"],
        ["sge", "P"],
        ["sgt", "P"]
    ]);

    /**
     * Constructor of MapForInsType which is a singleton.
     */
    private constructor() { }

    /**
     * Method for getting the singleton map.
     * @returns a map which the keys instructions and the values are the types of instructions.
     */
    public static getMap(): Map<string, string> {
        return this.map;
    }
}