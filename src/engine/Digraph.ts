
/**
 * A directed graph.
 */
class Digraph {

    public readonly matrix: boolean[][];
    public readonly numVertices: number;

    /**
     * Constructs a new directed graph with a provided number of vertices.
     *
     * @param numVertices The number of vertices in the graph.
     */
    constructor(numVertices: number) {
        this.numVertices = numVertices;
        this.matrix = [];
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
     * @param source The source vertex. 
     * @param target The target vertex.
     */
    public addEdge(source: number, target: number): void {
        this.validateVertices(source, target);
        this.matrix[source][target] = true;
    }

    /**
     * Removes an edge from the source vertex to the target vertex.
     * 
     * @param source The source vertex. 
     * @param target The target vertex.
     */
    public removeEdge(source: number, target: number): void {
        this.validateVertices(source, target);
        this.matrix[source][target] = false;
    }

    /**
     * Indicates whether there exists an edge going to target from source.
     * 
     * @param source The source vertex. 
     * @param target The target vertex.
     * @return True if there's an edge going to target from source; false otherwise.
     */
    public hasEdge(source: number, target: number): boolean {
        this.validateVertices(source, target);
        return this.matrix[source][target];
    }

    /**
     * Returns vertices such that each vertex has an edge going to it from the provided vertex.
     * 
     * @param vertex A vertex.
     * @returns The vertices that neighbor the given vertex. That is, those vertices that
     * have edges going to it from the given vertex.
     */
    public getNeighbors(vertex: number): number[] {
        this.validateVertices(vertex);

        const neighbors = this.matrix[vertex].map((value, index) => value ? index : -1)
            .filter((value) => value >= 0);

        return neighbors;
    }
    
    private validateVertices(...vertices: number[]): void {
        vertices.forEach((vertex) => {
            const isValid = vertex >= 0 && vertex <= this.matrix.length - 1;

            if (!isValid) {
                throw new Error(`Invalid vertex ${vertex}. The vertex must be between 0 and ${this.matrix.length}.`);
            }
        });
    }
}

export default Digraph;