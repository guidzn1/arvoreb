import React from "react";

export default function TreeCanvas({ root }) {
  const nodes = [];
  const edges = [];
  layoutTree(root, 0, 0, 900, nodes, edges);

  return (
    <div className="tree-wrapper">
      <svg width="100%" height="500" className="tree-svg">
        {/* linhas conectando nós */}
        {edges.map((e, i) => (
          <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} className="edge" />
        ))}

        {/* nós */}
        {nodes.map((node, i) => (
          <g key={i} className="node">
            <rect
              x={node.x - node.width / 2}
              y={node.y - 18}
              width={node.width}
              height="36"
              rx="8"
              ry="8"
              fill="white"
              stroke="#2563eb"
            />
            {node.keys.map((k, j) => (
              <text
                key={j}
                x={node.x - node.width / 2 + 24 * (j + 0.5)}
                y={node.y + 4}
                textAnchor="middle"
              >
                {k}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

function layoutTree(node, depth, xStart, width, nodes, edges, parent = null) {
  if (!node) return;
  const x = xStart + width / 2;
  const y = depth * 100 + 50;
  const nodeWidth = Math.max(40, node.keys.length * 24 + 10);
  nodes.push({ x, y, width: nodeWidth, keys: node.keys });

  if (parent)
    edges.push({
      x1: parent.x,
      y1: parent.y + 18,
      x2: x,
      y2: y - 18,
    });

  if (node.children && node.children.length > 0) {
    const step = width / node.children.length;
    node.children.forEach((child, i) =>
      layoutTree(child, depth + 1, xStart + i * step, step, nodes, edges, { x, y })
    );
  }
}
