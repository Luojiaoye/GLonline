/**
* 流图类
* @author confiner
*/
var model;
(function (model) {
    //import SlotType = core.SlotType;
    //import EventType = core.EventType;
    //import EventManager = managers.EventManager;
    class Graph extends model.Model {
        constructor() {
            super();
            this.isChildGraph = false; // 是否为子流图
            this._varGuid = 0; // 变量命名需要
            this._customGuid = 0; // 自定义节点id
            this.nodes = new Map();
            this.associations = new Array();
            //this.on(Model.UPDATE, this, this.updateInvalidStatus);
        }
        // 检测提交
        checkCommit() {
            let ret = null;
            if (this.isChildGraph) {
                let graphs = managers.GraphManager.getInstance().getGraphs();
                for (let graph of graphs) {
                    if (!graph.subGraphTemplateBaks)
                        continue;
                    let nodeBak = graph.subGraphTemplateBaks.get(this.name);
                    let curNode = this.getSubGraphMegerNode();
                    if (nodeBak && curNode && !curNode.same(nodeBak)) {
                        if (graph.subGraphTemplateBaks && graph.subGraphTemplateBaks.has(this.name)) {
                            if (!ret)
                                ret = new Array();
                            ret.push(graph.name);
                        }
                    }
                }
            }
            return ret;
        }
        getSubGraphMegerNode() {
            if (this.isChildGraph && this.childNodeReturn && this.childNodeCall) {
                let childGraphNodeConfig = {};
                childGraphNodeConfig["name"] = this.name;
                childGraphNodeConfig["type"] = core.NodeType.Graph.toString();
                let nodeTemplate = null;
                if (!this.nodes.has(this.childNodeCall)) {
                    console.error("error: children_flow_graph_call id :" + this.childNodeCall + " not exist in the graph:" + this.name);
                }
                else {
                    let startNode = this.nodes.get(this.childNodeCall);
                    if (startNode.type == core.NodeType.Variable || startNode.type == core.NodeType.Custom) {
                        startNode.writeBefore(childGraphNodeConfig);
                        startNode.writeInputs(childGraphNodeConfig);
                    }
                    else {
                        nodeTemplate = managers.NodeManager.getInstance().getNodeTemplate(startNode.getName());
                        if (!nodeTemplate) {
                            console.error("error: the node template:" + startNode.getName() + " is not exist!");
                        }
                        else {
                            childGraphNodeConfig["input"] = nodeTemplate.input;
                            if (nodeTemplate.before)
                                childGraphNodeConfig["before"] = nodeTemplate.before;
                        }
                    }
                    if (!this.nodes.has(this.childNodeReturn)) {
                        console.error("error: children_flow_graph_return id :" + this.childNodeReturn + " not exist in the graph:" + this.name);
                    }
                    let endNode = this.nodes.get(this.childNodeReturn);
                    if (endNode.type == core.NodeType.Variable || endNode.type == core.NodeType.Custom) {
                        endNode.writeNexts(childGraphNodeConfig);
                        endNode.writeOutputs(childGraphNodeConfig);
                    }
                    else {
                        nodeTemplate = managers.NodeManager.getInstance().getNodeTemplate(endNode.getName());
                        if (!nodeTemplate) {
                            console.error("error: the node template:" + endNode.getName() + " is not exist!");
                        }
                        else {
                            childGraphNodeConfig["output"] = nodeTemplate.output;
                            childGraphNodeConfig["next"] = nodeTemplate.next;
                        }
                    }
                    childGraphNodeConfig["category"] = "Graph";
                }
                // 创建子流图节点模板
                let graphNodeTemplate = managers.NodeManager.getInstance().createNodeTemplate(childGraphNodeConfig);
                graphNodeTemplate.isGraphNodeTemplate = true;
                return graphNodeTemplate.createNode();
            }
            return null;
        }
        deleteDebugNodeIds() {
            let nodeIds = new Array();
            for (let node of this.nodes.values()) {
                if (node.getDebug()) {
                    node.setDebug(false);
                }
            }
        }
        getDebugNodeIds() {
            let nodeIds = new Array();
            for (let node of this.nodes.values()) {
                if (node.getDebug()) {
                    nodeIds.push(node.id);
                }
            }
            return nodeIds;
        }
        hasAssociation(nodeId, slotId) {
            if (!this.associations)
                return false;
            let endpoint = null;
            for (let asso of this.associations) {
                endpoint = asso.getEnd();
                if (endpoint.getNodeId() == nodeId && endpoint.getSlotId() == slotId)
                    return true;
            }
            return false;
        }
        updateInvalidStatus(data) {
            super.updateInvalidStatus(data);
            managers.EventManager.getInstance().event(core.EventType.UPDATE_VIEW);
        }
        equals(other) {
            return false;
        }
        preProcess() {
            for (let asso of this.associations) {
                this.preProcessEndPoint(asso.getStart());
                this.preProcessEndPoint(asso.getEnd());
            }
        }
        preProcessEndPoint(endPoint) {
            let node = this.getNodeById(endPoint.getNodeId());
            if (node) {
                let slot = node.getSlotById(endPoint.getSlotId());
                if (slot) {
                    endPoint.setSlotName(slot.getName());
                }
            }
        }
        postProcess() {
            let badAsso = new Array();
            for (let asso of this.associations) {
                if (!this.postProcessEndPoint(asso.getStart())) {
                    badAsso.push(asso);
                    continue;
                }
                if (!this.postProcessEndPoint(asso.getEnd())) {
                    badAsso.push(asso);
                }
            }
            for (let i = 0, len = badAsso.length; i < len; ++i) {
                this.deleteBadAsso(badAsso[i]);
            }
        }
        deleteBadAsso(asso) {
            for (let i = 0, len = this.associations.length; i < len; ++i) {
                if (asso.equals(this.associations[i])) {
                    this.associations.splice(i, 1);
                    asso.dispose();
                    break;
                }
            }
        }
        postProcessEndPoint(endPoint) {
            let ret = true;
            let node = this.getNodeById(endPoint.getNodeId());
            if (node) {
                let slot = node.getSlotByName(endPoint.getSlotName());
                if (slot) {
                    endPoint.setSlotId(slot.getId());
                }
                else {
                    console.error("error: slot is null when post process endpoint");
                    ret = false;
                }
            }
            else {
                console.error("error: node is null when post process endpoint");
                ret = false;
            }
            return ret;
        }
        getNodeById(id) {
            return this.nodes.get(id);
        }
        createCustom() {
            let custom = new model.Custom();
            let id = "CustomNode" + (this._customGuid++).toString();
            custom.setId(id);
            custom.setName(id);
            if (!this.customs)
                this.customs = new Array();
            this.customs.push(custom);
            custom.on(model.Model.UPDATE, this, this.onUpdateCustomHandler);
            return custom;
        }
        removeCustom(custom) {
            if (!this.customs)
                return;
            for (let i = 0; i < this.customs.length; ++i) {
                if (this.customs[i].equals(custom)) {
                    this.customs.splice(i, 1);
                    this.deleteNodesByCustom(custom);
                    custom.dispose();
                    this.invalid = true;
                    break;
                }
            }
        }
        deleteNodesByCustom(custom) {
            for (let node of this.nodes.values()) {
                if (node.type == core.NodeType.Custom) {
                    if (custom.getName() == node.getName()) {
                        this.deleteNode(node);
                    }
                }
            }
        }
        onUpdateCustomHandler(custom) {
            for (let node of this.nodes.values()) {
                if (node.type == core.NodeType.Custom) {
                    if (node.getOwnerId() == custom.getId()) {
                        custom.copyToNode(node);
                        this.verifyAssociationsByNode(node);
                    }
                }
            }
            this.updateInvalidStatus();
        }
        onUpdateVairableHandler(variable) {
            for (let node of this.nodes.values()) {
                if (node.type == core.NodeType.Variable) {
                    if (node.getOwnerId() == variable.getId()) {
                        variable.copyToNode(node);
                        this.verifyAssociationsByNode(node);
                    }
                }
            }
            this.updateInvalidStatus();
        }
        verifyAssociationsByNode(node) {
            let badAssos = new Array();
            for (let asso of this.associations) {
                if (asso.getEnd().getNodeId() == node.id) {
                    let endSlot = node.getSlotById(asso.getEnd().getSlotId());
                    if (!endSlot) {
                        // 插槽丢失
                        badAssos.push(asso);
                    }
                    // 数据输入插槽类型检查
                    let startNode = this.nodes.get(asso.getStart().getNodeId());
                    if (startNode) {
                        let startSlot = startNode.getSlotById(asso.getStart().getSlotId());
                        if (startSlot && startSlot.getType() == core.SlotType.DataOut) {
                            if (startSlot.getDataType() != endSlot.getDataType()) {
                                badAssos.push(asso);
                            }
                        }
                    }
                }
                else if (asso.getStart().getNodeId() == node.id) {
                    let startSlot = node.getSlotById(asso.getStart().getSlotId());
                    if (!startSlot) {
                        // 插槽丢失
                        badAssos.push(asso);
                    }
                    // 数据输出类型检查
                    let endNode = this.nodes.get(asso.getEnd().getNodeId());
                    if (endNode) {
                        let endSlot = endNode.getSlotById(asso.getEnd().getSlotId());
                        if (endSlot && endSlot.getType() == core.SlotType.DataIn) {
                            if (startSlot.getDataType() != endSlot.getDataType()) {
                                badAssos.push(asso);
                            }
                        }
                    }
                }
            }
            let badAsso = null;
            while (badAssos.length > 0) {
                badAsso = badAssos.pop();
                for (let i = 0; i < this.associations.length; ++i) {
                    if (badAsso.equals(this.associations[i])) {
                        this.associations.splice(i, 1);
                        break;
                    }
                }
            }
        }
        createVariable() {
            let variable = new model.Variable();
            let id = this.name + "|variable" + (this._varGuid++).toString();
            variable.setId(id);
            variable.setName("variable" + (this._varGuid++).toString());
            if (!this.variables)
                this.variables = new Array();
            this.variables.push(variable);
            variable.on(model.Model.UPDATE, this, this.onUpdateVairableHandler);
            return variable;
        }
        removeVariable(variable) {
            if (!this.variables)
                return;
            for (let i = 0; i < this.variables.length; ++i) {
                if (this.variables[i].equals(variable)) {
                    this.variables.splice(i, 1);
                    this.deleteNodesByVariable(variable);
                    variable.dispose();
                    this.invalid = true;
                    break;
                }
            }
        }
        deleteNodesByVariable(variable) {
            for (let node of this.nodes.values()) {
                if (node.type == core.NodeType.Variable) {
                    if (variable.getName() == node.getName()) {
                        this.deleteNode(node);
                    }
                }
            }
        }
        // 创建关联
        createAssociation(one, other) {
            let oneNode = this.nodes.get(one.getNodeId());
            if (!oneNode) {
                console.error("error: node id: " + one.getNodeId() + "not exist in the graph:" + this.name);
            }
            else {
                let otherNode = this.nodes.get(other.getNodeId());
                if (!otherNode) {
                    console.error("error: node id: " + other.getNodeId() + "not exist in the graph:" + this.name);
                }
                else {
                    let oneSlot = oneNode.getSlotById(one.getSlotId());
                    if (!oneSlot) {
                        console.error("error: slot id: " + one.getSlotId() + "not exist in the node:" + oneNode.getName());
                    }
                    else {
                        let otherSlot = otherNode.getSlotById(other.getSlotId());
                        if (!otherSlot) {
                            console.error("error: slot id: " + other.getSlotId() + "not exist in the node:" + otherNode.getName());
                        }
                        else {
                            if (!oneSlot.match(otherSlot)) {
                                return null;
                            }
                            else {
                                let assocaition = new model.Association();
                                let isOneStart = (oneSlot.getType() == core.SlotType.ExecutionOut || oneSlot.getType() == core.SlotType.DataOut);
                                assocaition.setStart(isOneStart ? one : other);
                                assocaition.setEnd(isOneStart ? other : one);
                                this.associations.push(assocaition);
                                assocaition.on(model.Model.UPDATE, this, this.updateInvalidStatus);
                                return assocaition;
                            }
                        }
                    }
                }
            }
            return null;
        }
        // 向流图添加节点
        addNode(node) {
            node.ownerGraphName = this.name;
            if (!node.id)
                node.setId(this.createNodeId());
            if (node.hasListener(model.Model.UPDATE))
                node.off(model.Model.UPDATE, this, this.updateInvalidStatus);
            this.nodes.set(node.id, node);
            node.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            this.invalid = true;
        }
        createNodeId() {
            let seed = 0;
            for (let nodeId of this.nodes.keys()) {
                if (Number(nodeId) > seed)
                    seed = Number(nodeId);
            }
            return (++seed).toString();
        }
        existAssociation(nodeId, slotId) {
            let endpoint = null;
            for (let asso of this.associations) {
                endpoint = asso.getEnd();
                if (endpoint.getNodeId() == nodeId && endpoint.getSlotId() == slotId)
                    return true;
                endpoint = asso.getStart();
                if (endpoint.getNodeId() == nodeId && endpoint.getSlotId() == slotId)
                    return true;
            }
            return false;
        }
        // 从流图中删除流图
        deleteNode(node) {
            if (this.nodes.has(node.id)) {
                this.nodes.delete(node.id);
                if (node.id == this.childNodeCall)
                    this.childNodeCall = null;
                if (node.id == this.childNodeReturn)
                    this.childNodeReturn = null;
                this.deleteAssociations(node);
                node.dispose();
                this.invalid = true;
            }
        }
        // 删除关联
        deleteAssociation(asso) {
            let ass = null;
            for (let i = 0; i < this.associations.length; ++i) {
                ass = this.associations[i];
                if (asso.equals(ass)) {
                    this.associations.splice(i, 1);
                    asso.dispose();
                    this.invalid = true;
                    break;
                }
            }
        }
        // 删除节点关联的关系
        deleteAssociations(node) {
            let badArr = new Array();
            for (let asso of this.associations) {
                if (asso.getStart() && asso.getStart().getNodeId() == node.id) {
                    badArr.push(asso);
                    continue;
                }
                if (asso.getEnd() && asso.getEnd().getNodeId() == node.id)
                    badArr.push(asso);
            }
            let badAsso = null;
            while (badArr.length > 0) {
                badAsso = badArr.pop();
                for (let i = 0; i < this.associations.length; ++i) {
                    if (this.associations[i].equals(badAsso)) {
                        this.associations.splice(i, 1);
                        badAsso.dispose();
                        this.invalid = true;
                        break;
                    }
                }
            }
        }
        // 获取event对象
        getEventObj() {
            let element = null;
            for (let node of this.nodes.values()) {
                if (node.type == core.NodeType.Event) {
                    if (!element)
                        element = {};
                    element[node.getName()] = node.id;
                }
            }
            return element;
        }
        // 获取节点对象
        getNodeObj(node) {
            let nodeObj = { "name": node.getName(), "category": node.category };
            let inputObj = this.getNodeInput(node);
            if (inputObj)
                nodeObj["input"] = inputObj;
            let nextObj = this.getNodeNext(node);
            if (nextObj)
                nodeObj["next"] = nextObj;
            //node.writeOutputs(nodeObj);
            if (node.isGraphNode) {
                nodeObj["children_flow_graph_name"] = node.getName();
                nodeObj["name"] = "flow_graph_node";
                if (!this.subGraphTemplateBaks)
                    this.subGraphTemplateBaks = new Map();
                this.subGraphTemplateBaks.set(node.getName(), node);
            }
            if (node.category == model.Variable.CATEGORY) {
                // 服务器数据要求
                if (node.getName().toUpperCase().indexOf(model.Variable.GET.toUpperCase()) != -1) {
                    nodeObj["name"] = "get";
                }
                else if (node.getName().toUpperCase().indexOf(model.Variable.SET.toUpperCase()) != -1) {
                    nodeObj["name"] = "set";
                }
                nodeObj["varName"] = node.getName().substring(3);
            }
            nodeObj["type"] = node.type.toString();
            nodeObj["ui_position"] = [node.x, node.y];
            return nodeObj;
        }
        // 获取执行输出
        getNodeNext(node) {
            let nextObj = null;
            if (node.executionOuts && node.executionOuts.length > 0) {
                let asso = null;
                let slot = null;
                for (let i = 0; i < this.associations.length; ++i) {
                    asso = this.associations[i];
                    if (asso.getStart().getNodeId() == node.id) {
                        // 关联的入口为此节点
                        slot = node.getSlotById(asso.getStart().getSlotId());
                        if (slot && slot.getType() == core.SlotType.ExecutionOut) {
                            if (!nextObj)
                                nextObj = {};
                            if (!nextObj[slot.getName()]) {
                                nextObj[slot.getName()] = new Array();
                            }
                            nextObj[slot.getName()].push(asso.getEnd().getNodeId());
                        }
                    }
                }
            }
            return nextObj;
        }
        // 获取数据输入
        getNodeInput(node) {
            let inputObj = null;
            let asso = null;
            let slot = null;
            let assoSlots = new Set();
            if (node.getDataInputsCount() == 0)
                return null;
            for (let i = 0; i < this.associations.length; ++i) {
                asso = this.associations[i];
                if (asso.getEnd().getNodeId() == node.id) {
                    // 关联的出口为此节点
                    slot = node.getSlotById(asso.getEnd().getSlotId());
                    if (slot && slot.getType() == core.SlotType.DataIn) {
                        if (!inputObj)
                            inputObj = {};
                        inputObj[slot.getName()] = { "node_id": asso.getStart().getNodeId(), "pin": asso.getStart().getSlotName() };
                        assoSlots.add(slot.getId());
                        if (node.isGraphNode) {
                            if (this.nodes.has(asso.getStart().getNodeId())) {
                                let sNode = this.nodes.get(asso.getStart().getNodeId());
                                inputObj["flow_graph"] = sNode.getName();
                            }
                            else {
                                console.error("error: grahp:" + this.name + "not cantains the flow_graph nodeId:" + asso.getStart().getNodeId());
                            }
                        }
                    }
                }
            }
            inputObj = node.writeDefaultDataInputsTo(inputObj, assoSlots);
            return inputObj;
        }
        // 转为json字符串
        toJson() {
            this.preProcess();
            let graph = {};
            graph["name"] = this.name;
            let event = this.getEventObj();
            if (event)
                graph["event"] = event;
            if (this.childNodeCall && this.childNodeReturn) {
                // 如果是子流图则写入call, return
                graph["children_flow_graph_call"] = this.childNodeCall;
                graph["children_flow_graph_return"] = this.childNodeReturn;
            }
            let node = null;
            for (let nodeId of this.nodes.keys()) {
                node = this.nodes.get(nodeId);
                graph[nodeId] = this.getNodeObj(node);
            }
            if (this.variables) {
                let variablesObj = {};
                let dataObj = null;
                for (let variable of this.variables) {
                    dataObj = {};
                    variablesObj[variable.getName()] = dataObj;
                    dataObj[variable.getType().toString()] = variable.getValue();
                }
                graph["variables"] = variablesObj;
            }
            if (this.customs) {
                let csmNodes = new Array();
                let cmsNodeObj = null;
                for (let custom of this.customs) {
                    cmsNodeObj = { "subType": custom.getType().toString() };
                    custom.writeTo(cmsNodeObj);
                    csmNodes.push(cmsNodeObj);
                }
                graph["custom_nodes"] = csmNodes;
            }
            if (this.subGraphTemplateBaks) {
                let subGraphNodes = new Array();
                let subGraphNodeObj = null;
                for (let subGraphNode of this.subGraphTemplateBaks.values()) {
                    subGraphNodeObj = {};
                    subGraphNode.writeTo(subGraphNodeObj);
                    subGraphNodes.push(subGraphNodeObj);
                }
                graph["sub_graphs"] = subGraphNodes;
            }
            let json = JSON.stringify(graph);
            return json;
        }
        dispose() {
            super.dispose();
            this.offAll();
            for (let node of this.nodes.values()) {
                node.dispose();
            }
            this.nodes.clear();
            let asso = null;
            while (this.associations.length > 0) {
                asso = this.associations.pop();
                asso.dispose();
            }
            if (this.variables) {
                let variable = null;
                while (this.variables.length > 0) {
                    variable = this.variables.pop();
                    variable.dispose();
                }
                this.variables = null;
            }
            if (this.customs) {
                let custom = null;
                while (this.customs.length > 0) {
                    custom = this.customs.pop();
                    custom.dispose();
                }
                this.customs = null;
            }
        }
        update() {
            for (let node of this.nodes.values()) {
                node.update();
            }
            for (let asso of this.associations) {
                asso.update();
            }
            if (this.variables) {
                for (let variable of this.variables) {
                    variable.update();
                }
            }
            if (this.customs) {
                for (let custom of this.customs) {
                    custom.update();
                }
            }
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
    }
    model.Graph = Graph;
})(model || (model = {}));
//# sourceMappingURL=Graph.js.map