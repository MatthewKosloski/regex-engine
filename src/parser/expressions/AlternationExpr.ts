import Expr, { ExprType } from './Expr';
import Token from '../Token';

class AlternationExpr extends Expr {
    constructor(left: Expr, right: Expr, token?: Token) {
        super({ 
            type: ExprType.Alternation, 
            children: [left, right],
            token,
        });
    }

    public toString(): string {
        return `${this.first.toString()} | ${this.second.toString()}`;
    }
}

export default AlternationExpr;