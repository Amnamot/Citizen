from Crypto.Cipher import AES


def encryptAES(key: bytes, plaintext: bytes):
    blockSize = AES.block_size
    paddedPlaintext = plaintext + bytes([blockSize - len(plaintext) % blockSize]) * (blockSize - len(plaintext) % blockSize)
    iv = bytes([0] * blockSize)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ciphertext = cipher.encrypt(paddedPlaintext)
    return ciphertext.hex()

def decryptAES(key: bytes, ciphertext: bytes):
    blockSize = AES.block_size
    iv = bytes([0] * blockSize)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = cipher.decrypt(ciphertext)
    padding = decrypted[-1]
    unpaddedPlaintext = decrypted[:-padding]
    return unpaddedPlaintext