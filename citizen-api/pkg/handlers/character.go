package handlers

import (
	"context"
	"encoding/json"
	"html/template"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sirupsen/logrus"
	// tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
)

func Characters(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		ts, err := template.ParseFiles("./templates/addCharacters.html")
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		var data map[string]interface{}
		file, err := os.ReadFile("data.json")
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		err = json.Unmarshal([]byte(string(file)), &data)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		data["id"] = r.URL.Query().Get("id")

		err = ts.Execute(w, data)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		character_1 := r.FormValue("character_1")
		character_2 := r.FormValue("character_2")

		id := r.FormValue("id")

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

		if character_1 != "" {
			_, err = dbpool.Exec(context.Background(), `INSERT INTO characters (name, yes, no, ignore, user_id) VALUES ($1, $2, $3, $4, $5);`, character_1, 0, 0, 0, id)

			if err != nil {
				logrus.Println(err.Error())
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
				return
			}
		}

		if character_2 != "" {
			_, err = dbpool.Exec(context.Background(), `INSERT INTO characters (name, yes, no, ignore, user_id) VALUES ($1, $2, $3, $4, $5);`, character_2, 0, 0, 0, id)

			if err != nil {
				logrus.Println(err.Error())
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
				return
			}
		}

		http.Redirect(w, r, base_url + "?id=" + id, http.StatusSeeOther)

	}
}