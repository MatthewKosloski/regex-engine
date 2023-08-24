const Digraph = require('./Digraph');

/**
 * A directed graph with labeled edges and vertices.
 */
class LabeledDigraph extends Digraph {

    vertexLabels = [];
    edgeLabels = [];

    /**
     * Constructs a new labeled directed graph.
     * 
     * @param {string[]} vertices The vertices. 
     */
    constructor(vertices) {
        super(vertices.length);
        this.vertexLabels = vertices;
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     * @param {string} label 
     */
    addLabeledEdge(source, target, label) {
        this.addEdge(this.getVertexIndex(source), this.getVertexIndex(target));

        const sourceEdgeLabels = this.edgeLabels[source] ?? [];
        sourceEdgeLabels[target] = label;
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     */
    removeLabeledEdge(source, target) {
        this.removeEdge(this.getVertexIndex(source), this.getVertexIndex(target));
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     * @returns 
     */
    hasLabeledEdge(source, target) {
        return this.hasEdge(this.getVertexIndex(source), this.getVertexIndex(target));
    }

    /**
     * 
     * @param {string} source 
     * @param {string} target 
     * @returns 
     */
    getLabeledNeighbors(source, target) {
        return this.getNeighbors(this.getVertexIndex(source), this.getVertexIndex(target));
    }

    /**
     * Get the index of the vertex with the provided label.
     * 
     * @param {string} label 
     */
    getVertexIndex(label) {
        const index = this.vertexLabels.indexOf(label);

        if (index === -1) {
            throw new Error(`No vertex found with label ${label}.`);
        }

        return index;
    }

}

module.exports = LabeledDigraph;