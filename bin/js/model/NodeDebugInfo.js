/**
* 节点调试信息
* @author confiner
*/
var model;
(function (model) {
    class NodeDebugInfo {
        constructor() {
            this._slots = new Map();
        }
        getLog() {
            if (!this._logs)
                return "";
            let str = "";
            for (let i = 0; i < this._logs.length; ++i) {
                str += this._logs[i].toString() + "\n";
            }
            return str;
        }
        // 设置节点id
        setNodeId(nodeId) {
            this._nodeId = nodeId;
        }
        // 获取节点id
        getNodeId() {
            return this._nodeId;
        }
        // 获取插槽调试数据
        getData(slotName) {
            return this._slots.get(slotName);
        }
        // 获取节点名称
        getNodeName() {
            let graph = managers.GraphManager.getInstance().getCurrent();
            if (graph) {
                let node = graph.getNodeById(this._nodeId);
                return node.getName();
            }
            return "unknow";
        }
        serialize() {
            return null;
        }
        deserialize(obj) {
            let propValue = null;
            for (let propName in obj) {
                propValue = obj[propName];
                if (propName == "logs" && propValue.hasOwnProperty("length") && propValue["length"] > 0) {
                    this._logs = obj[propName];
                }
                else {
                    this._slots.set(propName.toString(), propValue);
                }
            }
        }
    }
    model.NodeDebugInfo = NodeDebugInfo;
})(model || (model = {}));
//# sourceMappingURL=NodeDebugInfo.js.map