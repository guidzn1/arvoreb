import React, { useState } from "react";
import "./index.css";
import { TreeB } from "./structures/TreeB";
import { TreeBPlus } from "./structures/TreeBPlus";
import toast, { Toaster } from "react-hot-toast";
import TreeCanvas from "./components/TreeCanvas";

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

  const handleInsert = () => {
    if (!inputVal.trim()) return toast.error("Digite um número!");
    const val = Number(inputVal);
    const t = cloneTree(tree);
    t.insert(val);
    setTree(t);
    setInputVal("");
    toast.success(`Inserido ${val}`);
  };

  const handleReset = () => {
    setTree(treeType === "B" ? new TreeB() : new TreeBPlus());
    toast("Árvore resetada 🌿");
  };

  return (
    <>
      <nav className="navbar">Visualizador de Árvore {treeType}</nav>
      <div className="container">
        <Toaster position="top-center" />
        <h1>Árvore {treeType === "B" ? "B" : "B+"}</h1>

        <div className="controls">
          <input
            type="number"
            placeholder="Valor"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button onClick={handleInsert}>Inserir</button>
          <button onClick={handleReset} className="ghost">
            Resetar
          </button>
          <button
            onClick={() => {
              const newType = treeType === "B" ? "B+" : "B";
              setTreeType(newType);
              setTree(newType === "B" ? new TreeB() : new TreeBPlus());
              toast(`Alternado para Árvore ${newType}`);
            }}
            className="ghost"
          >
            Alternar
          </button>
        </div>

        <TreeCanvas root={tree.root} />
        <footer>Desenvolvido para estudos de Estruturas de Dados II 🌱</footer>
      </div>
    </>
  );
}
