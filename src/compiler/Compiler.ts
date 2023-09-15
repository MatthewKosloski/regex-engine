import { NFA } from '../engine';
import { Parser } from '../parser';
import { Expr } from '../parser/expressions';

/**
 * Compiles a regular expression string to a deterministic finite automaton.
 */
class Compiler {

    private regex = '';

    /**
     * Constructs a new instance of the regular expression compiler.
     * 
     * @param regex The regular expression that is to be compiled to a DFA. 
     */
    constructor(regex: string) {
        this.regex = regex;
    }

    /**
     * Compile the regular expression.
     * 
     * @return An optimized, deterministic finite automaton that's equivalent
     * to the regular expression.
     */
    public compile(): void {
        // TODO:
        const ast = new Parser(this.regex).parse();
        const nfa = this.regexToNFA(ast);

        // TODO:
        // return this.minimizeDFA(this.nfaToDFA(this.regexToNFA(ast)));
    }

    /**
     * Converts a given regular expression to a non-deterministic finite state machine.
     * 
     * @param regex The regular expression to be converted to a NFA.
     * @return The equivalent finite state machine.
     */
    private regexToNFA(regex: Expr): void {
        // TODO:
        // Uses Thompson's construction algorithm.

        // Perform a post-order traversal through the AST to build the NFA.
        // return new NFA( ... );
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