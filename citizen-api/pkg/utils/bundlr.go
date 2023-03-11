package utils

import (
	"os"
	"os/exec"
	"strings"
)

func savecontent(content []byte) error {
	f, err := os.Create("content.json")

	if err != nil {
		return err
	}

	defer f.Close()

	_, err = f.Write(content)

	if err != nil {
		return err
	}
	return nil
}

// Upload file to arweave

func Upload(content []byte) (string, error) {
	err := savecontent(content)
	if err != nil {
		return "", err
	}
	out, err := exec.Command("bundlr", "upload", "content.json", "-h", "https://node1.bundlr.network", "-w", "wallet.json", "-c", "arweave").Output()
	if err != nil {
		return "", err
	}
	s := strings.Split(string(out), " ")
	return strings.TrimSpace(s[len(s)-1]), nil
}
