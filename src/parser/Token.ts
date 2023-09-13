
export enum TokenType {
    EndOfFile = 'EOF',
    LeftParen = '(',
    RightParen = ')',
    Star = '*',
    Pipe = '|',
    Char = 'char'
}

class Token {

    private _type: TokenType;
    private _lexeme: string;
    private _position: Object | null = null;

    /**
     * Instantiates a new Token.
     * 
     * @param type The token type. 
     * @param lexeme The raw text of the token.
     * @param position The position of the token in the string.
     */
    constructor(type: TokenType, lexeme: string, position: string) {
        this._type = type;
        this._lexeme = lexeme;
        this._position = position;
    }

    get type(): TokenType {
        return this._type;
    }

    get lexeme(): string {
        return this._lexeme;
    }
}

export default Token;