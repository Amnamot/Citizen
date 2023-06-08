package handlers

import (
	"context"
	"encoding/json"
	"html/template"
	"net/http"
	"os"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/sirupsen/logrus"
)

func SocialTies(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		ts, err := template.ParseFiles("./templates/addSocialTies.html")
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

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var usernames []string

		rows, err := dbpool.Query(context.Background(), "SELECT username FROM users")
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		for rows.Next() {
			var username string
			if err := rows.Scan(&username); err != nil {
				logrus.Println(err.Error())
			}
			usernames = append(usernames, username)
		}


		data["usernames"] = usernames

		data["id"] = r.URL.Query().Get("id")

		err = ts.Execute(w, data)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		username := r.FormValue("username")
		role := r.FormValue("role")

		id := r.FormValue("id")

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var tg_id int64

		err = dbpool.QueryRow(context.Background(), "SELECT id FROM users WHERE username=$1", username).Scan(&tg_id)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}

		var base_username string

		err = dbpool.QueryRow(context.Background(), "SELECT username FROM users WHERE id=$1", id).Scan(&base_username)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}


		if username != "" && role != ""{
			_, err = dbpool.Exec(context.Background(), `INSERT INTO socials (social_username, social_id, role, verified, user_id) VALUES ($1, $2, $3, $4, $5);`, username, tg_id, role, false, id)

			if err != nil {
				logrus.Println(err.Error())
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
				return
			}


			_, err = dbpool.Exec(context.Background(), `INSERT INTO socials (social_username, social_id, role, verified, user_id) VALUES ($1, $2, $3, $4, $5);`, base_username, id, "", false, tg_id)

			if err != nil {
				logrus.Println(err.Error())
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
				return
			}
		}

		bot, err := tgbotapi.NewBotAPI("6065372321:AAHjNaFZDVJZKIxRFDijIjW26GFLjTVqLvw")
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		msg := tgbotapi.NewMessage(tg_id, "The user with the username " +  base_username + " has added you to the social connection as a " + role)

		bot.Send(msg)

		http.Redirect(w, r, base_url + "?id=" + id, http.StatusSeeOther)

	}
}