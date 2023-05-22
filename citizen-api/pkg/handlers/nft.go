package handlers

import (
	"citizen-api/pkg/utils"
	"context"
	"encoding/json"
	"github.com/sirupsen/logrus"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/nft"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"math/big"
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
	Vices map[string]interface{} `json:"vices"`
	Characters map[string]interface{} `json:"characters"`
	Moralities map[string]interface{} `json:"moralities"`
	Skills map[string]interface{} `json:"skills"`
	Emotions map[string]interface{} `json:"emotions"`
	Attitudes map[string]interface{} `json:"attitudes"`
	Ties map[string]interface{} `json:"ties"`
}

type NFTData struct {
	Photo    string  `json:"photo"`
	ID       int64   `json:"id"`
	Address  string  `json:"address"`
	Metadata Content `json:"content"`
	Key string `json:"key"`
}



func DeployNFTItem(w http.ResponseWriter, r *http.Request) {
	var data NFTData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	key := os.Getenv("KEY")

	if key != data.Key {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "bad request", "detail": map[string]string{"key": key, "data_key": data.Key}})
		return
	}

	url, err := utils.UploadImg(data.Photo)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "failed upload bundlr"})
		return
	}

	data.Metadata.Attributes[4]["value"] = url

	content, err := json.Marshal(data.Metadata)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	url, err = utils.UploadContent(content)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "failed upload bundlr"})
		return
	}

	spliturl := strings.Split(url, "/")

	client := liteclient.NewConnectionPool()

	configUrl := os.Getenv("config_url")
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "Error connections from config url"})
		return
	}

	api := ton.NewAPIClient(client)
	wall := utils.GetWallet(api, os.Getenv("SEED"))

	collectionAddr := address.MustParseAddr(os.Getenv("collection_address"))
	collection := nft.NewCollectionClient(api, collectionAddr)

	nftAddress, err := collection.GetNFTAddressByIndex(context.Background(), big.NewInt(data.ID))
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "failed to get nft data by index"})
		return
	}

	mintData, err := collection.BuildMintEditablePayload(big.NewInt(data.ID), address.MustParseAddr(data.Address), wall.Address(), tlb.MustFromTON("0.02"), &nft.ContentOffchain{
		URI: spliturl[len(spliturl)-1],
	})
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}

	mint := wallet.SimpleMessage(collectionAddr, tlb.MustFromTON("0.02"), mintData)

	err = wall.Send(context.Background(), mint, true)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": "failed to send msg"})
		return
	}


	newData, err := nft.NewItemClient(api, nftAddress).GetNFTData(context.Background())
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal error"})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"nft_address": nftAddress.String(), "content": newData.Content, "owner": newData.OwnerAddress.String()})
}