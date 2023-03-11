const ton = {
    address: 'EQDjVXa_oltdBP64Nc__p397xLCvGm2IcZ1ba7anSW0NAkeP',
    wallet: null,
    seqno: null,
    keyPair: null,
    init: async function () {
    const tonweb = new window.TonWeb();

    this.wallet = tonweb.wallet.create({
      address: this.address,
    }); // if your know only address at this moment
    secretKey = window.TonWeb.utils.hexToBytes('cdd624b8c960fc419d207689dd4c3bcadca7a0df53b664f97ac06454efe90c4b1dc1391e4affae5fa96b194b97de179926d791107846d80dacf700a9db1e8f7c');
        this.keyPair = {
            secretKey
        };
        
    const address = await this.wallet.getAddress();
        console.log('address=', address.toString(true, true, true, false));
        
        this.seqno = await this.wallet.methods.seqno().call()??0; // call get-method `seqno` of wallet smart contract
        console.log('seqno=', this.seqno);

        const Cell = window.TonWeb.boc.Cell;
        const cell = new Cell();
        cell.bits.writeUint(0, 32);
        cell.bits.writeAddress(await this.wallet.getAddress());
        cell.bits.writeGrams(1);
        console.log(cell.print()); 
        const bocBytes = await cell.toBoc();
        console.log(bocBytes); 

    },
    setTransfer: async function() {
        const transfer = this.wallet.methods.transfer(
            {
                secretKey: this.keyPair.secretKey,
                toAddress: this.address,
                amount: window.TonWeb.utils.toNano('0.01'), 
                seqno: this.seqno,
                payload: '{pop}',
                sendMode: 3,
            }
        );

        // const transferFee = await transfer.estimateFee();   // get estimate fee of transfer
        // console.log(transferFee);

        const transferSended = await transfer.send();  // send transfer query to blockchain
        console.log(transferSended);

        // const transferQuery = await transfer.getQuery(); // get transfer query Cell
        // console.log(transferQuery);
    }
};

ton.init();