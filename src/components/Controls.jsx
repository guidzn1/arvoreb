import React from "react";
import { Plus, Trash2, Layers, RefreshCcw } from "lucide-react";

export default function Controls({
  inputVal,
  setInputVal,
  handleInsert,
  handleRemove,
  handleSwitch,
  handleReset,
  treeType,
}) {
  return (
    <div className="controls">
      <input
        type="number"
        placeholder="Valor"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
      />
      <button onClick={handleInsert} className="insert">
        <Plus size={18} /> Inserir
      </button>
      <button onClick={handleRemove} className="remove">
        <Trash2 size={18} /> Excluir
      </button>
      <button onClick={handleSwitch}>
        <Layers size={18} /> Alternar {treeType === "B" ? "→ B+" : "→ B"}
      </button>
      <button onClick={handleReset} className="ghost">
        <RefreshCcw size={18} /> Resetar
      </button>
    </div>
  );
}
