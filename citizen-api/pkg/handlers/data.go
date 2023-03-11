package handlers

import (
	"encoding/json"
	"net/http"
	"os"
)

func GetVices(w http.ResponseWriter, r *http.Request) {
	var data map[string][]string
	file, err := os.ReadFile("data.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	err = json.Unmarshal([]byte(string(file)), &data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	json.NewEncoder(w).Encode(data["vices"])
}

func GetCharacters(w http.ResponseWriter, r *http.Request) {
	var data map[string][]string
	file, err := os.ReadFile("data.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	err = json.Unmarshal([]byte(string(file)), &data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	json.NewEncoder(w).Encode(data["characters"])
}

func GetEmotions(w http.ResponseWriter, r *http.Request) {
	var data map[string][]string
	file, err := os.ReadFile("data.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	err = json.Unmarshal([]byte(string(file)), &data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	json.NewEncoder(w).Encode(data["emotions"])
}

func GetMoralitys(w http.ResponseWriter, r *http.Request) {
	var data map[string][]string
	file, err := os.ReadFile("data.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	err = json.Unmarshal([]byte(string(file)), &data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	json.NewEncoder(w).Encode(data["moralitys"])
}

func GetAttitudes(w http.ResponseWriter, r *http.Request) {
	var data map[string][]string
	file, err := os.ReadFile("data.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	err = json.Unmarshal([]byte(string(file)), &data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	json.NewEncoder(w).Encode(data["attitudes"])
}

func GetSkills(w http.ResponseWriter, r *http.Request) {
	var data map[string][]string
	file, err := os.ReadFile("data.json")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	err = json.Unmarshal([]byte(string(file)), &data)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"error": err})
		return
	}
	json.NewEncoder(w).Encode(data["skills"])
}
