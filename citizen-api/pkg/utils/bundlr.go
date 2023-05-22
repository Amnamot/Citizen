package utils

import (
	"github.com/sirupsen/logrus"
	"os"
	"os/exec"
	"strings"
)

func savecontent(content []byte) error {
	f, err := os.Create("content.json")

	if err != nil {
		logrus.Println(err.Error())
		return err
	}

	defer f.Close()

	_, err = f.Write(content)

	if err != nil {
		logrus.Println(err.Error())
		return err
	}
	return nil
}

// Upload file to arweave

func UploadContent(content []byte) (string, error) {
	err := savecontent(content)
	if err != nil {
		logrus.Println(err.Error())
		return "", err
	}
	out, err := exec.Command("bundlr", "upload", "content.json", "-h", "https://node1.bundlr.network", "-w", "wallet.json", "-c", "arweave").Output()
	if err != nil {
		logrus.Println(err.Error())
		return "", err
	}
	s := strings.Split(string(out), " ")
	return strings.TrimSpace(s[len(s)-1]), nil
}


func saveimg(img string) error {
	f, err := os.Create("img.txt")

	if err != nil {
		logrus.Println(err.Error())
		return err
	}

	defer f.Close()

	_, err = f.WriteString(img)

	if err != nil {
		logrus.Println(err.Error())
		return err
	}
	return nil
}


func UploadImg(img string) (string, error) {
	err := saveimg(img)
	if err != nil {
		logrus.Println(err.Error())
		return "", err
	}
	out, err := exec.Command("bundlr", "upload", "img.txt", "-h", "https://node1.bundlr.network", "-w", "wallet.json", "-c", "arweave").Output()
	if err != nil {
		logrus.Println(err.Error())
		return "", err
	}
	s := strings.Split(string(out), " ")
	return strings.TrimSpace(s[len(s)-1]), nil
}



