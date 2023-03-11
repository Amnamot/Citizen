rm build/nft-collection.fif
rm build/nft-item.fif

func -o build/nft-item.fif -SPA func/utils/stdlib.func func/utils/params.func func/utils/op-codes.func func/nft-item.func
func -o build/nft-collection.fif -SPA func/utils/stdlib.func func/utils/params.func func/utils/op-codes.func func/nft-collection.func

fift -s build/print-hex.fif