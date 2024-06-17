import Digraph from './Digraph';

/**
 * A directed graph with labeled edges and vertices.
 */
class LabeledDigraph extends Digraph {

    public readonly vertexLabels: string[] = [];
    public readonly edgeLabels: string[][] = [];

    /**
     * Constructs a new labeled directed graph.
     * 
     * @param {string[]} vertices The vertices. 
     */
    constructor(vertices: string[]) {
        super(vertices.length);
        this.vertexLabels = vertices;

        for (let row = 0; row < vertices.length; row++) {
            this.edgeLabels[row] = [];
            for (let col = 0; col < vertices.length; col++) {
                this.edgeLabels[row][col] = null;
            }
        }
    }

    /**
     * Adds a labeled edge from the source vertex to the target vertex.
     * 
     * @param {string} source The source vertex.
     * @param {string} target The target vertex.
     * @param {string} label The label of the edge from the source to the target.
     */
    public addLabeledEdge(source: string, target: string, label: string): void {
        const sourceVertex = this.toIndex(source);
        const targetVertex = this.toIndex(target);

        this.addEdge(sourceVertex, targetVertex);
        this.edgeLabels[sourceVertex][targetVertex] = label;
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     */
    public removeLabeledEdge(source: string, target: string): void {
        this.removeEdge(this.toIndex(source), this.toIndex(target));
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     * @return {boolean}
     */
    public hasLabeledEdge(source: string, target: string): boolean {
        return this.hasEdge(this.toIndex(source), this.toIndex(target));
    }

    public getLabeledNeighbors(vertex: string): number[] {
        return this.getNeighbors(this.toIndex(vertex));
    }

    public toIndex(label: string): number {
        const index = this.vertexLabels.indexOf(label);

        if (index === -1) {
            throw new Error(`No vertex found with label ${label}.`);
        }

        return index;
    }

    public toLabel(index: number): string {
        const label = this.vertexLabels[index];

        if (label === undefined) {
            throw new Error(`No vertex found with index ${index}.`);
        }

        return label;
    }

}

export default LabeledDigraph;