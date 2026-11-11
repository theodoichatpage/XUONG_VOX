export class ProjectHistory {
  constructor(initial, limit = 30) { this.states = [JSON.stringify(initial)]; this.index = 0; this.limit = limit; this.group = false; this.groupChanged = false; }
  begin() { this.group = true; this.groupChanged = false; }
  end() { this.group = false; this.groupChanged = false; }
  record(project) {
    const snapshot = JSON.stringify(project);
    if (snapshot === this.states[this.index]) return;
    if (this.group && this.groupChanged) this.states[this.index] = snapshot;
    else {
      this.states.splice(this.index + 1);
      this.states.push(snapshot);
      if (this.states.length > this.limit) this.states.shift();
      this.index = this.states.length - 1;
      if (this.group) this.groupChanged = true;
    }
  }
  undo() { if (this.index === 0) return null; this.end(); return JSON.parse(this.states[--this.index]); }
  redo() { if (this.index >= this.states.length - 1) return null; this.end(); return JSON.parse(this.states[++this.index]); }
}
