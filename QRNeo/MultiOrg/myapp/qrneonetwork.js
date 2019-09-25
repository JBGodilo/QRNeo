var fabricClient = require('./Config/FabricClient');
//var FabricCAClient = require('./Config/FabricClient');
class qrneonetwork {
    constructor(userName) {
        this.currentUser;
        this.issuer;
        this.userName = userName;
        this.connection = fabricClient;
    }

    init() {
        var isAdmin = false;
        if (this.userName == "admin") {
            isAdmin = true;
        }
        return this.connection.initCredentialStores().then(() => {
            return this.connection.getUserContext(this.userName, true)
        }).then((user) => {
            this.issuer = user;
            if (isAdmin) {
                return user;
            }
            return this.ping();
        }).then((user) => {
            this.currentUser = user;
            return user;
        })
    }

    queryAllUser() {
        var tx_id = this.connection.newTransactionID();
        var requestData = {
            chaincodeId: 'qrneo',
            fcn: 'queryAllUser',
            args: [''],
            txId: tx_id
        };
        //var request = FabricModel.requestBuild(requestData);
        return this.connection.submitTransaction(requestData);
    }
}

module.exports = qrneonetwork;