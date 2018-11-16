/**
* @desc 服務管理器
* @author confiner
*/
var managers;
(function (managers) {
    class ServerManager {
        constructor() {
            this.init();
        }
        init() {
            this._server = new client("qweqweqwewqeqw");
            this._address = "ws://172.16.1.162:1788?t=test";
            Laya.timer.frameLoop(1, this, this.poll);
        }
        poll() {
            this._server.poll();
        }
        // 連接服務器
        connect(address) {
            if (address)
                this._address = address;
            ServerManager._inst._server.add_event_listen("client_node", this.onGetNodesDescriptor);
            ServerManager._inst._server.add_event_listen("client_node_debug_info", this.onGetNodesDebugInfo);
            ServerManager._inst._server.add_event_listen("client_graph", this.onGetGraphs);
            ServerManager._inst._server.add_event_listen("on_connect_server", this.onConnectSuccess);
            ServerManager._inst._server.connect_server(this._address);
        }
        sendGraph(jsonStr) {
            ServerManager._inst._server.call_hub("flowGraphData", "flowGraphInfo", jsonStr);
        }
        sendDebugInfo(info) {
            let jsonString = JSON.stringify(info);
            ServerManager._inst._server.call_hub("flowGraphData", "flowGraphDebugInfo", jsonString);
        }
        onConnectSuccess() {
            console.log("serverManager connect success!");
            managers.EventManager.getInstance().event(ServerManager.CONNECT_SUCCESS);
        }
        onGetGraphs(jsonStr) {
            managers.GraphManager.getInstance().loadGraphs(jsonStr);
        }
        onGetNodesDescriptor(jsonStr) {
            let config = JSON.parse(jsonStr);
            if (config["nodes"])
                managers.NodeManager.getInstance().parseNodesTemplate(config["nodes"]);
            if (config["vars"])
                managers.VariableManager.getInstance().parseVariables(config["vars"]);
        }
        onGetNodesDebugInfo(jsonStr) {
            managers.DebugManager.getInstance().parseGraphStackInfo(jsonStr);
        }
        // 获取单例接口
        static getInstance() {
            if (!ServerManager._inst) {
                ServerManager._inst = new ServerManager();
            }
            return ServerManager._inst;
        }
    }
    ServerManager.CONNECT_SUCCESS = "connect_success"; // 連接成功
    managers.ServerManager = ServerManager;
})(managers || (managers = {}));
//# sourceMappingURL=ServerManager.js.map