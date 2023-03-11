package handlers

import (
	"citizen-api/pkg/utils"
	"context"
	"encoding/json"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"net/http"
	"os"
)

type Transfer struct {
	Seed    string `json:"seed"`
	Address string `json:"address"`
	Ton     string `json:"ton"`
}

func SendTon(w http.ResponseWriter, r *http.Request) {
	var body Transfer
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Bad request"})
		return
	}
	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}

	api := ton.NewAPIClient(client)
	addr := address.MustParseAddr(body.Address)
	wall := utils.GetWallet(api, os.Getenv("SEED"))
	err = wall.Transfer(context.Background(), addr, tlb.MustFromTON("0.003"), "Citizen")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}
}

func GetBalance(w http.ResponseWriter, r *http.Request) {
	var body Transfer
	err := json.NewDecoder(r.Body).Decode(&body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Bad request"})
		return
	}
	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}

	api := ton.NewAPIClient(client)
	addr := address.MustParseAddr(body.Address)
	wall := utils.GetWallet(api, os.Getenv("SEED"))
	err = wall.Transfer(context.Background(), addr, tlb.MustFromTON("0.003"), "Citizen")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}
}
