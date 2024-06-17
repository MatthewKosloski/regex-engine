import { NFA } from 'engine';
import { Parser } from 'parser';
import { Expr, ExprType } from 'parser/expressions';

/**
 * Compiles a regular expression string to a deterministic finite automaton.
 */
class Compiler {

    private readonly alphabet: Set<string>;
    private readonly regex: string;
    private states: number;

    /**
     * Constructs a new instance of the regular expression compiler.
     * 
     * @param regex The regular expression that is to be compiled to a DFA. 
     */
    constructor(regex: string) {
        this.alphabet = this.getAlphabet();
        this.regex = regex;
        this.states = 0;
    }

    private getAlphabet(): Set<string> {
        const lower = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        ];

        const upper = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        ];

        const digits = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        ];

        const special = [
            '_',
        ];

        return new Set([...lower, ...upper, ...digits, ...special]);
    }

    /**
     * Compile the regular expression.
     * 
     * @return An optimized, deterministic finite automaton that's equivalent
     * to the regular expression.
     */
    public compile(): void {
        const ast = new Parser(this.regex).parse();
        const nfa = this.astToNfa(ast);

        // TODO:
        // return this.minimizeDFA(this.nfaToDFA(this.regexToNFA(ast)));
    }

    private astToNfa(ast: Expr): void {
        const nfas: NFA[] = [];

        ast.children.forEach((expr) => {
            nfas.push(this.regexToNfa(expr));
        });

        // Concat.
        const f = 1;
    }

    /**
     * Converts a given regular expression to a non-deterministic finite state machine.
     * 
     * @param regex The regular expression to be converted to a NFA.
     * @return The equivalent finite state machine.
     */
    private regexToNfa(regex: Expr): NFA {
        // TODO:
        // Uses Thompson's construction algorithm.

        // Perform a post-order traversal through the AST to build the NFA.
        // return new NFA( ... );

        // Recursively build an NFA for each expression based
        // on the expression type.

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
            alphabet: this.alphabet,
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

    private alternationRegexToNfa(regex: Expr): NFA {
        const left = this.regexToNfa(regex.first);
        const right = this.regexToNfa(regex.second);
        return this.unionize(left, right);
    }

    private kleeneStarRegexToNfa(regex: Expr): NFA {
        return null;
    }

    private parenthesizedRegexToNfa(regex: Expr): NFA {
        return null;
    }

    /** 
     * Let L(a) and L(b) be the languages accepted by m1 and m2, respectively. Constructs
     * a new NFA to accept the language L(a) U L(b).
     *
     * @private 
     * @param m1 The first nFA.
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
            alphabet: this.alphabet,
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


    private getState(): string {
        return `q${this.states++}`;
    }

    /**
     * Given a non-deterministic finite automaton, construct an equivalent deterministic
     * finite automaton.
     * 
     * @param nfa The NFA that is to be converted to a DFA.
     * @return The equivalent DFA.
     */
    //private nfaToDFA(nfa: NFA): void {
        // TODO:
        // Uses the subset construction algorithm.
        // return new DFA( ... );
    //};

    /**
     * Given a deterministic finite automaton, construct an equivalent deterministic
     * finite automaton that is optimized for computation.
     * 
     * @param dfa The DFA that is to be optimized.
     * @return A minimized/optimized version of the given DFA.
     */
    // private minimizeDFA(dfa: null) {
        // TODO:
        // Uses Moore's algorithm.
        // return new DFA( ... );
    //};

}

export default Compiler;