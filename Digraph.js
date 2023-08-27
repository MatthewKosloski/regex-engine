
/**
 * A directed graph.
 */
class Digraph {

    matrix = [];

    /**
     * Constructs a new directed graph with a provided number of vertices.
     *
     * @param {number} numVertices The number of vertices in the graph.
     */
    constructor(numVertices) {
        for (let row = 0; row < numVertices; row++) {
            this.matrix[row] = [];
            for (let col = 0; col < numVertices; col++) {
                this.matrix[row][col] = false;
            }
        }
    }

    /**
     * Adds an edge from the source vertex to the target vertex.
     * 
     * @param {number} source The source vertex. 
     * @param {number} target The target vertex.
     * @return {void}
     */
    addEdge(source, target) {
        this.validateVertices(source, target);
        this.matrix[source][target] = true;
    }

    /**
     * Removes an edge from the source vertex to the target vertex.
     * 
     * @param {number} source The source vertex. 
     * @param {number} target The target vertex.
     * @return {void}
     */
    removeEdge(source, target) {
        this.validateVertices(source, target);
        this.matrix[source][target] = false;
    }

    /**
     * Indicates whether there exists an edge going to target from source.
     * 
     * @param {number} source The source vertex. 
     * @param {number} target The target vertex.
     * @return {boolean} True if there's an edge going to target from source; false otherwise.
     */
    hasEdge(source, target) {
        this.validateVertices(source, target);
        return this.matrix[source][target];
    }

    /**
     * Returns vertices such that each vertex has an edge going to it from the provided vertex.
     * 
     * @param {number} vertex A vertex.
     * @returns {number[]} The vertices that neighbor the given vertex. That is, those vertices that
     * have edges going to it from the given vertex.
     */
    getNeighbors(vertex) {
        this.validateVertices(vertex);

        const neighbors = this.matrix[vertex].map((value, index) => value ? index : -1)
            .filter((value) => value >= 0);

        return neighbors;
    }

    validateVertices(...vertices) {
        vertices.forEach((vertex) => {
            const isValid = vertex >= 0 && vertex <= this.matrix.length - 1;

            if (!isValid) {
                throw new Error(`Invalid vertex ${vertex}. The vertex must be between 0 and ${this.matrix.length}.`);
            }
        });
    }
}

module.exports = Digraph;