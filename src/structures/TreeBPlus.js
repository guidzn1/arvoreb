export class NodeBPlus {
  constructor(t) {
    this.t = t;
    this.keys = [];
    this.children = [];
    this.leaf = true;
    this.next = null;
  }
}

export class TreeBPlus {
  constructor(t = 2) {
    this.t = t;
    this.root = new NodeBPlus(t);
    this.history = [];
  }

  insert(k) {
    const r = this.root;
    if (r.keys.length === 2 * this.t - 1) {
      const s = new NodeBPlus(this.t);
      this.root = s;
      s.leaf = false;
      s.children.push(r);
      this.splitChild(s, 0);
      this.insertNonFull(s, k);
    } else {
      this.insertNonFull(r, k);
    }
    this.history.unshift(`🌿 Inseriu ${k}`);
  }

  splitChild(x, i) {
    const t = this.t;
    const y = x.children[i];
    const z = new NodeBPlus(t);
    z.leaf = y.leaf;
    z.keys = y.keys.splice(t);
    if (!y.leaf) z.children = y.children.splice(t);
    if (y.leaf) {
      z.next = y.next;
      y.next = z;
    }
    x.children.splice(i + 1, 0, z);
    x.keys.splice(i, 0, z.keys[0]);
    this.history.unshift(`🌺 Dividiu folha — nova chave ${x.keys[i]}`);
  }

  insertNonFull(x, k) {
    if (x.leaf) {
      x.keys.push(k);
      x.keys.sort((a, b) => a - b);
    } else {
      let i = x.keys.length - 1;
      while (i >= 0 && k < x.keys[i]) i--;
      i++;
      if (x.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(x, i);
        if (k > x.keys[i]) i++;
      }
      this.insertNonFull(x.children[i], k);
    }
  }

  remove(k) {
    this.history.unshift(`❌ Removeu ${k} (remoção simples)`);
  }
}
