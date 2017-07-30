module.exports = function (RED) {
    function AzureStorageListContainersNode(config) {
        RED.nodes.createNode(this, config);
        var azure = require('azure-storage');
        var azure_storage_config = RED.nodes.getNode(config.storage);
        var node = this;

        node.on('input', function (msg) {
            try {
                var token = null;

                var prefix = null;
                if(config.prefix !== undefined) {
                    prefix = config.prefix;
                }
                if(msg.prefix !== undefined) {
                    prefix = msg.prefix;
                }

                node.status({fill: "blue", shape: "dot", text: "Connecting to Azure..."});
                var all_entries = [];
                var page = 0;

                var service = azure_storage_config.getService(msg);
                var options = {};
                var _lock = true;
                var _processpage = function(error, entries, response) {
                    node.status({fill: "blue", shape: "dot", text: "Processing page " + page});
                    if (error) {
                        node.status({fill: "red", shape: "dot", text: error});
                        return node.error(error, msg);
                    }

                    for(var i = 0; i < entries.entries.length; i++) {
                        all_entries.push(entries.entries[i]);
                    }

                    if(!entries.continuationToken) {
                        msg.payload = all_entries;
                        node.status({});
                        return node.send(msg);
                    }
                    token = continuationToken;
                    fetch_page();
                };
                var fetch_page = function() {
                    page += 1;
                    node.status({fill: "blue", shape: "dot", text: "Fetching page " + page});
                    if(prefix) {
                      service.listContainersSegmentedWithPrefix(prefix, token, options, _processpage);
                    } else {
                      service.listContainersSegmented(token, options, _processpage);
                    }
                };
                fetch_page();
            } catch (err) {
              node.status({fill: "red", shape: "dot", text: err.message});
              node.error(err.message);
            }
        });
    }
    RED.nodes.registerType("azure-storage-listcontainers", AzureStorageListContainersNode);
};
