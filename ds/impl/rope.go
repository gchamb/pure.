package impl

import (
	"fmt"
	"strings"
)

// maximum leaf size (8-128 bytes)

/*
	Key rules for implementing a rope data structure:

	Node Structure


	Store weight (size of left subtree)
	Keep actual text only in leaf nodes
	Internal nodes just maintain weights and pointers


	Balancing Rules


	Set maximum leaf size (typically 8-128 bytes)
	Split nodes when they exceed max size
	Keep tree height relatively balanced
	Rebalance when height difference > 2


	Operations Design


	Never copy full strings, only references
	Cache frequently accessed nodes
	Handle edge cases (empty strings, out-of-bounds)
	Maintain parent pointers for easier traversal


	Memory Management


	Pool allocator for small nodes
	Garbage collection for unused nodes
	Share unchanged substrings
	Avoid frequent reallocation


	Performance Rules


	Keep leaf nodes above 50% capacity
	Limit tree height to O(log n)
	Batch small operations
	Lazy evaluation where possible
*/

const LEAF_LIMIT = 20


type RopeLine struct {
	position int 
	text string
}
type RopeNode struct {
	l      *RopeNode
	r      *RopeNode
	weight int
	lines  []int 
	text   string
	Lines []RopeLine
}

func NewRope(s string) *RopeNode {
	strLen := len(s)
	// empty string return nil
	if strLen == 0 {
		return nil
	}
	// the current text can fit as a leaf node
	if strLen <= LEAF_LIMIT {
		node :=  &RopeNode{
			weight: strLen,
			text:   s,
		}
		node.calculateLineBreaks()
		// node.getLines()
		return node	
	}

	// if the text is greater than the leaf limit than split the the text
	mid := strLen / 2

	node := &RopeNode{
		l:      NewRope(s[:mid]),
		r:      NewRope(s[mid:]),
		weight: mid,
	}
	return node
}
func (r *RopeNode) calculateLineBreaks() []int{
	
	positions := make([]int, 0)
	if r.IsLeaf() {
		for index, char := range r.text {
			if char == '\n' {
				positions = append(positions, index)
			}
		}
		r.lines = positions 
		return positions 
	}
	positions = append(append(positions, r.l.calculateLineBreaks()...), r.calculateLineBreaks()...)

	return positions 
}

func (r *RopeNode) GetLines() []RopeLine {

	res := make([]RopeLine, 0)	
	if r.IsLeaf() {

		prev := -1 
		start := 0

		for start < len(r.lines) {

			pos := r.lines[start]
			text := r.text[prev + 1: pos]

			res = append(res, RopeLine{
				text: text,
				position: pos,
			})

			prev = pos
			start += 1	
		} 

		if prev + 1 < len(r.text) {
            res = append(res, RopeLine{
                text:     r.text[prev + 1:],
                position: len(r.text),
            })
        }
		r.Lines = res
		return res
	}

	  // Get lines from left and right subtrees
	  leftLines := r.l.GetLines()
	  rightLines := r.r.GetLines()
  
	  // Adjust positions for right subtree
	  offset := r.weight
	  for i := range rightLines {
		  rightLines[i].position += offset
	  }
  
	  // Check if we need to merge the last line of left with first line of right
	  if len(leftLines) > 0 && len(rightLines) > 0 && 
		 !strings.HasSuffix(leftLines[len(leftLines)-1].text, "\n") {
		  // Merge the split line
		  lastLeft := &leftLines[len(leftLines)-1]
		  firstRight := rightLines[0]
		  lastLeft.text += firstRight.text
		  lastLeft.position = firstRight.position
		  
		  // Use remaining right lines
		  rightLines = rightLines[1:]
	  }
  
	  res = append(res, leftLines...)
	  res = append(res, rightLines...)
	  return res
}

func (r *RopeNode) String() string {
	if r == nil {
		return ""
	}
	if r.IsLeaf() {
		return r.text
	}
	return r.l.String() + r.r.String()
}
func (r *RopeNode) Concat(other *RopeNode) *RopeNode {
	if r == nil {
		return other
	}
	if other == nil {
		return r
	}
	return &RopeNode{
		l:      r,
		r:      other,
		weight: r.weight,
	}
}
func (r *RopeNode) GetLineCount() int {
	if r.IsLeaf() {
		return len(r.lines)
	}
	return r.l.GetLineCount() + r.r.GetLineCount()
}

func (r *RopeNode) Search(i int) string {
	/*
	   if the weight of the current node is lower than the value of i, we subtract the weight from i & move right.
	   If the weight is less than the value of i we simply move left. We continue till the point we reach a leaf node.
	   At the leaf node, we simply return the character at the ith(updated) position
	*/
	if r == nil || i < 0 {
		return ""
	}
	if r.IsLeaf() {
		return r.text[i : i+1]
	}

	if i >= r.weight {
		return r.r.Search(i - r.weight)
	}

	return r.l.Search(i)
}

func (r *RopeNode) Split(i int) (*RopeNode, *RopeNode) {
	if r == nil || i < 0 {
		return nil, nil
	}

	// If we're at a leaf node, split the text
	if r.IsLeaf() {
		if i >= len(r.text) {
			return r, nil
		}
		leftText := (r.text)[:i]
		rightText := (r.text)[i:]
		left := &RopeNode{
			weight: i,
			text:   leftText,
		}
		right := &RopeNode{
			weight: len(rightText),
			text:   rightText,
		}
		return left, right
	}

	// If split point is beyond this node's weight, recurse right
	if i >= r.weight {
		leftSplit, rightSplit := r.r.Split(i - r.weight)
		if leftSplit == nil {
			return r.l, rightSplit
		}
		// Create new node for left part
		left := &RopeNode{
			l:      r.l,
			r:      leftSplit,
			weight: r.weight,
		}
		return left, rightSplit
	}

	// If split point is before this node's weight, recurse left
	leftSplit, rightSplit := r.l.Split(i)
	if rightSplit == nil {
		return leftSplit, r.r
	}
	// Create new node for right part
	right := &RopeNode{
		l:      rightSplit,
		r:      r.r,
		weight: r.weight - i,
	}
	return leftSplit, right
}

func (r *RopeNode) IsLeaf() bool {
	isLeaf := r.l == nil && r.r == nil  
	if isLeaf {
		fmt.Printf("Leaf node text: '%s'\n", r.text)
	}
	return isLeaf
}
func Dfs(r *RopeNode) {
	if r == nil {
		return
	}

	fmt.Println(r.weight, r.text)
	Dfs(r.l)
	Dfs(r.r)
}
