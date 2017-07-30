module.exports = function (RED) {
    function AzureStorageConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.storageid = n.storageid;
        this.key = n.key;

        this.getService = function(msg) {
            var storageid = this.storageid;
            if(msg.storageid !== undefined) {
                storageid = msg.storageid;
            }

            var key = this.key;
            if(msg.key !== undefined) {
                key = msg.key;
            }

            var azure = require('azure-storage');
            var service = new azure.BlobService(storageid, key);
            if(!service) {
              throw new Exception("Unable to connect to storage '" + storageid + "'");
            }
            return service;
        };
    }
    RED.nodes.registerType("azure-storage-config", AzureStorageConfigNode);
}
