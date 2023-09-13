import Token from "./Token";

export type Parent = Expr | null;

/**
 * Represents an expression.
 */
class Expr {

    private _type: string = '';
    private _token: Token | null = null;
    private _parent: Parent = null;
    private _children: Expr[] = [];

    constructor(type = '', token: Token | null = null, parent: Parent = null, ...children: Expr[]) {
        this._type = type;
        this._token = token;
        this._parent = parent;
        this._children = children;
    }

    get parent(): Parent {
        return this._parent;
    }

    get type(): string {
        return this._type;
    }

    get children(): Expr[] {
        return this._children;
    }

    get token(): Token | null {
        return this._token;
    }

    public addChild(child: Expr): void {
        child._parent = this;
        this._children.push(child);
    }
}

export default Expr;