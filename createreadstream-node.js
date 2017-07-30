module.exports = function (RED) {
    function AzureStorageCreateReadStreamNode(config) {
        RED.nodes.createNode(this, config);
        var azure = require('azure-storage');
        var azure_storage_config = RED.nodes.getNode(config.storage);
        var node = this;

        node.on('input', function (msg) {
            try {
                var token = null;

                var container = config.container;
                if(msg.container !== undefined) {
                    container = msg.container;
                }

                var blob = null;
                if(config.blob !== undefined) {
                    blob = config.blob;
                }
                if(msg.blob !== undefined) {
                    blob = msg.blob;
                }

                node.status({fill: "blue", shape: "dot", text: "Connecting to Azure..."});
                var bytes_transferred = 0;

                var service = azure_storage_config.getService(msg);
                var options = {};
                node.status({fill: "blue", shape: "dot", text: "Fetching readstream for blob..."});
                msg.payload = service.createReadStream(container, blob, options, function(error, result, response) {
                    if (error) {
                        node.status({fill: "red", shape: "dot", text: error});
                        return node.error(error, msg);
                    }
                });

                node.status({});
                return node.send(msg);
            }
            catch (err) {
                node.status({fill: "red", shape: "dot", text: err.message});
                node.error(err.message);
            }
        });
    }
    RED.nodes.registerType("azure-storage-createreadstream", AzureStorageCreateReadStreamNode);
};
