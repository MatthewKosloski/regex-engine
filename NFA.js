const LabeledDigraph = require('./LabeledDigraph');

/**
 * A nondeterministic finite automaton.
 */
class NFA extends LabeledDigraph {

    alphabet = new Set();
    startState = '';
    acceptingStates = new Set();

    /**
     * Constructs a new nondeterministic finite automaton.
     * 
     * @param {Set} states The finite set of states.
     * @param {Set} alphabet The finite set of symbols in the language.
     * @param {string} startState The start state.
     * @param {Set} acceptingStates The finite set of accepting states.
     */
    constructor(states, alphabet, startState, acceptingStates) {
        super([...states.values()]);
        this.alphabet = alphabet;
        this.startState = startState;
        this.acceptingStates = acceptingStates;
    }

    /**
     * Adds a transition to the NFA.
     * 
     * @param {string} state 
     * @param {string} symbol 
     * @param {string[]} states
     * @return {NFA}
     */
    addTransition(state, symbol, ...states) {
        states.forEach((targetState) => {
            this.addLabeledEdge(state, targetState, symbol);
        });

        return this;
    }
}

module.exports = NFA;