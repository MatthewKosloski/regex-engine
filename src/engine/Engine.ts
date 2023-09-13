/**
 * A regular expression engine.
 */
class Engine {

    private regex = '';

    /**
     * Builds a regular expression engine for the given expression.
     * 
     * @param {string} regex The regular expression. 
     */
    constructor(regex: string) {
        this.regex = regex;
    }

    /**
     * Compiles the regular expression to a DFA.
     * 
     * @return {DFA} A DFA.
     */
    // compile() {
        // TODO:
        // Compiles the given regular expression to a DFA.
        // compiler = new Compiler( ... );
        // return compiler.compile(this.regex);
    // }

    /**
     * Executes a search with this regular expression for a match
     * between the regular expression and the specified string.
     * 
     * @param {string} str The string against which to match the regular expression.
     * @return {boolean} True if there is a match between the regular expression and
     * the string `str`; false otherwise.
     */
    // test(str) {
        // TODO:
        // return compile(this.regex).simulate(str);
    // }
}

export default Engine;