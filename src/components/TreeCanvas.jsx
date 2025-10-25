import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TreeCanvas({ root }) {
  const nodes = [];
  const edges = [];
  layoutTree(root, 0, 0, 900, nodes, edges);

  return (
    <div className="tree-wrapper">
      <svg width="100%" height="500" className="tree-svg">
        <defs>
          <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#00ffcc" />
          </linearGradient>
        </defs>

        {/* linhas conectando nós */}
        <AnimatePresence>
          {edges.map((e, i) => (
            <motion.line
              key={i}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="url(#edge-gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />
          ))}
        </AnimatePresence>

        {/* nós com animações */}
        <AnimatePresence>
          {nodes.map((node, i) => (
            <motion.g
              key={i}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0, filter: "brightness(4)" }}
              transition={{ duration: 0.6 }}
            >
              <motion.rect
                x={node.x - node.width / 2}
                y={node.y - 18}
                width={node.width}
                height="36"
                rx="10"
                ry="10"
                fill="#0f172a"
                stroke="#00ffff"
                strokeWidth="2"
                filter="drop-shadow(0 0 8px #00ffff80)"
                animate={{
                  boxShadow: [
                    "0 0 8px #00ffff80",
                    "0 0 14px #00ffff",
                    "0 0 8px #00ffff80",
                  ],
                }}
                transition={{ repeat: 0, duration: 0.8 }}
              />
              {node.keys.map((k, j) => (
                <text
                  key={j}
                  x={node.x - node.width / 2 + 24 * (j + 0.5)}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#00eaff"
                  style={{
                    textShadow: "0 0 8px #00eaff",
                    fontFamily: "Consolas, monospace",
                  }}
                >
                  {k}
                </text>
              ))}
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
}

function layoutTree(node, depth, xStart, width, nodes, edges, parent = null) {
  if (!node) return;
  const x = xStart + width / 2;
  const y = depth * 100 + 60;
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
