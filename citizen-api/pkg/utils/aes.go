package utils

import (
	"crypto/aes"
	"encoding/hex"
	"os"
)

func DecryptAES(ct string) (string, error){
	key := os.Getenv("AESKEY")
    ciphertext, _ := hex.DecodeString(ct)
 
    c, err := aes.NewCipher([]byte(key))
    if err != nil {
		return "", err
	}
 
    pt := make([]byte, len(ciphertext))
    c.Decrypt(pt, ciphertext)
 
    s := string(pt[:])
    return s, nil
}