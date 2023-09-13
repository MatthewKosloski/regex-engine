const Parser = require('./Parser');

/**
 * Converts a given regular expression to a non-deterministic finite state machine.
 * 
 * @param {string} regex The regular expression to be converted to a NFA.
 * @return The equivalent finite state machine.
 */
const regexToNFA = (regex) => {
    // Parse the regular expression.
    const parser = new Parser(regex);
    const ast = parser.parse();
    let f = 1;

    // Uses Thompson's construction algorithm.
    // return new NFA( ... );
}

regexToNFA('abcd');

// Example NFA
// const nfa = new NFA(
//     new Set(['q0', 'q1', 'q2', 'q3']),
//     new Set(['a']),
//     'q0',
//     new Set(['q2']));

// nfa.addTransition('q0', 'a', 'q1')
//     .addTransition('q0', '', 'q2')
//     .addTransition('q0', '', 'q3');
// nfa.simulate('aab');