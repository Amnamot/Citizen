package handlers

import (
	"context"
	"encoding/json"
	"html/template"
	"math/big"
	"net/http"
	"os"
	"strconv"

	"time"
	"github.com/sirupsen/logrus"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/nft"

	initdata "github.com/Telegram-Web-Apps/init-data-golang"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	base_url = "https://citizen.cool"
)

// var questionKeyboard = tgbotapi.NewInlineKeyboardMarkup(
//     tgbotapi.NewInlineKeyboardRow(
//         tgbotapi.NewInlineKeyboardButtonData("Yes", "Yes"),
//         tgbotapi.NewInlineKeyboardButtonData("No", "No"),
//         tgbotapi.NewInlineKeyboardButtonData("Ignore", "Ignore"),
//     ),
// )

func Index(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.URL.Query().Get("id"), 10, 64)

	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	ts, err := template.ParseFiles("./templates/index.html")
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}
	defer dbpool.Close()

	var metadata string
	var points int

	err = dbpool.QueryRow(context.Background(), "SELECT action_points, content FROM users WHERE id=$1", id).Scan(&points, &metadata)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	var data map[string]interface{}

	json.Unmarshal([]byte(metadata), &data)


	rows, err := dbpool.Query(context.Background(), "SELECT name, yes, no, ignore FROM vices WHERE user_id=$1", id)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	vices := make(map[string]interface{})

	for rows.Next() {
		var vice string
		var yes int
		var no int
		var ignore int
		err := rows.Scan(&vice, &yes, &no, &ignore)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}
	    vices[vice] = []int{yes, no, ignore}
	}

	data["vices"] = vices

	rows, err = dbpool.Query(context.Background(), "SELECT name, yes, no, ignore FROM emotions WHERE user_id=$1", id)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	emotions := make(map[string]interface{})

	for rows.Next() {
		var emotion string
		var yes int
		var no int
		var ignore int
		err := rows.Scan(&emotion, &yes, &no, &ignore)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}
	    emotions[emotion] = []int{yes, no, ignore}
	}

	data["emotions"] = emotions


	rows, err = dbpool.Query(context.Background(), "SELECT name, yes, no, ignore FROM skills WHERE user_id=$1", id)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	skills := make(map[string]interface{})

	for rows.Next() {
		var skill string
		var yes int
		var no int
		var ignore int
		err := rows.Scan(&skill, &yes, &no, &ignore)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}
	    skills[skill] = []int{yes, no, ignore}
	}

	data["skills"] = skills


	rows, err = dbpool.Query(context.Background(), "SELECT name, yes, no, ignore FROM attitudes WHERE user_id=$1", id)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	attitudes := make(map[string]interface{})

	for rows.Next() {
		var attitude string
		var yes int
		var no int
		var ignore int
		err := rows.Scan(&attitude, &yes, &no, &ignore)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}
	    attitudes[attitude] = []int{yes, no, ignore}
	}

	data["attitudes"] = attitudes


	rows, err = dbpool.Query(context.Background(), "SELECT name, yes, no, ignore FROM characters WHERE user_id=$1", id)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	characters := make(map[string]interface{})

	for rows.Next() {
		var character string
		var yes int
		var no int
		var ignore int
		err := rows.Scan(&character, &yes, &no, &ignore)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}
	    characters[character] = []int{yes, no, ignore}
	}

	data["characters"] = characters


	rows, err = dbpool.Query(context.Background(), "SELECT name, yes, no, ignore FROM moralities WHERE user_id=$1", id)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	moralities := make(map[string]interface{})

	for rows.Next() {
		var morality string
		var yes int
		var no int
		var ignore int
		err := rows.Scan(&morality, &yes, &no, &ignore)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}
	    moralities[morality] = []int{yes, no, ignore}
	}

	data["moralities"] = moralities


	rows, err = dbpool.Query(context.Background(), "SELECT social_username, role FROM socials WHERE user_id=$1", id)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	socials := make(map[string]interface{})

	for rows.Next() {
		var username string
		var role string
		err := rows.Scan(&username, &role)
		if err != nil {
			logrus.Println(err.Error())
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
			return
		}
	    socials[username] = role
	}

	data["ties"] = socials


	file, err := os.ReadFile("data.json")
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	var c map[string]interface{}

	err = json.Unmarshal([]byte(string(file)), &c)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	client := liteclient.NewConnectionPool()

	err = client.AddConnectionsFromConfigUrl(context.Background(), "https://ton-blockchain.github.io/testnet-global.config.json")
	if err != nil {
		panic(err)
	}

	api := ton.NewAPIClient(client)

	collectionAddr := address.MustParseAddr(os.Getenv("collection_address"))
	collection := nft.NewCollectionClient(api, collectionAddr)


	if err != nil {
		panic(err)
	}

	nftAddr, err := collection.GetNFTAddressByIndex(context.Background(), big.NewInt(id))
	if err != nil {
		panic(err)
	}

	data["nft_address"] = nftAddr.String()

	data["display_address"] = nftAddr.String()[:4] + "..." + nftAddr.String()[len(nftAddr.String())-4:]

	data["points"] = points

	data["role"] = c["role"]

	data["addVices"] = c["vices"]

	data["addMoralities"] = c["moralities"]

	data["addEmotions"] = c["emotions"]

	data["addCharacters"] = c["characters"]

	data["addAttitudes"] = c["attitudes"]

	var usernames []string

	rows, err = dbpool.Query(context.Background(), "SELECT username FROM users WHERE ispassport=TRUE")
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


	err = ts.Execute(w, data)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}
}

func FAQ(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("./templates/FAQ.html")
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}
}

func Validate(w http.ResponseWriter, r *http.Request) {
	err := initdata.Validate(r.URL.Query().Get("initData"), os.Getenv("BOT"), time.Hour)

	w.WriteHeader(http.StatusOK)

	if err != nil {
		logrus.Println(err.Error())
		json.NewEncoder(w).Encode(map[string]interface{}{"result": false})
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{"result": true})
	}
}

func Warning(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("./templates/warning.html")
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	err = ts.Execute(w, nil)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}
}

func CheckTies(w http.ResponseWriter, r *http.Request){

}


func GetProfile(w http.ResponseWriter, r *http.Request) {

	username := r.URL.Query().Get("username")

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}
	defer dbpool.Close()

	var metadata string

	err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE username=$1", username).Scan(&metadata)
	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	var data map[string]interface{}


	json.Unmarshal([]byte(metadata), &data)


	json.NewEncoder(w).Encode(map[string]interface{}{"result": data})


}

func GetUserPic(w http.ResponseWriter, r *http.Request) {
	_, err := strconv.ParseInt(r.URL.Query().Get("id"), 10, 64)

	if err != nil {
		logrus.Println(err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{"result": "AgACAgIAAxkDAAIQT2SVfImQBxn4kT2YH5HCcAsJki0XAAKspzEbmfZHOj8hiIEHb1YFAQADAgADYQADLwQ"})
}