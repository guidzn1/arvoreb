import React, { useState } from "react";
import "./index.css";
import { TreeB } from "./structures/TreeB";
import { TreeBPlus } from "./structures/TreeBPlus";
import toast, { Toaster } from "react-hot-toast";
import TreeCanvas from "./components/TreeCanvas";
import { Plus, RotateCcw, Layers, Trash2 } from "lucide-react";

// Função auxiliar para verificar duplicatas
function existsInTree(node, val) {
  if (!node) return false;
  if (node.keys.includes(val)) return true;
  for (const child of node.children || []) {
    if (existsInTree(child, val)) return true;
  }
  return false;
}

export default function App() {
  const [treeType, setTreeType] = useState("B");
  const [tree, setTree] = useState(new TreeB());
  const [inputVal, setInputVal] = useState("");

  const cloneTree = (src) => {
    const copy = treeType === "B" ? new TreeB(src.t) : new TreeBPlus(src.t);
    copy.root = structuredClone(src.root);
    copy.history = [...src.history];
    return copy;
  };

  // Inserção com verificação de duplicata
  const handleInsert = () => {
    if (!inputVal.trim()) return toast.error("Digite um número!");
    const val = Number(inputVal);
    if (existsInTree(tree.root, val)) {
      toast.error(`⚠️ O valor ${val} já existe na árvore!`);
      return;
    }
    const t = cloneTree(tree);
    t.insert(val);
    setTree(t);
    setInputVal("");
    toast.success(`🌱 Inserido ${val}`);
  };

  // Exclusão
  const handleRemove = () => {
    if (!inputVal.trim()) return toast.error("Digite o número a excluir!");
    const val = Number(inputVal);
    if (!existsInTree(tree.root, val)) {
      toast.error(`❌ Valor ${val} não encontrado!`);
      return;
    }
    const t = cloneTree(tree);
    t.remove(val);
    setTree(t);
    setInputVal("");
    toast(`Removido ${val}`, { icon: "🗑️" });
  };

  // Reset
  const handleReset = () => {
    setTree(treeType === "B" ? new TreeB() : new TreeBPlus());
    toast("Árvore resetada 🔄");
  };

  // Alternar tipo de árvore
  const handleSwitch = () => {
    const newType = treeType === "B" ? "B+" : "B";
    setTreeType(newType);
    setTree(newType === "B" ? new TreeB() : new TreeBPlus());
    toast(`Alternado para Árvore ${newType} 🌈`);
  };

  return (
    <>
      <nav className="navbar">
        <Layers size={18} /> <span>Visualizador de Árvore {treeType}</span>
      </nav>

      <div className="container">
        <Toaster position="top-center" />
        <h1>
          {treeType === "B" ? "🌳 Árvore B" : "🌲 Árvore B+"}
        </h1>

        <div className="controls">
          <input
            type="number"
            placeholder="Digite um valor..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />

          <button onClick={handleInsert} className="insert">
            <Plus size={18} /> Inserir
          </button>

          <button onClick={handleRemove} className="remove">
            <Trash2 size={18} /> Excluir
          </button>

          <button onClick={handleReset} className="ghost">
            <RotateCcw size={18} /> Resetar
          </button>

          <button onClick={handleSwitch} className="switch">
            <Layers size={18} /> Alternar para{" "}
            {treeType === "B" ? "B+" : "B"}
          </button>
        </div>

        <TreeCanvas root={tree.root} />

        <footer>🌌 Desenvolvido para estudos de Estruturas de Dados II</footer>
      </div>
    </>
  );
}
