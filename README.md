# regex-engine

A program that, given a regular expression `a`, constructs a finite state machine that accepts `L(a)`, which is the regular language that is described by `a`.

1. **_In progress_** Using Thompson's construction algorithm, implement `regexToNFA()` to construct a non-deterministic finite state machine from a given regular expression.

2. **_Todo_** Using the subset construction algorithm, implement `nfaToDFA()` to construct a deterministic finite state machine from a given non-deterministic finite state machine.

3. **_Todo_** Using _some algorithm_, minimize the DFA outputted from `nfaToDFA()` such that the resulting DFA has a minimum number of states, which consequently minimizes computation cost.