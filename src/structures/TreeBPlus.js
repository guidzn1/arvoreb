export class NodeBPlus {
  constructor(t) {
    this.t = t;
    this.keys = [];
    this.children = [];
    this.leaf = true;
    this.next = null; // ponteiro para próxima folha (característico da B+)
  }
}

export class TreeBPlus {
  constructor(t = 2) {
    this.t = t;
    this.root = new NodeBPlus(t);
    this.history = [];
  }

  insert(key) {
    const r = this.root;
    if (r.keys.length === 2 * this.t - 1) {
      const s = new NodeBPlus(this.t);
      s.leaf = false;
      s.children.push(r);
      this.root = s;
      this.splitChild(s, 0);
      this.insertNonFull(s, key);
    } else {
      this.insertNonFull(r, key);
    }
    this.history.unshift(`🌱 Inseriu ${key}`);
  }

  insertNonFull(node, key) {
    if (node.leaf) {
      node.keys.push(key);
      node.keys.sort((a, b) => a - b);
    } else {
      let i = node.keys.length - 1;
      while (i >= 0 && key < node.keys[i]) i--;
      i++;
      if (node.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(node, i);
        if (key > node.keys[i]) i++;
      }
      this.insertNonFull(node.children[i], key);
    }
  }

  splitChild(parent, i) {
    const t = this.t;
    const y = parent.children[i];
    const z = new NodeBPlus(t);
    z.leaf = y.leaf;
    z.keys = y.keys.splice(t);
    if (!y.leaf) {
      z.children = y.children.splice(t);
    }
    parent.children.splice(i + 1, 0, z);
    parent.keys.splice(i, 0, y.keys[y.keys.length - 1]);
    if (y.leaf) {
      z.next = y.next;
      y.next = z;
    }
  }

  // ✅ remoção funcional (simplificada e segura)
  remove(key) {
    if (!this.root) return;
    this.removeNode(this.root, key);
    if (this.root.keys.length === 0 && !this.root.leaf) {
      this.root = this.root.children[0];
    }
    this.history.unshift(`🗑️ Removeu ${key}`);
  }

  removeNode(node, key) {
    if (node.leaf) {
      const idx = node.keys.indexOf(key);
      if (idx !== -1) node.keys.splice(idx, 1);
      return;
    }

    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;
    this.removeNode(node.children[i], key);

    // limpeza se o filho ficou muito pequeno
    if (node.children[i].keys.length < this.t - 1) {
      this.rebalance(node, i);
    }

    // remove chaves vazias internas
    if (node.children[i].keys.length === 0 && !node.children[i].leaf) {
      node.children.splice(i, 1);
      node.keys.splice(i, 1);
    }
  }

  rebalance(node, i) {
    const child = node.children[i];
    const left = node.children[i - 1];
    const right = node.children[i + 1];

    if (left && left.keys.length > this.t - 1) {
      // pega da esquerda
      child.keys.unshift(node.keys[i - 1]);
      node.keys[i - 1] = left.keys.pop();
    } else if (right && right.keys.length > this.t - 1) {
      // pega da direita
      child.keys.push(node.keys[i]);
      node.keys[i] = right.keys.shift();
    } else if (left) {
      // funde com a esquerda
      left.keys = [...left.keys, node.keys[i - 1], ...child.keys];
      node.keys.splice(i - 1, 1);
      node.children.splice(i, 1);
    } else if (right) {
      // funde com a direita
      child.keys = [...child.keys, node.keys[i], ...right.keys];
      node.keys.splice(i, 1);
      node.children.splice(i + 1, 1);
    }
  }
}
