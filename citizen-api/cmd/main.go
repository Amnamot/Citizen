package main

import (
	"citizen-api/pkg/handlers"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}


	router := mux.NewRouter()

	router.HandleFunc("/api/v1/deployNFT", handlers.DeployNFTItem).Methods("POST")

	router.HandleFunc("/", handlers.Index).Methods("GET")

	router.HandleFunc("/addvice", handlers.Vices).Methods("GET", "POST")

	router.HandleFunc("/addsocialtie", handlers.SocialTies).Methods("GET", "POST")

	router.HandleFunc("/addskill", handlers.Skills).Methods("GET", "POST")

	router.HandleFunc("/addmorality", handlers.Morality).Methods("GET", "POST")

	router.HandleFunc("/addemotion", handlers.Emotions).Methods("GET", "POST")

	router.HandleFunc("/addcharacter", handlers.Characters).Methods("GET", "POST")

	router.HandleFunc("/addattitude", handlers.Attitude).Methods("GET", "POST")

	router.HandleFunc("/faq", handlers.FAQ).Methods("GET")

	router.HandleFunc("/warning", handlers.Warning).Methods("GET")

	router.HandleFunc("/validate", handlers.Validate).Methods("GET")
	

	router.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	err = http.ListenAndServe(":8000", router)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("http://127.0.0.1:8000")

}
