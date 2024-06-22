import LabeledDigraph from './LabeledDigraph';

export type Transition = {
    sourceState: string;
    targetState: string;
    symbol: string;
}

/**
 * A non-deterministic finite automaton, or NFA.
 */
class NFA extends LabeledDigraph {

    public static alphabet = new Set([
        // lowercase
        ...[
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        ],

        // uppercase
        ...[
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        ],

        // digits
        ...[
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        ],

        // special
        ...[
            '_',
        ]
    ]);

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
        startState: string,
        acceptingStates: Set<string>
    }) {
        super([...args.states.values()]);
        const { states, startState, acceptingStates } = args;
        this.states = states;
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

    public addAcceptingState(state: string): NFA {
        this.acceptingStates.add(state);
        return this;
    }

    public removeAcceptingState(state: string): NFA {
        this.acceptingStates.delete(state);
        return this;
    }

    /**
     * Indicates whether there exists a transition with the provided label
     * originating from the provided state.
     * 
     * @param state The name of an NFA state.
     * @param label A character in the alphabet.
     * @returns True if there exists at least one transition leaving the provided
     * state with the provided label; false otherwise.
     */
    public hasOutgoingTransition(state: string, label: string): boolean {
        return this.edgeLabels[this.toIndex(state)]?.indexOf(label) !== -1;
    }

    public clone(): NFA {

        const clonedStates = new Set<string>();
        this.states.forEach((state) => clonedStates.add(state));

        const clonedStartState = this.startState;

        const clonedAcceptingStates = new Set<string>();
        this.acceptingStates.forEach((state) => clonedAcceptingStates.add(state));

        const clone = new NFA({
            states: clonedStates,
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