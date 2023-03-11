package main

import (
	"citizen-api/pkg/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"log"
	"net/http"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	router := mux.NewRouter()

	router.HandleFunc("/api/v1/vices", handlers.GetVices).Methods("GET")
	router.HandleFunc("/api/v1/characters", handlers.GetCharacters).Methods("GET")
	router.HandleFunc("/api/v1/emotions", handlers.GetEmotions).Methods("GET")
	router.HandleFunc("/api/v1/moralitys", handlers.GetMoralitys).Methods("GET")
	router.HandleFunc("/api/v1/attitudes", handlers.GetAttitudes).Methods("GET")
	router.HandleFunc("/api/v1/skills", handlers.GetAttitudes).Methods("GET")

	router.HandleFunc("/api/v1/deployNFT", handlers.DeployNFTItem).Methods("POST")
	router.HandleFunc("/api/v1/editNFT", handlers.EditNFTItem).Methods("POST")
    router.HandleFunc("/api/v1/getNFT/{address}", handlers.GetNFTData).Methods("GET")

	router.HandleFunc("/api/v1/transferTon", handlers.SendTon).Methods("POST")
    router.HandleFunc("/api/v1/getBalance/{address}", handlers.GetBalance).Methods("GET")

	err = http.ListenAndServe(":8000", router)

	if err != nil {
		log.Fatal(err)
	}

}
