import { Parser } from 'parser';
import AstToNfaConverter from './AstToNfaConverter';
import NfaToDfaConverter from './NfaToDfaConverter';
import DFA from '../engine/DFA';

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
    public compile(): DFA {
        const ast = new Parser(this.regex).parse();
        const nfa = new AstToNfaConverter(ast).convert();
        const dfa = new NfaToDfaConverter(nfa).convert();

        return dfa;
    }
}

export default Compiler;