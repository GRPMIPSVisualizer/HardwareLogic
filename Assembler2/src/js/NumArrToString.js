"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numArrToString = void 0;
function numArrToString(numArr) {
    let size = numArr.length;
    let str = "";
    let i;
    for (i = 0; i < size; i++) {
        if (numArr[i] == 1) {
            str = str + "1";
        }
        else if (numArr[i] == 0) {
            str = str + "0";
        }
        else {
            console.log("Error in function numArrToString");
            return "";
        }
    }
    return str;
}
exports.numArrToString = numArrToString;
