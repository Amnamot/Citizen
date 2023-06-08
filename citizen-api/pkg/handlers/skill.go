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

func Skills(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		ts, err := template.ParseFiles("./templates/addSkills.html")
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		data := make(map[string]interface{})

		data["id"] = r.URL.Query().Get("id")

		err = ts.Execute(w, data)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		skill_1 := r.FormValue("skill_1")
		skill_2 := r.FormValue("skill_2")

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

		if skill_1 != "" {
			_, err = dbpool.Exec(context.Background(), `INSERT INTO skills (name, yes, no, ignore, user_id) VALUES ($1, 0, 0, 0, $2);`, skill_1, id)

			if err != nil {
				logrus.Println(err.Error())
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
				return
			}
		}

		if skill_2 != "" {
			_, err = dbpool.Exec(context.Background(), `INSERT INTO skills (name, yes, no, ignore, user_id) VALUES ($1, 0, 0, 0, $2);`, skill_2, id)

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