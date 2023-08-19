
/**
 * Converts a given regular expression to a non-deterministic finite state machine.
 * 
 * @param {string} regex The regular expression to be converted to a NFA.
 * @return The equivalent finite state machine.
 */
const regexToNFA = (regex) => {
 
    // Uses Thompson's construction algorithm.
 
 
}

// Example NFA
const nfa1 = {
    states: new Set(['q0', 'q1', 'q2', 'q3']),
    alphabet: new Set(['a']),
    startStart: 'q0',
    acceptingStates: new Set(['q2']),
    transitions: new Map([
        ['q0,', new Set(['q1'])],
        ['q0,a', new Set(['q2', 'q3'])],
    ])
};