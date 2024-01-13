const verifyInput = (inStr: string, maxLength:number) => {
    if (inStr.length > maxLength) return false
    for (let i = 0, len = inStr.length; i < len; i++) {
        const code = inStr.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123) && // lower alpha (a-z)
            !(code === 32 || code === 63 || code === 46 || code === 44) // space, ?, ., ,
        ) { 
            return false;
        }
    }
    return true;
}

export default verifyInput;