/**
* @desc 数据管理器
* @author confiner
*/
var core;
(function (core) {
    class DataManager {
        constructor() {
            this._graphNodesDescriptor = []; // 流图节点描述对象
            this._seed = 0; // 节点自增id种子
            this._graphs = null; // 所有流图
            this._graphs = new Dictionary();
            this._slots = new Dictionary();
        }
        // 解析节点数据
        parseNodesDescriptor(descriptor) {
            this._nodesDescriptor = JSON.parse(descriptor);
        }
        // 获取所有节点
        getNodes() {
            let nodes = this._graphNodesDescriptor.concat(this._nodesDescriptor);
            return nodes;
        }
        // 通过name查询node数据
        getNode(name) {
            let nodes = this.getNodes();
            for (let i = 0; i < nodes.length; ++i) {
                if (nodes[i]["name"] == name && name != null)
                    return nodes[i];
            }
            return null;
        }
        // 判断对象是否有对应的属性
        hasProperty(src, propName) {
            return src.hasOwnProperty(propName);
        }
        // 获取对应对象的属性
        getProperty(src, propName) {
            return src[propName];
        }
        // 获取guid
        guid() {
            return ++this._seed;
        }
        // 重置guid
        resetGUID(seed) {
            this._seed = seed;
        }
        // 創建關係數據
        createRelation(data) {
            let relation = new Relation();
            if (data["type"] == core.SlotType.DataIn.toString() || data["type"] == core.SlotType.ExecutionIn.toString()) {
                relation.inputType = data["type"];
                relation.inputNodeId = data["id"];
                relation.inputName = data["name"];
                relation.inputDataType = data["dataType"];
            }
            else {
                relation.outputType = data["type"];
                relation.outputNodeId = data["id"];
                relation.outputName = data["name"];
                relation.outputDataType = data["dataType"];
            }
            return relation;
        }
        // 添加slot数据
        addSlotData(slotData) {
            let slots = this._slots.get(slotData["id"]);
            if (slots) {
                for (let i = 0; i < slots.length; ++i) {
                    if (slots[i]["name"] == slotData["name"])
                        return;
                }
                slots.push(slotData);
            }
            else {
                slots = new Array();
                slots.push(slotData);
                this._slots.set(slotData["id"], slots);
            }
        }
        // 获取对应节点的插槽
        getSlotData(nodeId, slotName) {
            let slots = this._slots.get(nodeId);
            if (slots) {
                for (let i = 0; i < slots.length; ++i) {
                    if (slots[i]["name"] == slotName)
                        return slots[i];
                }
            }
            return null;
        }
        // 删除插槽数据
        removeSlotData(nodeId) {
            this._slots.remove(nodeId);
        }
        // 檢測關係兩端是否滿足
        checkAndMegreRelation(left, right) {
            // 不能是同一個節點
            if (left.inputNodeId != null && left.inputNodeId == right.outputNodeId || left.outputNodeId != null && left.outputNodeId == right.inputNodeId)
                return null;
            if (left.inputType == core.SlotType.DataIn.toString() && right.outputType == core.SlotType.DataOut.toString()
                && (left.inputDataType != null && left.inputDataType == right.outputDataType || left.outputDataType != null && left.outputDataType == right.inputDataType)
                || left.inputType == core.SlotType.ExecutionIn.toString() && right.outputType == core.SlotType.ExecutionOut.toString()) {
                left.outputNodeId = right.outputNodeId;
                left.outputName = right.outputName;
                left.outputType = right.outputType;
                return left;
            }
            else if (left.outputType == core.SlotType.DataOut.toString() && right.inputType == core.SlotType.DataIn.toString()
                && (left.inputDataType != null && left.inputDataType == right.outputDataType || left.outputDataType != null && left.outputDataType == right.inputDataType)
                || left.outputType == core.SlotType.ExecutionOut.toString() && right.inputType == core.SlotType.ExecutionIn.toString()) {
                left.inputNodeId = right.inputNodeId;
                left.inputName = right.inputName;
                left.inputType = right.inputType;
                return left;
            }
            return null;
        }
        // 解析所有流图
        parseGrahps(jsonStr) {
            this._graphNodesDescriptor = [];
            let grahps = JSON.parse(jsonStr);
            for (let graph of grahps) {
                let graphObj = JSON.parse(graph);
                this._graphs.set(graphObj["name"], graphObj);
                let startNodeId = graphObj["children_flow_graph_call"]; // 子流图的首节点
                let endNodeId = graphObj["children_flow_graph_return"]; // 子流图的尾节点
                if (!startNodeId || !endNodeId)
                    continue;
                let startNode = null;
                let endNode = null;
                for (let nodeId in graphObj) {
                    let nodeObj = graphObj[nodeId];
                    let nodeName = nodeObj["name"];
                    if (nodeName && nodeName != "") {
                        if (!startNode && nodeId == startNodeId.toString()) {
                            startNode = this.getNode(nodeName);
                        }
                        else if (nodeId == endNodeId.toString()) {
                            endNode = this.getNode(nodeName);
                        }
                        if (startNode && endNode) {
                            let nodeObj = {};
                            //nodeObj["type"] = NodeType.CTRL;
                            nodeObj["next"] = endNode["next"];
                            nodeObj["input"] = startNode["input"];
                            nodeObj["output"] = endNode["output"];
                            nodeObj["name"] = graphObj["name"];
                            nodeObj["children_flow_graph_name"] = graphObj["name"];
                            nodeObj["category"] = "GraphNodes";
                            this._graphNodesDescriptor.push(nodeObj);
                            break;
                        }
                    }
                }
            }
        }
        // 获取流图名列表
        getAllGraphNames() {
            let names = new Array();
            for (let name of this._graphs.keys) {
                names.push(name);
            }
            return names;
        }
        // 获取流图
        getGraph(name) {
            return this._graphs.get(name);
        }
        // 获取单例接口
        static getInstance() {
            if (!DataManager._inst) {
                DataManager._inst = new DataManager();
            }
            return DataManager._inst;
        }
    }
    DataManager.drawing = false;
    core.DataManager = DataManager;
})(core || (core = {}));
//# sourceMappingURL=DataManager.js.map