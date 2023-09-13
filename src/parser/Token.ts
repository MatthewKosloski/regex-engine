class Token {

    private _type: string = '';
    private _lexeme: string = '';
    private _position: Object | null = null;

    /**
     * Instantiates a new Token.
     * 
     * @param {string} type The token type. 
     * @param {string} lexeme The raw text of the token.
     * @param {string} position The position of the token in the string.
     */
    constructor(type: string, lexeme: string, position: string) {
        this._type = type;
        this._lexeme = lexeme;
        this._position = position;
    }

    get type(): string {
        return this._type;
    }

}

export default Token;