export function stringToNumArr(str: string) {
    let i: number;
    let insArr: Array<number> = [];
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) == '1') {
            insArr.push(1);
        } else if (str.charAt(i) == '0') {
            insArr.push(0);
        } else {
            console.log("Error in function stringToNumArr");
            return "";
        }
    }
    return insArr;
}