const Utils = require('./utils');
const fs = require('fs');

/**
 * @param  {String} fileName file where the justified text will be written
 * @param  {String} text content to justify
 * @param  {Number} maxLineLength maximum length of a line
 * Justify the given text, and append the result in the given file
 */

module.exports = (fileName, text, maxLineLength) => {
    let currentLineLength = 0;
    let currentLine = '';
    let words = Utils.stringToWordArray(text);
    let nextLineSize = 0;

    for (let w = 0; w < words.length; w++) {
        nextLineSize = currentLineLength + words[w].length;
        if (nextLineSize > maxLineLength && currentLineLength === 0) { //if the word is too big
            fs.appendFileSync(fileName, words[w] + '\n');
            currentLineLength = 0;
            currentLine = '';
        } else {
            if (nextLineSize > maxLineLength) {
                currentLine = currentLine.slice(0, -1); //end of line will have a space
                currentLine = Utils.fillStringWithSpaces(currentLine, maxLineLength - currentLineLength + 1); //so we have a {maxLineLength} char line
                fs.appendFileSync(fileName, currentLine + '\n');
                currentLineLength = 0;
                currentLine = '';
                w -= 1; //we didn't processed the current word - we'll do it at the next turn
            } else if (nextLineSize === maxLineLength) {
                fs.appendFileSync(fileName, currentLine + words[w] + '\n');
                currentLineLength = 0;
                currentLine = '';
            } else {
                currentLineLength += words[w].length + 1;
                currentLine += words[w] + ' ';
            }
        }
    }
    if (currentLine !== '')
        fs.appendFileSync(fileName, currentLine + '\n');
}