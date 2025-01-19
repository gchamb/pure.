package impl

import (
	"fmt"
	"testing"
)

func TestSearchRope(t *testing.T) {
	str := "Hello World"
	r := NewRope(str)

	o := r.Search(4)
	t.Logf("Search at 4 is %s", o)
	if o != "o" {
		t.Fatal("Search at index 4 wasn't o")
	}

	d := r.Search(10)
	if d != "d" {
		t.Fatal("Search at index 10 wasn't d")
	}

	H := r.Search(0)
	if H != "H" {
		t.Fatal("Search at index 0 wasn't H")
	}

}

func TestLineBreak(t *testing.T) {
	str := "Hello\n World \n \n Man I Love\n looking at \n"
	expected := 5

	r := NewRope(str)
	if r.GetLineCount() != expected {
		t.Fatalf("Line break should be %d and you had %d", expected, r.GetLineCount())
	}
}

func TestRopeLines(t *testing.T) {
	str := "Hello\n World \n \n Man I Love\n looking at \n" 
	rope := NewRope(str)
	expectedCount := 5

	expectedLines := []RopeLine{
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
	}

	lines := rope.GetLines()
	fmt.Println(lines)
	if len(lines) != expectedCount {
		t.Fatalf("Rope Lines - Expected: %d Received: %d", expectedCount, len(lines))
	}

	for index, line := range lines {
		if line.text != expectedLines[index].text || line.position != expectedLines[index].position {
			t.Fatalf("Rope Lines - Expected: %v Received: %v", expectedLines[index], line)
		}
	}	
}
