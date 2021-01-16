"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToNumArr = void 0;
function stringToNumArr(str) {
    let i;
    let insArr = [];
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) == '1') {
            insArr.push(1);
        }
        else if (str.charAt(i) == '0') {
            insArr.push(0);
        }
        else {
            console.log("Error in function stringToNumArr");
            return "";
        }
    }
    return insArr;
}
exports.stringToNumArr = stringToNumArr;
