package handlers

import (
	"citizen-api/pkg/utils"
	"context"
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/nft"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"github.com/xssnick/tonutils-go/tvm/cell"
	"math/rand"
	"net/http"
	"os"
	"strings"
)

type Content struct {
	Name        string                   `json:"name"`
	Description string                   `json:"description"`
	Image       string                   `json:"image"`
	ContentUrl  string                   `json:"content_url"`
	Attributes  []map[string]interface{} `json:"attributes"`
}

type NFTData struct {
	FirstName   string `json:"firstname"`
	LastName    string `json:"lastname"`
	Gender      string `json:"gender"`
	DateOfBirth string `json:"dateofbirth"`
	Address     string `json:"address"`
	Photo       string `json:"photo"`
}

type EditNFTData struct {
	Address  string  `json:"address"`
	Metadata Content `json:"content"`
}

func DeployNFTItem(w http.ResponseWriter, r *http.Request) {
	var data NFTData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	api := ton.NewAPIClient(client)
	wall := utils.GetWallet(api, os.Getenv("SEED"))

	collectionAddr := address.MustParseAddr("EQAsoo5Wgj1wNKh6_tu4MSJKFpvRqPVtykHXFUxHm0Ptdzym")
	collection := nft.NewCollectionClient(api, collectionAddr)

	collectionData, err := collection.GetCollectionData(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	nftAddress, err := collection.GetNFTAddressByIndex(context.Background(), collectionData.NextItemIndex)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	mintData, err := collection.BuildMintEditablePayload(collectionData.NextItemIndex, address.MustParseAddr(data.Address), wall.Address(), tlb.MustFromTON("0.03"), &nft.ContentOffchain{
		URI: "1uIsWJ_vtvBUZ5u2XcrVgqFmFaoPGDQwavdlgJjdGiI",
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	mint := wallet.SimpleMessage(collectionAddr, tlb.MustFromTON("0.03"), mintData)

	err = wall.Send(context.Background(), mint, true)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	json.NewEncoder(w).Encode(nftAddress.String())
}

func EditNFTItem(w http.ResponseWriter, r *http.Request) {
	var data EditNFTData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	content, err := json.Marshal(data.Metadata)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	url, err := utils.Upload(content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	spliturl := strings.Split(url, "/")

	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
	}

	api := ton.NewAPIClient(client)

	wall := utils.GetWallet(api, os.Getenv("SEED"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	
	body := cell.BeginCell().
		MustStoreUInt(0x1a0b9d51, 32).
		MustStoreUInt(rand.Uint64(), 64).
		MustStoreRef(
			cell.BeginCell().
				MustStoreStringSnake(spliturl[len(spliturl)-1]).
				EndCell(),
		).EndCell()

	err = wall.Send(context.Background(), &wallet.Message{
		Mode: 1,
		InternalMessage: &tlb.InternalMessage{
			Bounce:  true,
			DstAddr: address.MustParseAddr(data.Address),
			Amount:  tlb.MustFromTON("0.03"),
			Body:    body,
		},
	}, true)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

func GetNFTData(w http.ResponseWriter, r *http.Request) {
	client := liteclient.NewConnectionPool()

	configUrl := "https://ton-blockchain.github.io/testnet-global.config.json"
	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
	}

	api := ton.NewAPIClient(client)
	newData, err := nft.NewItemClient(api, address.MustParseAddr(mux.Vars(r)["address"])).GetNFTData(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
	}
	json.NewEncoder(w).Encode(newData.Content)
}
