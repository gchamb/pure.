type RopeLine = {
  position: number;
  text: string;
};

export class RopeNode {
  private static readonly TEXT_LIMIT = 30;
  private left: RopeNode | null;
  private right: RopeNode | null;
  private weight: number;
  private text: string;
  private lineBreakIndices: number[];
  private lines: RopeLine[];

  constructor(s: string) {
    this.left = null;
    this.right = null;
    this.weight = 0;
    this.text = "";
    this.lineBreakIndices = [];
    this.lines = [];

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
    while ((pos = this.text.indexOf("\n", pos + 1)) !== -1) {
      this.lineBreakIndices.push(pos);
    }
  }

  getLines(): RopeLine[] {
    // If the leaf node then get the text in between the the new characters
    if (this.isLeaf()) {
      let prev = -1;
      let start = 0;
      const ropeLines: RopeLine[] = [];
      while (start < this.lineBreakIndices.length) {
        const pos = this.lineBreakIndices[start];

        ropeLines.push({
          position: pos,
          text: this.text.substring(prev + 1, pos),
        });
        prev = pos;
        start += 1;
      }

      if (prev + 1 < this.text.length) {
        ropeLines.push({
          text: this.text.substring(prev + 1),
          position: this.text.length,
        });
      }

      this.lines = ropeLines;
      return ropeLines;
    }

    // Get lines from left and right subtrees
    const leftLines = this.left!.getLines() ?? [];
    let rightLines = this.right!.getLines() ?? [];

    // Adjust positions for right subtree
    const offset = this.weight;
    for (let i = 0; i < rightLines.length; i++) {
      rightLines[i].position += offset;
    }

    // Check if we need to merge the last line of left with first line of right
    if (
      leftLines.length > 0 &&
      rightLines.length > 0 &&
      leftLines[leftLines.length - 1].text.endsWith("\n")
    ) {
      // Merge the split line
      const lastLeft = leftLines[leftLines.length - 1];
      const firstRight = rightLines[0];
      lastLeft.text += firstRight.text;
      lastLeft.position = firstRight.position;

      // Use remaining right lines
      rightLines = rightLines.slice(1);
    }

    return [...leftLines, ...rightLines];
  }

  charAt(index: number): string {
    if (this.isLeaf()) {
      if (index >= this.text.length) {
        throw new Error("Index out of bounds");
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

  constructor(s: string = "") {
    this.root = s.length > 0 ? new RopeNode(s) : null;
  }

  getLineCount() {
    return this.root?.getLines().length;
  }
  getLine(lineNumber: number): RopeLine | undefined {
    if (this.root === null) {
      return;
    }

    return this.root.getLines()[lineNumber];
  }

  charAt(index: number): string {
    if (!this.root) {
      throw new Error("Rope is empty");
    }
    return this.root.charAt(index);
  }

  substring(start: number, end: number): string {
    if (!this.root) {
      return "";
    }
    let result = "";
    for (let i = start; i < end; i++) {
      result += this.charAt(i);
    }
    return result;
  }

  toString(): string {
    return this.root ? this.root.toString() : "";
  }
}
