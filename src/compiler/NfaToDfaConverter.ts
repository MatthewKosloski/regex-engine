import DFA from "../engine/DFA";
import NFA from "../engine/NFA";
import { getPowerSet } from "utils";

/**
 * Converts a non-deterministic finite automaton (NFA)
 * to a deterministic finite automaton (DFA).
 */
class NfaToDfaConverter {

    private readonly nfa: NFA;

    constructor(nfa: NFA) {
        this.nfa = nfa;
    }

    public convert(): DFA {
        // The set of states of the DFA is P(Q),
        // the power set of states Q in the original NFA.
        const powerset = getPowerSet(this.nfa.states);

        // Flatten the power set such that each set is a string.
        // These strings will be the states of the DFA.
        const states: Set<string> = new Set();
        powerset.forEach((state) => {
            states.add([...state].join(''));
        });

        // The accepting states of the DFA is the set of all states
        // containing at least one accepting state of the NFA.
        const acceptingStates: Set<string> = new Set();
        this.nfa.acceptingStates.forEach((acceptingState) => {
            states.forEach((state) => {
                if (state.includes(acceptingState)) {
                    acceptingStates.add(state);
                }
            });
        });

        // Let E(q) denote the epsilon-closure of a state q. An epsilon-closure
        // of some state q, denoted E(q), is the union of {q} and the set of all
        // states that can be reached from q via one or more epsilon-transitions.
        const startState = '';


        const dfa = new DFA({
            states,
            acceptingStates,
            startState
        });

        const minimizedDfa = this.minimize(dfa);

        return minimizedDfa;
    }

    private minimize(dfa: DFA): DFA {
        // TODO: Use Moore's algorithm to minimize the DFA.
        // - Remove any states which are not reachable from the start state
        // - Merge non-distinct states
        return dfa;
    }

}

export default NfaToDfaConverter;