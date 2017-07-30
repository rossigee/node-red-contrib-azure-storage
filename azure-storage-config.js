module.exports = function (RED) {
    function AzureStorageConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.storageid = n.storageid;
        this.key = n.key;
    }
    RED.nodes.registerType("azure-storage-config", AzureStorageConfigNode);
}
