package main

import (
	"ds/impl"
	"fmt"
)

func main() {
	str := "Hello\n World \n Looking at you crazy baby I love you\n Man I Love\n looking at \n"
	rope := impl.NewRope(str) 

	lines := rope.GetLines()

	for i , line := range lines {
		fmt.Printf("Line Count: %d , Lines: %v \n", i, line)
	}
}