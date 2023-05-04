package handlers

import (
	"citizen-api/pkg/utils"
	"context"
	"encoding/json"
	"html/template"
	"math/big"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/tlb"
	"github.com/xssnick/tonutils-go/ton"
	"github.com/xssnick/tonutils-go/ton/nft"
	"github.com/xssnick/tonutils-go/ton/wallet"
	"github.com/xssnick/tonutils-go/tvm/cell"
)

func Index(w http.ResponseWriter, r *http.Request){
	id, err := strconv.ParseInt(r.URL.Query().Get("id"), 10, 64)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}

	ts, err := template.ParseFiles("./templates/index.html")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}
	defer dbpool.Close()

	var metadata string
	var isedit bool

	err = dbpool.QueryRow(context.Background(), "SELECT isedit, content FROM users WHERE telegram_id=$1", id).Scan(&isedit, &metadata)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	client := liteclient.NewConnectionPool()

	configUrl := os.Getenv("config_url")
	err = client.AddConnectionsFromConfigUrl(context.Background(), configUrl)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}

	api := ton.NewAPIClient(client)

	collectionAddr := address.MustParseAddr(os.Getenv("collection_address"))
	collection := nft.NewCollectionClient(api, collectionAddr)

	nftAddr, err := collection.GetNFTAddressByIndex(context.Background(), big.NewInt(id))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}


	if (isedit) {
		content, err := json.Marshal(metadata)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		url, err := utils.UploadContent(content)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		spliturl := strings.Split(url, "/")

		wall := utils.GetWallet(api, os.Getenv("SEED"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
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
				DstAddr: nftAddr,
				Amount:  tlb.MustFromTON("0.03"),
				Body:    body,
			},
		}, true)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		_, err = dbpool.Exec(context.Background(), `UPDATE users SET isedit = FALSE WHERE telegram_id = '$1'`, id)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		
	}

	data := Content{}

	dec := json.NewDecoder(strings.NewReader(metadata))
	_ = dec.Decode(&data)
 
	err = ts.Execute(w, data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": err})
		return
	}
}


func FAQ(w http.ResponseWriter, r *http.Request){
	ts, err := template.ParseFiles("./templates/FAQ.html")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}
 
	err = ts.Execute(w, nil)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
		return
	}
}


