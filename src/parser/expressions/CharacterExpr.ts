import Expr, { ExprType } from './Expr';
import Token from '../Token';

class CharacterExpr extends Expr {
    constructor(token: Token) {
        super({ 
            type: ExprType.Character, 
            token,
        });
    }

    public toString(): string {
        return this.token.lexeme;
    }
}

export default CharacterExpr;