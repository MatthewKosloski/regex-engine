import Digraph from './Digraph';

/**
 * A directed graph with labeled edges and vertices.
 */
class LabeledDigraph extends Digraph {

    private vertexLabels: string[] = [];
    private edgeLabels: string[] = [];

    /**
     * Constructs a new labeled directed graph.
     * 
     * @param {string[]} vertices The vertices. 
     */
    constructor(vertices: string[]) {
        super(vertices.length);
        this.vertexLabels = vertices;
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     * @param {string} label 
     */
    // addLabeledEdge(source: string, target: string, label: string): void {
    //     this.addEdge(this.getVertexIndex(source), this.getVertexIndex(target));

    //     const sourceEdgeLabels = this.edgeLabels[source] ?? [];
    //     sourceEdgeLabels[target] = label;
    // }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     */
    public removeLabeledEdge(source: string, target: string): void {
        this.removeEdge(this.getVertexIndex(source), this.getVertexIndex(target));
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     * @return {boolean}
     */
    public hasLabeledEdge(source: string, target: string): boolean {
        return this.hasEdge(this.getVertexIndex(source), this.getVertexIndex(target));
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     * @return {number[]}
     */
    // getLabeledNeighbors(source: string, target: string): number[] {
    //     return this.getNeighbors(this.getVertexIndex(source), this.getVertexIndex(target));
    // }

    /**
     * Get the index of the vertex with the provided label.
     * 
     * @param {string} label 
     */
    public getVertexIndex(label: string): number {
        const index = this.vertexLabels.indexOf(label);

        if (index === -1) {
            throw new Error(`No vertex found with label ${label}.`);
        }

        return index;
    }

}

export default LabeledDigraph;