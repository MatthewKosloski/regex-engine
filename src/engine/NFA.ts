import LabeledDigraph from './LabeledDigraph';

/**
 * A nondeterministic finite automaton.
 */
class NFA extends LabeledDigraph {

    private alphabet = new Set<string>();
    private startState = '';
    private acceptingStates = new Set<string>();

    /**
     * Constructs a new nondeterministic finite automaton.
     * 
     * @param {Set} states The finite set of states.
     * @param {Set} alphabet The finite set of symbols in the language.
     * @param {string} startState The start state.
     * @param {Set} acceptingStates The finite set of accepting states.
     */
    constructor(states: Set<string>, alphabet: Set<string>, startState: string, acceptingStates: Set<string>) {
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
    public addTransition(state: string, symbol: string, ...states: string[]): NFA {
        // states.forEach((targetState) => {
        //     this.addLabeledEdge(state, targetState, symbol);
        // });

        return this;
    }
}

export default NFA;