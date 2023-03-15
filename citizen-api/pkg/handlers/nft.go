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
	"math/big"
	"math/rand"
	"net/http"
	"os"
	"strconv"
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
	Photo    string  `json:"photo"`
	ID       int64   `json:"id"`
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

	url, err := utils.UploadImg(data.Photo)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	data.Metadata.Attributes[4]["value"] = url

	content, err := json.Marshal(data.Metadata)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	url, err = utils.UploadContent(content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	spliturl := strings.Split(url, "/")

	client := liteclient.NewConnectionPool()

	configUrl := os.Getenv("config_url")
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	api := ton.NewAPIClient(client)
	wall := utils.GetWallet(api, os.Getenv("SEED"))

	collectionAddr := address.MustParseAddr(os.Getenv("collection_address"))
	collection := nft.NewCollectionClient(api, collectionAddr)

	nftAddress, err := collection.GetNFTAddressByIndex(context.Background(), big.NewInt(data.ID))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	mintData, err := collection.BuildMintEditablePayload(big.NewInt(data.ID), address.MustParseAddr(data.Address), wall.Address(), tlb.MustFromTON("0.03"), &nft.ContentOffchain{
		URI: spliturl[len(spliturl)-1],
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
	var data NFTData
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
	url, err := utils.UploadContent(content)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	spliturl := strings.Split(url, "/")

	client := liteclient.NewConnectionPool()

	configUrl := os.Getenv("config_url")
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
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

	configUrl := os.Getenv("config_url")
	err := client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}

	api := ton.NewAPIClient(client)

	collectionAddr := address.MustParseAddr(os.Getenv("collection_address"))
	collection := nft.NewCollectionClient(api, collectionAddr)

	id, err := strconv.ParseInt(mux.Vars(r)["id"], 10, 64)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}

	nftAddr, err := collection.GetNFTAddressByIndex(context.Background(), big.NewInt(id))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}

	newData, err := nft.NewItemClient(api, nftAddr).GetNFTData(context.Background())
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid telegram id"})
		return
	}

	json.NewEncoder(w).Encode(newData.Content)
}
