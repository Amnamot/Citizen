package handlers

import (
	"bytes"
	"citizen-api/pkg/utils"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
)

type Transfer struct {
	From   string `json:"from"`
	To     string `json:"to"`
	Amount string `json:"amount"`
}

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

func TransferTon(w http.ResponseWriter, r *http.Request) {
	var data Transfer
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "database connection error"})
		return
	}
	defer dbpool.Close()

	var seed string

	key := []byte(os.Getenv("AESKEY"))

	err = dbpool.QueryRow(context.Background(), "SELECT seed FROM users WHERE telegram_id=$1", strings.TrimSpace(utils.DecryptAES(key ,data.From))).Scan(&seed)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "database query error"})
		return
	}

	client := liteclient.NewConnectionPool()

	configUrl := os.Getenv("config_url")
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	api := ton.NewAPIClient(client)

	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	wall, err := wallet.FromSeed(api, strings.Split(seed, " "), wallet.V3R2)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	balance, err := wall.GetBalance(context.Background(), block)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	if balance.NanoTON().Uint64() >= tlb.MustFromTON(data.Amount).NanoTON().Uint64() {
		addr := address.MustParseAddr(data.To)
		err = wall.Transfer(context.Background(), addr, tlb.MustFromTON(data.Amount), "")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
			return
		}
	} else {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Low balance"})
		return
	}
	json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
}

func GetBalance(w http.ResponseWriter, r *http.Request) {
	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "database connection error"})
		return
	}
	defer dbpool.Close()

	var seed string

	err = dbpool.QueryRow(context.Background(), "SELECT seed FROM users WHERE telegram_id=$1", mux.Vars(r)["id"]).Scan(&seed)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "database query error"})
		return
	}

	client := liteclient.NewConnectionPool()

	configUrl := os.Getenv("config_url")
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	api := ton.NewAPIClient(client)

	block, err := api.CurrentMasterchainInfo(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	wall, err := wallet.FromSeed(api, strings.Split(seed, " "), wallet.V3R2)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	balance, err := wall.GetBalance(context.Background(), block)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	json.NewEncoder(w).Encode(balance)
}
