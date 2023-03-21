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
        
        return await this.tonweb.getBalance(this.address);
    }
};