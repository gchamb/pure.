package main

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/wailsapp/wails/runtime"
)

// App struct
type App struct {
	ctx context.Context
}
type LoadDirs struct {
	Dirs        []string `json:dirs`
	CurrentPath string   `json:"currentPath"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) LoadDirectories(directory string)LoadDirs{
	// if the directory is empty string use home directory
	var selectedDir string
	dirNames := make([]string, 10)
	if strings.Trim(directory, "") == "" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			fmt.Println(err.Error())
			return LoadDirs{} 
		}

		selectedDir = homeDir
	} else {
		selectedDir = directory
	}

	dirs, err := os.ReadDir(selectedDir)
	if err != nil {
		fmt.Println(err.Error())
		return LoadDirs{}
	}
	for _, dir := range dirs {
		if dir.IsDir() {
			dirNames = append(dirNames, dir.Name())
		}
	}

	return LoadDirs{
		Dirs: dirNames,
		CurrentPath: selectedDir,
	}
}
