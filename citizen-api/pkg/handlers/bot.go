package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"net/http"
	"os"
)

func SendMessage(w http.ResponseWriter, r *http.Request) {

	reqBody, _ := io.ReadAll(r.Body)

	resp, err := http.Post(fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", os.Getenv("bot_token")), "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "database connection error"})
		return
	}
	defer resp.Body.Close()
}

func IsUser(w http.ResponseWriter, r *http.Request) {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "database connection error"})
		return
	}
	defer dbpool.Close()

	var telegram_id int
	var ispassport bool

	err = dbpool.QueryRow(context.Background(), "SELECT telegram_id, ispassport FROM users WHERE username=$1", mux.Vars(r)["username"]).Scan(&telegram_id, &ispassport)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "database query error"})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"telegram_id": telegram_id, "ispassport": ispassport})
}
