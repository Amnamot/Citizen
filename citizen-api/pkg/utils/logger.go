package utils

import (
	"github.com/lestrrat/go-file-rotatelogs"
	"github.com/rifflock/lfshook"
	"github.com/sirupsen/logrus"
	"os"
	"time"
)

const (
	folderPath = "/var/log/citizen/"
)

func InitLogger() {

	logrus.SetReportCaller(true)
	logrus.SetFormatter(&logrus.JSONFormatter{})

	err := os.MkdirAll(folderPath, os.ModePerm)
	if err != nil {
		return
	}

	writer, _ := rotatelogs.New(
		folderPath + "%Y%m%d.log", // rotation pattern
		rotatelogs.WithRotationTime(time.Duration(86400) * time.Second), // once a day
		rotatelogs.WithMaxAge(time.Duration(604800) * time.Second), // keep one week of log files
	)

	logrus.AddHook(lfshook.NewHook(lfshook.WriterMap{
		logrus.InfoLevel: writer,
		logrus.ErrorLevel: writer,
	}, &logrus.JSONFormatter{}))
}