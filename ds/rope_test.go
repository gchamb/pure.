package ds

import "testing"

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
