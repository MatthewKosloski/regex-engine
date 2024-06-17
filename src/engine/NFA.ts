import LabeledDigraph from './LabeledDigraph';

type Transition = {
    sourceState: string;
    targetState: string;
    symbol: string;
}

/**
 * A nondeterministic finite automaton.
 */
class NFA extends LabeledDigraph {

    // TODO: Remove the alphabet from the NFA to reduce memory footprint. Each
    // NFA will have the same alphabet.
    public readonly alphabet: Set<string>;
    public readonly startState: string;
    public readonly acceptingStates: Set<string>;
    public readonly states: Set<string>;

    /**
     * Constructs a new nondeterministic finite automaton.
     * 
     * @param args The arguments used to construct an NFA.
     */
    constructor(args: {
        states: Set<string>,
        alphabet: Set<string>,
        startState: string,
        acceptingStates: Set<string>
    }) {
        super([...args.states.values()]);
        const { states, alphabet, startState, acceptingStates } = args;
        this.states = states;
        this.alphabet = alphabet;
        this.startState = startState;
        this.acceptingStates = acceptingStates;
    }

    public get transitions(): Transition[] {
        const transitions = [];
        
        for (let sourceIndex = 0; sourceIndex < this.numVertices; sourceIndex++) {
            for (let targetIndex = 0; targetIndex < this.numVertices; targetIndex++) {
                const sourceState = this.toLabel(sourceIndex);
                const targetState = this.toLabel(targetIndex);
                const symbol = this.edgeLabels[sourceIndex][targetIndex];

                if (typeof symbol === 'string') {
                    transitions.push({
                        sourceState,
                        targetState,
                        symbol
                    });
                }
            }
        }

        return transitions;
    }

    public addTransition(transition: Transition): NFA {
        const { sourceState, targetState, symbol } = transition;
        this.addLabeledEdge(sourceState, targetState, symbol);
        return this;
    }

    public addEpsilonTransition(transition: Omit<Transition, 'symbol'>): NFA {
        const { sourceState, targetState } = transition;
        return this.addTransition({ sourceState, targetState, symbol: '' });
    }

    public addTransitions(transitions: Transition[]): NFA {
        transitions.forEach((transition) => this.addTransition(transition));
        return this;
    }

    public removeTransition(transition: Transition): NFA {
        const { sourceState, targetState } = transition;
        this.removeLabeledEdge(sourceState, targetState);
        return this;
    }

    public clone(): NFA {

        const clonedStates = new Set<string>();
        this.states.forEach((state) => clonedStates.add(state));

        const clonedAlphabet = new Set<string>();
        this.alphabet.forEach((symbol) => clonedAlphabet.add(symbol));

        const clonedStartState = this.startState;

        const clonedAcceptingStates = new Set<string>();
        this.acceptingStates.forEach((state) => clonedAcceptingStates.add(state));

        const clone = new NFA({
            states: clonedStates,
            alphabet: clonedAlphabet,
            startState: clonedStartState,
            acceptingStates: clonedAcceptingStates
        });

        for (let sourceIndex = 0; sourceIndex < this.numVertices; sourceIndex++) {
            for (let targetIndex = 0; targetIndex < this.numVertices; targetIndex++) {
                const sourceVertex = this.toLabel(sourceIndex);
                const targetVertex = this.toLabel(targetIndex);
                const label = this.edgeLabels[sourceIndex][targetIndex];

                if (typeof label === 'string') {
                    clone.addLabeledEdge(sourceVertex, targetVertex, label);
                }
            }
        }

        return clone;
    }
}

export default NFA;