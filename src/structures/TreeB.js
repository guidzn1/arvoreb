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
    } else this.insertNonFull(r, key);
    this.history.unshift(`Inseriu ${key}`);
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
    this.history.unshift(`Dividiu nó (promoveu ${x.keys[i]})`);
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
}
