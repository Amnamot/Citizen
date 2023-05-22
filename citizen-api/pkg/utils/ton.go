package utils

import (
	"github.com/sirupsen/logrus"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"strings"
)

func GetWallet(api *ton.APIClient, seed string) *wallet.Wallet {
	words := strings.Split(seed, " ")
	w, err := wallet.FromSeed(api, words, wallet.V3R2)
	if err != nil {
		logrus.Println(err.Error())
		panic(err)
	}
	return w
}
