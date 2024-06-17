import Token from "../Token";

export type Parent = Expr | null;

export enum ExprType {
    Alternation = 'Alternation',
    Character = 'Character',
    KleeneStar = 'Kleene',
    Parenthesized = 'Parenthesized',
    Root = 'Root',
}

/**
 * Represents an expression.
 */
abstract class Expr {

    private _type: ExprType;
    private _token: Token | null = null;
    private _parent: Parent = null;
    private _children: Expr[] = [];

    constructor(args: {
        type: ExprType,
        children?: Expr[],
        token?: Token | null,
        parent?: Parent,
    }) {
        const { type, token = null, parent = null, children = [] } = args;
        this._type = type;
        this._token = token;
        this._parent = parent;
        this._children = children;
    }

    /**
     * The parent of the expression.
     */
    get parent(): Parent {
        return this._parent;
    }

    /**
     * The type of the expression.
     */
    get type(): ExprType {
        return this._type;
    }

    /**
     * The children of the expression.
     */
    get children(): Expr[] {
        return this._children;
    }

    /**
     * The first child of the expression.
     */
    get first(): Expr | null {
        return this._children[0] ?? null;
    }

    /**
     * The second child of the expression.
     */
    get second(): Expr | null {
        return this._children[1] ?? null;
    }

    /**
     * The token of the expression.
     */
    get token(): Token | null {
        return this._token;
    }

    public addChild(child: Expr): void {
        child._parent = this;
        this._children.push(child);
    }
}

export default Expr;