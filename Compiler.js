/**
 * Compiles a regular expression string to a deterministic finite automaton
 * that's suitable for computation.
 */
class Compiler {

    regex = '';

    /**
     * Constructs a new instance of the regular expression compiler.
     * 
     * @param {string} regex The regular expression that is to be compiled to a DFA. 
     */
    constructor(regex) {
        this.regex = regex;
    }

    /**
     * Compile the regular expression.
     * 
     * @return {DFA} An optimized, deterministic finite automaton that's equivalent
     * to the regular expression.
     */
    compile() {
        // TODO:
        // return this.minimizeDFA(this.nfaToDFA(this.regexToNFA(this.regex)));
    }

    /**
     * Converts a given regular expression to a non-deterministic finite state machine.
     * 
     * @param {string} regex The regular expression to be converted to a NFA.
     * @return The equivalent finite state machine.
     */
    regexToNFA(regex) {
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
    nfaToDFA(nfa) {
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
    minimizeDFA(dfa) {
        // TODO:
        // Uses Moore's algorithm.
        // return new DFA( ... );
    };

}