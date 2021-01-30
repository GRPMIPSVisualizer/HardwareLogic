export function binaryToDecimal(binary: string) {
    let result: number = 0;
    
    let power: number = 0;
    let i: number = binary.length - 1;

    for (i; i >= 0; i--) {
        result += +binary[i] * Math.pow(2, power);
        power++;
    }

    return result;
}