package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
	"bytes"
)

func EncryptAES(key []byte, plaintext string) string {
	block, err := aes.NewCipher(key)
	CheckError(err)

	blockSize := block.BlockSize()
	paddedPlaintext := []byte(plaintext)
	padding := blockSize - len(paddedPlaintext)%blockSize
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	paddedPlaintext = append(paddedPlaintext, padText...)

	ciphertext := make([]byte, len(paddedPlaintext))
	iv := make([]byte, aes.BlockSize)
	mode := cipher.NewCBCEncrypter(block, iv)
	mode.CryptBlocks(ciphertext, paddedPlaintext)

	return hex.EncodeToString(ciphertext)
}

func DecryptAES(key []byte, ct string) string {
	block, err := aes.NewCipher(key)
	CheckError(err)

	ciphertext, err := hex.DecodeString(ct)
	CheckError(err)

	decrypted := make([]byte, len(ciphertext))
	iv := make([]byte, aes.BlockSize)
	mode := cipher.NewCBCDecrypter(block, iv)
	mode.CryptBlocks(decrypted, ciphertext)

	padding := int(decrypted[len(decrypted)-1])
	unpaddedPlaintext := decrypted[:len(decrypted)-padding]

	return string(unpaddedPlaintext)
}

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}