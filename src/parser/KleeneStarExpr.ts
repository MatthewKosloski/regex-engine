import Expr, { ExprType } from './Expr';
import Token from './Token';

class KleeneStarExpr extends Expr {
    constructor(operand: Expr, token: Token) {
        super({ 
            type: ExprType.KleeneStar, 
            children: [operand],
            token,
        });
    }

    public toString(): string {
        return `${this.first.toString()}*`;
    }
}

export default KleeneStarExpr;