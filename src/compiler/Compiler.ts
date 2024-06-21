import { Parser } from 'parser';
import AstToNfaConverter from './AstToNfaConverter';

/**
 * Compiles a regular expression string to a deterministic finite automaton.
 */
class Compiler {

    private readonly regex: string;

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
        const ast = new Parser(this.regex).parse();
        const nfa = new AstToNfaConverter(ast).convert();

        // TODO:
        // return this.minimizeDFA(this.nfaToDFA(this.regexToNFA(ast)));
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