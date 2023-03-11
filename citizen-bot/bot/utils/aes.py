from Crypto.Cipher import AES
import binascii

def encrypt_aes(key: str, plaintext: str) -> str:
    cipher = AES.new(key.encode(), AES.MODE_ECB)
    ciphertext = cipher.encrypt(plaintext.encode())
    return binascii.hexlify(ciphertext).decode()