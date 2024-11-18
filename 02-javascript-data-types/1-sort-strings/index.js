/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    return arr.slice().sort((a, b) => {
        const sortOrder = param === 'asc' ? 1 : -1;
    
        if (a.toLowerCase() === b.toLowerCase()) {
          return a < b ? -1 * sortOrder : 1 * sortOrder;
        }
            return a.toLowerCase().localeCompare(b.toLowerCase(), ['ru', 'en']) * sortOrder;
      });
}
