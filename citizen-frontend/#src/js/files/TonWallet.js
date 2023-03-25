const TonWallet = {
    address: '',
    wallet: null,
    tonweb: '',
    __constr: function (address) {
        this.tonweb = new window.TonWeb();
        this.address = address;
        return this;
    },
    getBalance: async function () {
        try {
            return await this.tonweb.getBalance(this.address);
        } catch (e) {
            console.error(e);
            return 0;
        }
        
    },
    pay: async function (toAddress, count) {
        if (count > 0) {
            return;
        }
        return;
    },
};