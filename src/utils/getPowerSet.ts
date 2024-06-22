/**
* Calculates the power set of a given set.
* The power set of a set is the collection of all its subsets,
* including the empty set.
* 
* @example
*   getPowerSet(new Set([0,1,2]))
*   // {{}, {0}, {1}, {2}, {0, 1}, {0, 2}, {1, 2}, {0, 1, 2}}
* 
* @template T The type of elements in the set.
* @param set The input set for which to calculate the power set.
* @returns A new set containing all subsets of the input set.
*/
const getPowerSet = <T>(set: Set<T>): Set<Set<T>> => {
    const powerSet = new Set<Set<T>>();
    
    // Let N be the cardinality of set. Then, generate the binary numbers
    // of the base 10 numbers 0 to 2^N-1. These will be the bitmasks for
    // each element in the power set.
    const bitmasks = [];
    const minNumber = 0;
    const maxNumber = Math.pow(2, set.size) - 1; // 2^N-1
    for (let number = minNumber; number <= maxNumber; number++) {
        const maxPadLength = maxNumber.toString(2).length;
        const binaryNumber = number.toString(2);
        const bitmask = binaryNumber.padStart(maxPadLength, '0');

        bitmasks.push(bitmask);
    }

    // Convert each bitmask to a subset.
    const setArr = [...set.values()];
    bitmasks.forEach((bitmask) => {
        const set = new Set<T>();
        const bits = bitmask.split('');

        bits.forEach((bit, index) => {
            if (bit === '1') {
                // Map the position of the bit to the element in the set.
                const element = setArr[index];
                set.add(element);
            }
        })

        powerSet.add(set);
    });

    return powerSet;
};

export default getPowerSet;