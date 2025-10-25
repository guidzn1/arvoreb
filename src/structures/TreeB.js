export class NodeB {
  constructor(t) {
    this.t = t;
    this.keys = [];
    this.children = [];
    this.leaf = true;
  }
}

export class TreeB {
  constructor(t = 2) {
    this.t = t;
    this.root = new NodeB(t);
    this.history = [];
  }

  insert(key) {
    const r = this.root;
    if (r.keys.length === 2 * this.t - 1) {
      const s = new NodeB(this.t);
      this.root = s;
      s.leaf = false;
      s.children.push(r);
      this.splitChild(s, 0);
      this.insertNonFull(s, key);
    } else {
      this.insertNonFull(r, key);
    }
    this.history.unshift(`🌱 Inseriu ${key}`);
  }

  splitChild(x, i) {
    const t = this.t;
    const y = x.children[i];
    const z = new NodeB(t);
    z.leaf = y.leaf;
    z.keys = y.keys.splice(t);
    if (!y.leaf) z.children = y.children.splice(t);
    x.children.splice(i + 1, 0, z);
    x.keys.splice(i, 0, y.keys.pop());
    this.history.unshift(`🌸 Dividiu nó — promoveu ${x.keys[i]}`);
  }

  insertNonFull(x, k) {
    let i = x.keys.length - 1;
    if (x.leaf) {
      x.keys.push(k);
      x.keys.sort((a, b) => a - b);
    } else {
      while (i >= 0 && k < x.keys[i]) i--;
      i++;
      if (x.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(x, i);
        if (k > x.keys[i]) i++;
      }
      this.insertNonFull(x.children[i], k);
    }
  }

  // ✅ remoção funcional
  remove(k) {
    if (!this.root) return;
    this.removeNode(this.root, k);
    if (this.root.keys.length === 0 && !this.root.leaf) {
      this.root = this.root.children[0];
    }
    this.history.unshift(`🗑️ Removeu ${k}`);
  }

  removeNode(node, k) {
    const idx = node.keys.findIndex((x) => x === k);

    // caso 1: valor está neste nó
    if (idx !== -1) {
      if (node.leaf) {
        node.keys.splice(idx, 1); // remove direto
      } else {
        // caso 2: nó interno
        const predChild = node.children[idx];
        const succChild = node.children[idx + 1];
        if (predChild.keys.length >= this.t) {
          const pred = this.getPredecessor(predChild);
          node.keys[idx] = pred;
          this.removeNode(predChild, pred);
        } else if (succChild.keys.length >= this.t) {
          const succ = this.getSuccessor(succChild);
          node.keys[idx] = succ;
          this.removeNode(succChild, succ);
        } else {
          // funde os dois filhos e remove da subárvore fundida
          this.merge(node, idx);
          this.removeNode(predChild, k);
        }
      }
      return;
    }

    // caso 3: não está neste nó
    if (node.leaf) return; // nada a fazer

    let childIdx = 0;
    while (childIdx < node.keys.length && k > node.keys[childIdx]) childIdx++;
    const child = node.children[childIdx];

    if (child.keys.length < this.t) {
      this.fill(node, childIdx);
    }

    // ajuste caso a fusão tenha mudado o número de filhos
    const newChild =
      childIdx >= node.children.length ? node.children[childIdx - 1] : node.children[childIdx];
    this.removeNode(newChild, k);
  }

  getPredecessor(node) {
    while (!node.leaf) node = node.children[node.children.length - 1];
    return node.keys[node.keys.length - 1];
  }

  getSuccessor(node) {
    while (!node.leaf) node = node.children[0];
    return node.keys[0];
  }

  fill(node, i) {
    if (i > 0 && node.children[i - 1].keys.length >= this.t) {
      this.borrowFromPrev(node, i);
    } else if (i < node.children.length - 1 && node.children[i + 1].keys.length >= this.t) {
      this.borrowFromNext(node, i);
    } else {
      if (i < node.children.length - 1) this.merge(node, i);
      else this.merge(node, i - 1);
    }
  }

  borrowFromPrev(node, i) {
    const child = node.children[i];
    const sibling = node.children[i - 1];
    child.keys.unshift(node.keys[i - 1]);
    if (!child.leaf) child.children.unshift(sibling.children.pop());
    node.keys[i - 1] = sibling.keys.pop();
  }

  borrowFromNext(node, i) {
    const child = node.children[i];
    const sibling = node.children[i + 1];
    child.keys.push(node.keys[i]);
    if (!child.leaf) child.children.push(sibling.children.shift());
    node.keys[i] = sibling.keys.shift();
  }

  merge(node, i) {
    const child = node.children[i];
    const sibling = node.children[i + 1];
    child.keys.push(node.keys[i]);
    child.keys = [...child.keys, ...sibling.keys];
    if (!child.leaf) child.children = [...child.children, ...sibling.children];
    node.keys.splice(i, 1);
    node.children.splice(i + 1, 1);
  }
}
