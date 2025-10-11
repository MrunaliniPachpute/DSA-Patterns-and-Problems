/**
 * Dynamic Flowchart Generator
 * A utility for generating interactive flowcharts dynamically
 * for DSA algorithms and problem-solving approaches
 */

class FlowchartGenerator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.nodes = [];
    this.connections = [];
    this.nodeCounter = 0;
  }

  /**
   * Add a node to the flowchart
   * @param {string} type - Type of node (start, process, decision, end)
   * @param {string} label - Text label for the node
   * @param {object} options - Additional styling/positioning options
   */
  addNode(type, label, options = {}) {
    const node = {
      id: this.nodeCounter++,
      type: type,
      label: label,
      x: options.x || 0,
      y: options.y || 0,
      width: options.width || 150,
      height: options.height || 60,
    };
    this.nodes.push(node);
    return node.id;
  }

  /**
   * Connect two nodes with an arrow
   * @param {number} fromNodeId - Source node ID
   * @param {number} toNodeId - Target node ID
   * @param {string} label - Optional label for the connection
   */
  addConnection(fromNodeId, toNodeId, label = '') {
    this.connections.push({
      from: fromNodeId,
      to: toNodeId,
      label: label,
    });
  }

  /**
   * Render the flowchart to the DOM
   */
  render() {
    if (!this.container) {
      console.error('Container element not found');
      return;
    }

    // Clear existing content
    this.container.innerHTML = '';

    // Create SVG canvas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '600');
    svg.setAttribute('class', 'flowchart-svg');

    // Render connections (arrows)
    this.connections.forEach((conn) => {
      const fromNode = this.nodes.find((n) => n.id === conn.from);
      const toNode = this.nodes.find((n) => n.id === conn.to);

      if (fromNode && toNode) {
        const line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );
        line.setAttribute('x1', fromNode.x + fromNode.width / 2);
        line.setAttribute('y1', fromNode.y + fromNode.height);
        line.setAttribute('x2', toNode.x + toNode.width / 2);
        line.setAttribute('y2', toNode.y);
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(line);
      }
    });

    // Render nodes
    this.nodes.forEach((node) => {
      const group = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      );
      group.setAttribute('class', `flowchart-node flowchart-${node.type}`);

      // Create node shape based on type
      let shape;
      if (node.type === 'start' || node.type === 'end') {
        shape = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'ellipse'
        );
        shape.setAttribute('cx', node.x + node.width / 2);
        shape.setAttribute('cy', node.y + node.height / 2);
        shape.setAttribute('rx', node.width / 2);
        shape.setAttribute('ry', node.height / 2);
      } else if (node.type === 'decision') {
        shape = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'polygon'
        );
        const points = `${node.x + node.width / 2},${node.y} ${node.x + node.width},${node.y + node.height / 2} ${node.x + node.width / 2},${node.y + node.height} ${node.x},${node.y + node.height / 2}`;
        shape.setAttribute('points', points);
      } else {
        shape = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'rect'
        );
        shape.setAttribute('x', node.x);
        shape.setAttribute('y', node.y);
        shape.setAttribute('width', node.width);
        shape.setAttribute('height', node.height);
        shape.setAttribute('rx', '5');
      }

      shape.setAttribute('fill', '#f0f0f0');
      shape.setAttribute('stroke', '#333');
      shape.setAttribute('stroke-width', '2');
      group.appendChild(shape);

      // Add text label
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      text.setAttribute('x', node.x + node.width / 2);
      text.setAttribute('y', node.y + node.height / 2);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '14');
      text.textContent = node.label;
      group.appendChild(text);

      svg.appendChild(group);
    });

    // Define arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'marker'
    );
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon'
    );
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', '#333');
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.insertBefore(defs, svg.firstChild);

    this.container.appendChild(svg);
  }

  /**
   * Clear all nodes and connections
   */
  clear() {
    this.nodes = [];
    this.connections = [];
    this.nodeCounter = 0;
    if (this.container) {
      this.container.innerHTML = '';
    }
  }

  /**
   * Auto-layout nodes vertically
   * @param {number} startX - Starting X position
   * @param {number} startY - Starting Y position
   * @param {number} spacing - Vertical spacing between nodes
   */
  autoLayout(startX = 50, startY = 50, spacing = 100) {
    this.nodes.forEach((node, index) => {
      node.x = startX;
      node.y = startY + index * spacing;
    });
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlowchartGenerator;
}
