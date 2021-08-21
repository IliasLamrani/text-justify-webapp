class Utils {
    /**
     * stringToWordArray
     * @param  {String} string
     * parse the given string to a word array
     */

    static stringToWordArray(string) {
        let words = [];
        let wordsIndex = 0;

        for (let char = 0; char < string.length; char++) {
            if (string[char] !== ' ') {
                if (words[wordsIndex] === undefined)
                    words[wordsIndex] = string[char];
                else words[wordsIndex] += string[char];
            } else {
                if (string[char - 1] !== ' ' && string[char - 1] !== undefined) { //skip multiple spaces
                    words[wordsIndex] = words[wordsIndex].replace(/(\r\n|\n|\r)/gm, ""); //remove all line break
                    wordsIndex += 1;
                }
            }
        }
        return words;
    }

    /**
     * fillStringWithSpaces
     * @param  {String} line
     * @param  {Number} nbSpaces
     * Fill with {nbSpaces} whitespaces the given string
     */

    static fillStringWithSpaces(line, nbSpaces) {
        if (line.indexOf(' ') == -1)
            return line += ' '.repeat(nbSpaces);
        for (let index = 0; nbSpaces !== 0; index++) {
            if (index >= line.length)
                index = 0;
            if (line[index] == ' ') {
                line = line.slice(0, index) + ' ' + line.slice(index);
                nbSpaces -= 1;
                index += 1; //we added a space but we want to keep the same index
            }
        }
        return line;
    }
}

module.exports = Utils;
