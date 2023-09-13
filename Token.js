class Token {

    type = '';
    lexeme = '';
    position = null;

    /**
     * Instantiates a new Token.
     * 
     * @param {string} type The token type. 
     * @param {string} lexeme The raw text of the token.
     * @param {string} position The position of the token in the string.
     */
    constructor(type, lexeme, position) {
        this.type = type;
        this.lexeme = lexeme;
        this.position = position;
    }

}

module.exports = Token;