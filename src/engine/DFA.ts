import NFA, { Transition } from "./NFA";

/**
 * A deterministic finite automaton, or DFA.
 * 
 * Every DFA is an NFA, however the definition of a DFA is more strict:
 * 
 * - There can be no epsilon-transitions, or transitions going from
 *   some state q0 to some state q1 labeled by the empty string ('').
 * 
 * - For every state q0 in the DFA, there must be exacly one transition
 *   out of q0 to some other state q1 for every consumable symbol in the
 *   alphabet. This is to prevent a situation where the DFA enters a
 *   configuration in which there are still input symbols left to consume
 *   but from which no moves are available (i.e., halting without accepting).
 * 
 */
class DFA extends NFA {

    /**
     * Constructs a new deterministic finite automaton.
     * 
     * @param args The arguments used to construct a DFA.
     */
    constructor(args: {
        states: Set<string>,
        startState: string,
        acceptingStates: Set<string>
    }) {
        super(args);
    }

    public addEpsilonTransition(transition: Omit<Transition, 'symbol'>): NFA {
        throw new Error('Cannot create an epsilon transition on a DFA.');
    }

    public addTransition(transition: Transition): NFA {
        const { sourceState, symbol } = transition;

        // Validate that there doesn't already exist
        // a transition leaving the source state.
        if (this.hasOutgoingTransition(sourceState, symbol)) {
            throw new Error(`
                Cannot add a transition because there already exists
                a transition with the label ${symbol} originating
                from state ${sourceState}.`.replace('/\n/g', '')
            );
        }

        super.addTransition(transition);
        return this;
    }

    /**
     * Returns the epsilon closure of the provided state. The epsilon closure
     * of a state q, denoted E(q), is the union of the set {q} with the set
     * of all states that can be reached from q via one or more epsilon-transitions.
     * 
     * @param state The state.
     * @returns The union of the set {q} with the set of all states that can be reached
     * from q via one or more epsilon-transitions.
     */
    public getEpsilonClosure(state: string): Set<string> {
        const epsilonClosure = new Set<string>();

        // TODO: Implement.

        return epsilonClosure;
    }
}

export default DFA;