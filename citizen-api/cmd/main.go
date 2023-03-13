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

	router.HandleFunc("/api/v1/data", handlers.GetData).Methods("GET")

	router.HandleFunc("/api/v1/deployNFT", handlers.DeployNFTItem).Methods("POST")
	router.HandleFunc("/api/v1/editNFT", handlers.EditNFTItem).Methods("POST")
    router.HandleFunc("/api/v1/getNFT/{address}", handlers.GetNFTData).Methods("GET")


	err = http.ListenAndServe(":8000", router)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("http://127.0.0.1:8000")

}
