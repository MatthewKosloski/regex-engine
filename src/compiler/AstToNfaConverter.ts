import { NFA } from 'engine';
import { Expr, ExprType } from 'parser/expressions';

/**
 * Converts an abstract syntax tree (AST) of a regular expression
 * to a non-deterministic finite automaton (NFA).
 */
class AstToNfaConverter {

    /**
     * A reference to the root node of the AST of the regular expression
     * that is to be converted to an NFA.
     */
    private readonly ast: Expr;

    /**
     * The number of states in the NFA.
     */
    private numStates: number;

    /**
     * Constructs a new NFA converter for the given AST.
     * 
     * @param ast The root node of the AST that is to be converted. 
     */
    constructor(ast: Expr) {
        this.ast = ast;
        this.numStates = 0;
    }

    /**
     * Convert the AST to an NFA.
     * 
     * @returns The NFA. 
     */
    public convert(): NFA {
        return this.astToNfa(this.ast);
    }

    /**
     * For each child of the AST, constructs an NFA. Then, 
     * combine all NFAs into a single one.
     * 
     * @private
     * @param ast The AST that is to be converted to an NFA.
     * @returns The resulting NFA.
     */
    private astToNfa(ast: Expr): NFA {
        const nfas: NFA[] = [];

        // For each regular expression, build an NFA.
        ast.children.forEach((expr) => {
            nfas.push(this.regexToNfa(expr));
        });

        // Combine all NFAs into a single NFA.
        const nfa = nfas.reduce((m1, m2) => this.concatenate(m1, m2));

        return nfa;
    }

    /**
     * Converts a given regex to an NFA.
     * 
     * @private
     * @param regex The regular expression to be converted to a NFA.
     * @return The equivalent NFA.
     */
    private regexToNfa(regex: Expr): NFA {
        /**
         * Thompson's construction algorithm:
         * Recursively build an NFA for each expression based
         * on the expression type.
         */
        switch (regex.type) {
            case ExprType.Alternation:
                return this.alternationRegexToNfa(regex);
            case ExprType.Character:
                return this.characterRegexToNfa(regex);
            case ExprType.KleeneStar:
                return this.kleeneStarRegexToNfa(regex);
            case ExprType.Parenthesized:
                return this.parenthesizedRegexToNfa(regex);
            default:
                throw new Error(`Unexpected expression type ${regex.type}.`);
        }
    }

    /**
     * Builds an NFA for a single character regular expression.
     * 
     * @private
     * @param regex The single character regular expression. 
     * @returns The equivalent NFA.
     */
    private characterRegexToNfa(regex: Expr): NFA {
        const char = regex.token.lexeme;
        const startState = this.getState();
        const acceptingState = this.getState();

        /**
         * The NFA for a single character is simply
         * a start state connected to exactly one accepting
         * state via an edge labeled by the single character.
         */
        const nfa = new NFA({
            states: new Set([startState, acceptingState]),
            startState: startState,
            acceptingStates: new Set([acceptingState])
        });

        nfa.addTransition({
            sourceState: startState,
            targetState: acceptingState,
            symbol: char,
        });

        return nfa;
    }

    /**
     * Builds an NFA for a regular expression of the form a|b,
     * where a and b are two regular expressions.
     * 
     * @private
     * @param regex The regular expression.
     * @returns The NFA.
     */
    private alternationRegexToNfa(regex: Expr): NFA {
        const left = this.regexToNfa(regex.first);
        const right = this.regexToNfa(regex.second);
        return this.unionize(left, right);
    }

    /**
     * Let a be a regular expression that describes the language L(a).
     * Creates an NFA to accept the language L(a*).
     * 
     * @private
     * @param regex A regular expression that describes the language L(a).
     * @returns An NFA that accepts the language L(a*).
     */
    private kleeneStarRegexToNfa(regex: Expr): NFA {
        const child = this.regexToNfa(regex.first);

        const startState = this.getState();

        const nfa = new NFA({
            states: new Set([
                ...child.states,
                startState,
            ]),
            startState: startState,
            acceptingStates: new Set([startState])
        });

        nfa.addTransitions(child.transitions);

        /**
         * Connect, via epsilon-transition, the start state
         * to the start state of the child NFA.
         */
        nfa.addEpsilonTransition({
            sourceState: startState,
            targetState: child.startState,
        });

        /**
         * Create epsilon-transitions from each of the child NFA's
         * accepting states to the start state.
         */
        child.acceptingStates.forEach((acceptingState) => {
            nfa.addEpsilonTransition({
                sourceState: acceptingState,
                targetState: startState,
            });
        });


        return nfa;
    }

    /**
     * Builds an NFA for a regular expression of the form (a),
     * where a is a regular expression.
     * 
     * @private
     * @param regex The regular expression. 
     * @returns The NFA.
     */
    private parenthesizedRegexToNfa(regex: Expr): NFA {
        return this.astToNfa(regex);
    }

    /** 
     * Let a and b be some regular expressions. Let L(a) and L(b) be the languages accepted
     * by m1 and m2, respectively. Constructs a new NFA to accept the language L(a) U L(b).
     *
     * @private 
     * @param m1 The first NFA.
     * @param m2 The second NFA.
     * @returns A new NFA to accept the union of the languages accepted by the two NFAs. 
     */
    private unionize(m1: NFA, m2: NFA): NFA {
        const startState = this.getState();
        const acceptingState = this.getState();

        const m3 = new NFA({
            states: new Set([
                ...m1.states,
                ...m2.states,
                startState,
                acceptingState
            ]),
            startState: startState,
            acceptingStates: new Set([acceptingState])
        });

        m3.addTransitions(m1.transitions)
            .addTransitions(m2.transitions);

        /**
         * Connect, via epsilon-transitions, the start state of m3
         * to the start states of m1 and m2. 
         */
        m3.addEpsilonTransition({
            sourceState: startState,
            targetState: m1.startState,
        }).addEpsilonTransition({
            sourceState: startState,
            targetState: m2.startState,
        });

        return m3;
    }

    /** 
     * Let a and b be some regular expressions. Let L(a) and L(b) be the languages accepted
     * by m1 and m2, respectively. Constructs a new NFA to accept the language L(a)L(b).
     *
     * @private 
     * @param m1 The first NFA.
     * @param m2 The second NFA.
     * @returns A new NFA to accept the union of the languages accepted by the two NFAs. 
     */
    private concatenate(m1: NFA, m2: NFA): NFA {
        // Instantiate a new NFA to accept L(a)L(b).
        const m3 = new NFA({
            states: new Set([
                ...m1.states,
                ...m2.states,
            ]),
            // The start state of m3 will be the start state of m1.
            startState: m1.startState,
            // The accepting states of m3 will be the accepting states of m2.
            acceptingStates: new Set([...m2.acceptingStates])
        });

        m3.addTransitions(m1.transitions)
            .addTransitions(m2.transitions);

        /*
         * Connect, via epsilon-transitions, every accepting state of m1
         * to the start state of m2.
         */
        m1.acceptingStates.forEach((acceptingState) => {
            m3.addEpsilonTransition({
                sourceState: acceptingState,
                targetState: m2.startState,
            });
        });

        return m3;
    }

    /**
     * Gets a new state name.
     * 
     * @private
     * @returns The name of the state. 
     */
    private getState(): string {
        return `q${this.numStates++}`;
    }

}

export default AstToNfaConverter;