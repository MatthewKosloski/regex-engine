import { NFA } from '../engine';

/**
 * Compiles a regular expression string to a deterministic finite automaton.
 */
class Compiler {

    private regex = '';

    /**
     * Constructs a new instance of the regular expression compiler.
     * 
     * @param {string} regex The regular expression that is to be compiled to a DFA. 
     */
    constructor(regex: string) {
        this.regex = regex;
    }

    /**
     * Compile the regular expression.
     * 
     * @return {DFA} An optimized, deterministic finite automaton that's equivalent
     * to the regular expression.
     */
    public compile(): void {
        // TODO:
        // return this.minimizeDFA(this.nfaToDFA(this.regexToNFA(this.regex)));
    }

    /**
     * Converts a given regular expression to a non-deterministic finite state machine.
     * 
     * @param {string} regex The regular expression to be converted to a NFA.
     * @return The equivalent finite state machine.
     */
    private regexToNFA(regex: string): void {
        // TODO:
        // Uses Thompson's construction algorithm.
        // return new NFA( ... );
    }

    /**
     * Given a non-deterministic finite automaton, construct an equivalent deterministic
     * finite automaton.
     * 
     * @param {NFA} nfa The NFA that is to be converted to a DFA.
     * @return {DFA} The equivalent DFA.
     */
    private nfaToDFA(nfa: NFA): void {
        // TODO:
        // Uses the subset construction algorithm.
        // return new DFA( ... );
    };

    /**
     * Given a deterministic finite automaton, construct an equivalent deterministic
     * finite automaton that is optimized for computation.
     * 
     * @param {DFA} dfa The DFA that is to be optimized.
     * @return {DFA} A minimized/optimized version of the given DFA.
     */
    private minimizeDFA(dfa: null) {
        // TODO:
        // Uses Moore's algorithm.
        // return new DFA( ... );
    };

}

export default Compiler;