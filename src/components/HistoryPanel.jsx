import React from "react";
import { motion } from "framer-motion";

export default function HistoryPanel({ history }) {
  return (
    <div className="history-panel">
      <h3>📜 Histórico</h3>
      <ul>
        {history.length === 0 && <p className="muted">Sem operações ainda.</p>}
        {history.map((h, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={
              h.includes("Dividiu")
                ? "split"
                : h.includes("Removeu")
                ? "remove"
                : "insert"
            }
          >
            {h}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
