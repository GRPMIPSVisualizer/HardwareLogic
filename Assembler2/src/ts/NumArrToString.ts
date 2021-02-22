export function numArrToString(numArr: Array<number>) {
    let size = numArr.length;
    let str: string = "";
    let i: number;
    for (i = 0; i < size; i++) {
        if (numArr[i] == 1) {
            str = str + "1";
        } else if (numArr[i] == 0) {
            str = str + "0";
        } else {
            console.log("Error in function numArrToString");
            return "";
        }
    }
    return str;
} 