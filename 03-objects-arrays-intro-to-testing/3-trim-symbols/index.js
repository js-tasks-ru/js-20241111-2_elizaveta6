/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === 0) return '';
    if (size === undefined) return string;

    let result = '';
    let count = 0;
    let prevChar = null;

    for (const char of string) {
        if (char === prevChar) {
            if (count < size) {
                result += char;
                count++;
            }
        } else {
            result += char;
            prevChar = char;
            count = 1;
        }
    }

    return result;
}