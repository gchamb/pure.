export class RopeNode {
  private static readonly TEXT_LIMIT = 30;
  private left: RopeNode | null;
  private right: RopeNode | null;
  private weight: number;
  private text: string;
  private lineBreakIndices: number[];

  constructor(s: string) {
    this.left = null;
    this.right = null;
    this.weight = 0;
    this.text = '';
    this.lineBreakIndices = [];

    if (s.length === 0) {
      return;
    }

    if (s.length <= RopeNode.TEXT_LIMIT) {
      this.text = s;
      this.weight = s.length;
      this.calculateLineBreaks();
      return;
    }

    const mid = Math.floor(s.length / 2);
    this.left = new RopeNode(s.substring(0, mid));
    this.right = new RopeNode(s.substring(mid));
    this.weight = this.left.weight;
  }

  private calculateLineBreaks(): void {
    if (!this.isLeaf()) return;

    let pos = -1;
    while ((pos = this.text.indexOf('\n', pos + 1)) !== -1) {
      this.lineBreakIndices.push(pos);
    }
  }

  getLineBreaks(): { index: number, isStart: boolean }[] {
    if (this.isLeaf()) {
      return this.lineBreakIndices.map(index => ({
        index,
        isStart: true
      }));
    }

    const leftBreaks = this.left!.getLineBreaks();
    const rightBreaks = this.right!.getLineBreaks().map(({ index, isStart }) => ({
      index: index + this.weight,
      isStart
    }));

    return [...leftBreaks, ...rightBreaks];
  }

  charAt(index: number): string {
    if (this.isLeaf()) {
      if (index >= this.text.length) {
        throw new Error('Index out of bounds');
      }
      return this.text[index];
    }

    if (index < this.weight) {
      return this.left!.charAt(index);
    }

    return this.right!.charAt(index - this.weight);
  }

  toString(): string {
    if (this.isLeaf()) {
      return this.text;
    }
    return this.left!.toString() + this.right!.toString();
  }

  private isLeaf(): boolean {
    return this.left === null && this.right === null;
  }
}

export class Rope {
  private root: RopeNode | null;
  private cachedLineCount: number | null;
  private cachedLineStarts: number[] | null;

  constructor(s: string = '') {
    this.root = s.length > 0 ? new RopeNode(s) : null;
    this.cachedLineCount = null;
    this.cachedLineStarts = null;
  }

  private calculateLineInfo(): void {
    if (!this.root) {
      this.cachedLineCount = 0;
      this.cachedLineStarts = [];
      return;
    }

    const lineBreaks = this.root.getLineBreaks();
    this.cachedLineStarts = [-1, ...lineBreaks.map(b => b.index)];
    this.cachedLineCount = this.cachedLineStarts.length;
  }

  getLineCount(): number {
    if (this.cachedLineCount === null) {
      this.calculateLineInfo();
    }
    return this.cachedLineCount!;
  }

  getLine(lineNumber: number): string {
    if (!this.root) {
      throw new Error('Rope is empty');
    }

    if (this.cachedLineStarts === null) {
      this.calculateLineInfo();
    }

    if (lineNumber < 0 || lineNumber >= this.cachedLineCount!) {
      throw new Error('Line number out of bounds');
    }

    const lineStart = this.cachedLineStarts![lineNumber] + 1;
    const lineEnd = lineNumber < this.cachedLineCount! - 1 
      ? this.cachedLineStarts![lineNumber + 1]
      : this.toString().length;

    return this.substring(lineStart, lineEnd);
  }

  getLineAt(charIndex: number): number {
    if (!this.root) {
      throw new Error('Rope is empty');
    }

    if (this.cachedLineStarts === null) {
      this.calculateLineInfo();
    }

    const lineIndex = this.cachedLineStarts!.findIndex(start => start >= charIndex) - 1;
    return lineIndex >= 0 ? lineIndex : 0;
  }

  charAt(index: number): string {
    if (!this.root) {
      throw new Error('Rope is empty');
    }
    return this.root.charAt(index);
  }

  substring(start: number, end: number): string {
    if (!this.root) {
      return '';
    }
    let result = '';
    for (let i = start; i < end; i++) {
      result += this.charAt(i);
    }
    return result;
  }

  toString(): string {
    return this.root ? this.root.toString() : '';
  }
}