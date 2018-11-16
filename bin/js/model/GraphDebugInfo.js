/**
* 流图调试信息
* @author confiner
*/
var model;
(function (model) {
    class GraphDebugInfo {
        constructor() {
            this._nodes = new Map();
            this._variables = new Map();
        }
        getLog() {
            let log = "";
            for (let node of this._nodes.values()) {
                if (node.getLog() == "")
                    continue;
                log += "[" + this._name + ":" + node.getNodeName() + "(" + node.getNodeId() + ")]->\n";
                log += node.getLog() + "\n\n";
                //log += this.addLineString() + "\n";
            }
            return log;
        }
        addLineString() {
            let str = "";
            for (let i = 0; i < 100; ++i) {
                str += "-";
            }
            return str;
        }
        getName() {
            return this._name;
        }
        // 获取当前断点击中的节点id
        getHitNodeId() {
            return this._curNodeId;
        }
        // 获取插槽数据
        getDatum(nodeId, slotName) {
            if (this._nodes.has(nodeId)) {
                let nodeInfo = this._nodes.get(nodeId);
                if (nodeInfo) {
                    let value = nodeInfo.getData(slotName);
                    if (value) {
                        let graph = managers.GraphManager.getInstance().getCurrent();
                        if (graph) {
                            let node = graph.getNodeById(nodeId);
                            if (node) {
                                let slot = node.getSlotByName(slotName);
                                if (slot) {
                                    let data = slot.getData();
                                    let datum = data.clone();
                                    datum.setValue(value);
                                    return datum;
                                }
                            }
                        }
                    }
                }
            }
            return null;
        }
        deserialize(obj) {
            let propValue = null;
            for (let propName in obj) {
                propValue = obj[propName];
                if (propName == "Graph") {
                    this._name = String(propValue);
                }
                else if (propName == "currNode") {
                    this._curNodeId = String(propValue);
                }
                else if (propName == "vars" && propValue.hasOwnProperty("length")) {
                    this._variables.set(propName.toString(), propValue);
                }
                else if (propName == "nodes") {
                    let info = null;
                    for (let nodeId in propValue) {
                        info = propValue[nodeId];
                        let nodeDebugInfo = new model.NodeDebugInfo();
                        nodeDebugInfo.setNodeId(nodeId);
                        nodeDebugInfo.deserialize(info);
                        this._nodes.set(nodeId.toString(), nodeDebugInfo);
                    }
                }
            }
        }
        serialize() {
            return null;
        }
    }
    model.GraphDebugInfo = GraphDebugInfo;
})(model || (model = {}));
//# sourceMappingURL=GraphDebugInfo.js.map