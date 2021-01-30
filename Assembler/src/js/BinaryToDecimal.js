"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalToBinary = void 0;
function binaryToDecimal(binary) {
    let result = 0;
    
    let power = 0;
    let i = binary.length - 1;
    
    for (i; i >= 0; i--) {
        result += +binary[i] * Math.pow(2, power);
        power++;
    }
    return result;
}
exports.binaryToDecimal = binaryToDecimal;