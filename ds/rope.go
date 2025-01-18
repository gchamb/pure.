package ds

import "fmt"

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

const LEAF_LIMIT = 10

type RopeNode struct {
	l      *RopeNode
	r      *RopeNode
	weight int
	text   string
}

func NewRope(s string) *RopeNode {
	strLen := len(s)
	// empty string return nil
	if strLen == 0 {
		return nil
	}
	// the current text can fit as a leaf node
	if strLen <= LEAF_LIMIT {
		return &RopeNode{
			weight: strLen,
			text:   s,
		}
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
	return r.l == nil && r.r == nil
}
func Dfs(r *RopeNode) {
	if r == nil {
		return
	}

	fmt.Println(r.weight, r.text)
	Dfs(r.l)
	Dfs(r.r)
}
