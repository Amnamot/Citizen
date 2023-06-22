package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"time"

	initdata "github.com/Telegram-Web-Apps/init-data-golang"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sirupsen/logrus"
	// tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func Emotions(w http.ResponseWriter, r *http.Request) {
	
	emotion_1 := r.FormValue("emotion_1")
	emotion_2 := r.FormValue("emotion_2")

	initDataVar := r.FormValue("initData")

	err := initdata.Validate(initDataVar, os.Getenv("BOT"), time.Hour)


	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	data, err := initdata.Parse(initDataVar)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}
	defer dbpool.Close()

	// bot, err := tgbotapi.NewBotAPI(os.Getenv("BOT"))
	// if err != nil {
	// 	logrus.Println(err.Error())
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
	// 	return
	// }

	
	if emotion_1 != "" {
		_, err = dbpool.Exec(context.Background(), `INSERT INTO emotions (name, yes, no, ignore, user_id) VALUES ($1, 0, 0, 0, $2);`, emotion_1, data.User.ID)

		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	}

	if emotion_2 != "" {
		_, err = dbpool.Exec(context.Background(), `INSERT INTO emotions (name, yes, no, ignore, user_id) VALUES ($1, 0, 0, 0, $2);`, emotion_2, data.User.ID)

		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	}

	http.Redirect(w, r, fmt.Sprintf("%s?id=%d", base_url, data.User.ID), http.StatusSeeOther)


}