import { expect, test, describe } from 'vitest'
import { type RopeLine, RopeNode } from "./rope";

describe("rope implementation", () => {
  const str = "Hello\n World \n \n Man I Love\n looking at \n";
  const rope = new RopeNode(str);

  const expectedLines: RopeLine[]  = [
    {
      position: 5,
      text: "Hello",
    },
    {
      position: 13,
      text: " World ",
    },
    {
      position: 15,
      text: " ",
    },
    {
      position: 27,
      text: " Man I Love",
    },
    {
      position: 40,
      text: " looking at ",
    },
  ] 

  const lines = rope.getLines();
  test("line count matches", () => {
    expect(lines.length).toBe(expectedLines.length);
  });

  test("positions and text match", () => {
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const expected = expectedLines[index];

      expect(line.text).toBe(expected.text);
      expect(line.position).toBe(expected.position);
    }
  });
});
