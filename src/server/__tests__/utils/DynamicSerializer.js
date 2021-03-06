// mutatively replace fields from a snapshot that will always be changing to something deterministic

export default class DynamicSerializer {
  constructor() {
    this._counter = 0;
    this._cache = {};
  }

  _visitArray(snapshot, path) {
    const nextProp = path[0];
    if (isFinite(nextProp)) {
      if (path.length > 1) {
        this._visitSnapshot(snapshot[nextProp], path.slice(1));
      } else {
        const arrVal = snapshot[nextProp];
        if (arrVal === undefined || arrVal === null) return;
        this._cache[arrVal] = this._cache.hasOwnProperty(arrVal) ? this._cache[arrVal] : this._counter++;
        snapshot[nextProp] = this._cache[arrVal];
      }
      return;
    }
    for (let i = 0; i < snapshot.length; i++) {
      const arrVal = snapshot[i];
      this._visitSnapshot(arrVal, path);
    }
  }

  _visitObject(snapshot, path) {
    const nextLayer = path[0];
    if (!snapshot.hasOwnProperty(nextLayer)) return;
    if (path.length === 1) {
      const oldVal = snapshot[nextLayer];
      if (Array.isArray(oldVal)) {
        for (let i = 0; i < oldVal.length; i++) {
          const arrVal = oldVal[i];
          if (oldVal[i] === undefined || oldVal[i] === null) continue;
          this._cache[arrVal] = this._cache.hasOwnProperty(arrVal) ? this._cache[arrVal] : this._counter++;
          oldVal[i] = this._cache[arrVal];
        }
        return;
      }
      if (snapshot[nextLayer] === undefined || snapshot[nextLayer] === null) return;
      this._cache[oldVal] = this._cache.hasOwnProperty(oldVal) ? this._cache[oldVal] : this._counter++;
      snapshot[nextLayer] = this._cache[oldVal];
      return;
    }
    this._visitSnapshot(snapshot[nextLayer], path.slice(1));
  }

  _visitSnapshot(snapshot, path) {
    if (Array.isArray(snapshot)) {
      this._visitArray(snapshot, path);
    } else {
      this._visitObject(snapshot, path);
    }
  }

  toStatic(snapshot, uids) {
    for (let i = 0; i < uids.length; i++) {
      const uid = uids[i];
      const path = uid.split('.');
      this._visitSnapshot(snapshot, path);
    }
    return snapshot;
  }
}