func Vices(w http.ResponseWriter, r *http.Request){
	if (r.Method == "GET"){
		id, err := strconv.ParseInt(r.URL.Query().Get("id"), 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		ts, err := template.ParseFiles("./templates/addVices.html")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		var data map[string]interface{}

		file, err := os.ReadFile("data.json")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		err = json.Unmarshal([]byte(string(file)), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		data["id"] = id
	
		err = ts.Execute(w, data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		vice_1 := r.FormValue("vice_1")
		vice_2 := r.FormValue("vice_2")

		id := r.FormValue("id")

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var content string

		err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE telegram_id=$1", id).Scan(&content)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		data := Content{}

		err = json.Unmarshal([]byte(content), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		if (vice_1 != ""){
			if data.Vices[vice_1] == nil {
				data.Vices[vice_1] = []int{0, 0, 0}
			}
		} 


		if (vice_2 != ""){
			if data.Vices[vice_2] == nil {
				data.Vices[vice_2] = []int{0, 0, 0}
			}
		} 

		j, err := json.Marshal(data)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		_, err = dbpool.Exec(context.Background(), `UPDATE users SET content = $1 WHERE telegram_id = $2`, j, id)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		http.Redirect(w, r, "http://127.0.0.1:8000/citizen", http.StatusSeeOther)
		
		
	}
}



func SocialTies(w http.ResponseWriter, r *http.Request){
	if (r.Method == "GET"){
		ts, err := template.ParseFiles("./templates/addSocialTies.html")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		data := make(map[string][]string)

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var username []string

		err = dbpool.QueryRow(context.Background(), "SELECT username FROM users").Scan(&username)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		data["username"] = username
	
		err = ts.Execute(w, data)
		if err != nil {
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
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var content string

		err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE telegram_id=$1", id).Scan(&content)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		data := Content{}

		err = json.Unmarshal([]byte(content), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		if (username != "" && role != ""){
			if data.Ties[username] == nil {
				data.Ties[username] = map[string]string{"role": role}
			}
		} 

		j, err := json.Marshal(data)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		_, err = dbpool.Exec(context.Background(), `UPDATE users SET content = $1 WHERE telegram_id = $2`, j, id)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		http.Redirect(w, r, "http://127.0.0.1:8000/citizen", http.StatusSeeOther)
		
		
	}
}


func Skills(w http.ResponseWriter, r *http.Request){
	if (r.Method == "GET") {
		id, err := strconv.ParseInt(r.URL.Query().Get("id"), 10, 64)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		ts, err := template.ParseFiles("./templates/addSkills.html")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		data := make(map[string]interface{})

		data["id"] = id
	
		err = ts.Execute(w, data)
		if err != nil {
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
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var content string

		err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE telegram_id=$1", id).Scan(&content)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		data := Content{}

		err = json.Unmarshal([]byte(content), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		if (skill_1 != ""){
			if data.Skills[skill_1] == nil {
				data.Skills[skill_1] = []int{0, 0, 0}
			}
		} 


		if (skill_2 != ""){
			if data.Skills[skill_2] == nil {
				data.Skills[skill_2] = []int{0, 0, 0}
			}
		} 

		j, err := json.Marshal(data)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		_, err = dbpool.Exec(context.Background(), `UPDATE users SET content = $1 WHERE telegram_id = $2`, j, id)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		http.Redirect(w, r, "http://127.0.0.1:8000/citizen", http.StatusSeeOther)
		
		
	}
}

func Morality(w http.ResponseWriter, r *http.Request){
	if (r.Method == "GET"){
		ts, err := template.ParseFiles("./templates/addMorality.html")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		var data map[string][]string
		file, err := os.ReadFile("data.json")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		err = json.Unmarshal([]byte(string(file)), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	
		err = ts.Execute(w, data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		morality_1 := r.FormValue("morality_1")
		morality_2 := r.FormValue("morality_2")

		id := r.FormValue("id")

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var content string

		err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE telegram_id=$1", id).Scan(&content)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		data := Content{}

		err = json.Unmarshal([]byte(content), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		if (morality_1 != ""){
			if data.Moralities[morality_1] == nil {
				data.Moralities[morality_1] = []int{0, 0, 0}
			}
		} 


		if (morality_2 != ""){
			if data.Moralities[morality_2] == nil {
				data.Moralities[morality_2] = []int{0, 0, 0}
			}
		} 

		j, err := json.Marshal(data)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		_, err = dbpool.Exec(context.Background(), `UPDATE users SET content = $1 WHERE telegram_id = $2`, j, id)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		http.Redirect(w, r, "http://127.0.0.1:8000/citizen", http.StatusSeeOther)
		
		
	}
}


func Emotions(w http.ResponseWriter, r *http.Request){
	if (r.Method == "GET"){
		ts, err := template.ParseFiles("./templates/addEmotions.html")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		var data map[string][]string
		file, err := os.ReadFile("data.json")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		err = json.Unmarshal([]byte(string(file)), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	
		err = ts.Execute(w, data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		emotion_1 := r.FormValue("emotion_1")
		emotion_2 := r.FormValue("emotion_2")

		id := r.FormValue("id")

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var content string

		err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE telegram_id=$1", id).Scan(&content)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		data := Content{}

		err = json.Unmarshal([]byte(content), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		if (emotion_1 != ""){
			if data.Emotions[emotion_1] == nil {
				data.Emotions[emotion_1] = []int{0, 0, 0}
			}
		} 


		if (emotion_2 != ""){
			if data.Emotions[emotion_2] == nil {
				data.Emotions[emotion_2] = []int{0, 0, 0}
			}
		} 

		j, err := json.Marshal(data)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		_, err = dbpool.Exec(context.Background(), `UPDATE users SET content = $1 WHERE telegram_id = $2`, j, id)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		http.Redirect(w, r, "http://127.0.0.1:8000/citizen", http.StatusSeeOther)
		
		
	}
}

func Characters(w http.ResponseWriter, r *http.Request){
	if (r.Method == "GET"){
		ts, err := template.ParseFiles("./templates/addCharacters.html")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		var data map[string][]string
		file, err := os.ReadFile("data.json")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		err = json.Unmarshal([]byte(string(file)), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	
		err = ts.Execute(w, data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		character_1 := r.FormValue("character_1")
		character_2 := r.FormValue("character_2")

		id := r.FormValue("id")

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var content string

		err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE telegram_id=$1", id).Scan(&content)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		data := Content{}

		err = json.Unmarshal([]byte(content), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		if (character_1 != ""){
			if data.Characters[character_1] == nil {
				data.Characters[character_1] = []int{0, 0, 0}
			}
		} 


		if (character_2 != ""){
			if data.Characters[character_2] == nil {
				data.Characters[character_2] = []int{0, 0, 0}
			}
		} 

		j, err := json.Marshal(data)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		_, err = dbpool.Exec(context.Background(), `UPDATE users SET content = $1 WHERE telegram_id = $2`, j, id)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		http.Redirect(w, r, "http://127.0.0.1:8000/citizen", http.StatusSeeOther)
		
		
	}
}


func Attitude(w http.ResponseWriter, r *http.Request){
	if (r.Method == "GET"){
		ts, err := template.ParseFiles("./templates/addAttitude.html")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}

		var data map[string][]string
		file, err := os.ReadFile("data.json")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		err = json.Unmarshal([]byte(string(file)), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	
		err = ts.Execute(w, data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
	} else {

		attidude_1 := r.FormValue("attidude_1")
		attidude_2 := r.FormValue("attidude_2")

		id := r.FormValue("id")

		dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}
		defer dbpool.Close()

		var content string

		err = dbpool.QueryRow(context.Background(), "SELECT content FROM users WHERE telegram_id=$1", id).Scan(&content)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		data := Content{}

		err = json.Unmarshal([]byte(content), &data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		if (attidude_1 != ""){
			if data.Attitudes[attidude_1] == nil {
				data.Attitudes[attidude_1] = []int{0, 0, 0}
			}
		} 


		if (attidude_2 != ""){
			if data.Attitudes[attidude_2] == nil {
				data.Attitudes[attidude_2] = []int{0, 0, 0}
			}
		} 

		j, err := json.Marshal(data)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		_, err = dbpool.Exec(context.Background(), `UPDATE users SET content = $1 WHERE telegram_id = $2`, j, id)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]interface{}{"status": "error", "details": nil})
			return
		}


		http.Redirect(w, r, "http://127.0.0.1:8000/citizen", http.StatusSeeOther)
		
		
	}
}









