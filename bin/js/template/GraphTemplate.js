/**
* 流图模板类
* @author confiner
*/
var template;
(function (template) {
    var Node = model.Node;
    var NodeManager = managers.NodeManager;
    var NodeType = core.NodeType;
    var Custom = model.Custom;
    class GraphTemplate {
        constructor(config) {
            this.config = config;
            this.nodes = new Map();
            this._event = new Map();
            this.parse();
        }
        parse() {
            this.name = this.config["name"];
            let variablesObj = this.config["variables"];
            if (variablesObj) {
                for (let varName in variablesObj) {
                    if (!this.variables)
                        this.variables = new Map();
                    this.variables.set(varName, variablesObj[varName]);
                }
            }
            let customsObj = this.config["custom_nodes"];
            if (customsObj) {
                for (let custom of customsObj) {
                    if (!this.customs)
                        this.customs = new Array();
                    this.customs.push(custom);
                }
            }
            let subGraphTemplateBaksObj = this.config["sub_graphs"];
            if (subGraphTemplateBaksObj) {
                for (let subGraphTemplateBak of subGraphTemplateBaksObj) {
                    if (!this.subGraphTemplateBaks)
                        this.subGraphTemplateBaks = new Array();
                    this.subGraphTemplateBaks.push(subGraphTemplateBak);
                }
            }
            if (this.config["children_flow_graph_call"])
                this.childStartNodeId = String(this.config["children_flow_graph_call"]);
            if (this.config["children_flow_graph_return"])
                this.childEndNodeId = String(this.config["children_flow_graph_return"]);
            let nodeObj = null;
            let nodeName = null;
            for (let nodeId in this.config) {
                nodeObj = this.config[nodeId];
                nodeName = nodeObj["name"];
                if (nodeName && nodeName != "") {
                    this.nodes.set(nodeId, nodeObj);
                }
            }
            let event = this.config["event"];
            if (event) {
                let nodeId = null;
                for (let nName in event) {
                    nodeId = event[nName];
                    this._event.set(nodeId, nName);
                }
            }
        }
        createGraph() {
            let graph = managers.GraphManager.getInstance().createGraph(this.name);
            if (this.subGraphTemplateBaks) {
                graph.subGraphTemplateBaks = new Map();
                let subGraphTemplateBak = null;
                for (let subGraphTemplateBakObj of this.subGraphTemplateBaks) {
                    subGraphTemplateBak = new Node();
                    subGraphTemplateBak.readFrom(subGraphTemplateBakObj);
                    graph.subGraphTemplateBaks.set(subGraphTemplateBak.getName(), subGraphTemplateBak);
                }
            }
            if (this.variables) {
                let datumTemplate = null;
                let variable = null;
                let data = null;
                for (let varName of this.variables.keys()) {
                    variable = graph.createVariable();
                    variable.setName(varName);
                    datumTemplate = new template.DatumTemplate(this.variables.get(varName));
                    data = datumTemplate.createDatum();
                    variable.setType(data.getType());
                    variable.setValue(data.getValue());
                }
            }
            if (this.customs) {
                graph.customs = new Array();
                let custom = null;
                for (let customObj of this.customs) {
                    custom = new Custom();
                    custom.readFrom(customObj);
                    graph.customs.push(custom);
                }
            }
            graph.childNodeCall = this.childStartNodeId;
            graph.childNodeReturn = this.childEndNodeId;
            let nodeObj = null;
            let graphRelationTemplate = null;
            let node = null;
            let relation = null;
            let associations = null;
            if (this.childEndNodeId && this.childStartNodeId) {
                graph.isChildGraph = true;
            }
            for (let nodeId of this.nodes.keys()) {
                nodeObj = this.nodes.get(nodeId);
                if (nodeObj) {
                    graphRelationTemplate = new template.GraphRelationTemplate(nodeObj);
                    graphRelationTemplate.subGraphTemplateBaks = graph.subGraphTemplateBaks;
                    graphRelationTemplate.nodeId = nodeId;
                    graphRelationTemplate.variables = graph.variables;
                    graphRelationTemplate.customs = graph.customs;
                    relation = graphRelationTemplate.createRelation();
                    node = relation.node;
                    if (this._event && this._event.has(node.id)) {
                        node.type = core.NodeType.Event;
                    }
                    node.setType(nodeObj["type"]);
                    graph.addNode(node);
                    associations = relation.associations;
                    graph.associations = graph.associations.concat(associations);
                }
            }
            // 子流图逻辑
            if (graph.isChildGraph) {
                graph.isChildGraph = true;
                let childGraphNodeConfig = {};
                childGraphNodeConfig["name"] = this.name;
                childGraphNodeConfig["type"] = NodeType.Graph.toString();
                let nodeTemplate = null;
                if (!graph.nodes.has(this.childStartNodeId)) {
                    console.error("error: children_flow_graph_call id :" + this.childStartNodeId + " not exist in the graph:" + this.name);
                }
                else {
                    let startNode = graph.nodes.get(this.childStartNodeId);
                    if (startNode.type == core.NodeType.Variable || startNode.type == core.NodeType.Custom) {
                        startNode.writeBefore(childGraphNodeConfig);
                        startNode.writeInputs(childGraphNodeConfig);
                    }
                    else {
                        nodeTemplate = NodeManager.getInstance().getNodeTemplate(startNode.getName());
                        if (!nodeTemplate) {
                            console.error("error: the node template:" + startNode.getName() + " is not exist!");
                        }
                        else {
                            childGraphNodeConfig["input"] = nodeTemplate.input;
                            if (nodeTemplate.before)
                                childGraphNodeConfig["before"] = nodeTemplate.before;
                        }
                    }
                    if (!graph.nodes.has(this.childEndNodeId)) {
                        console.error("error: children_flow_graph_return id :" + this.childEndNodeId + " not exist in the graph:" + this.name);
                    }
                    let endNode = graph.nodes.get(this.childEndNodeId);
                    if (endNode.type == core.NodeType.Variable || endNode.type == core.NodeType.Custom) {
                        endNode.writeNexts(childGraphNodeConfig);
                        endNode.writeOutputs(childGraphNodeConfig);
                    }
                    else {
                        nodeTemplate = NodeManager.getInstance().getNodeTemplate(endNode.getName());
                        if (!nodeTemplate) {
                            console.error("error: the node template:" + endNode.getName() + " is not exist!");
                        }
                        else {
                            childGraphNodeConfig["output"] = nodeTemplate.output;
                            childGraphNodeConfig["next"] = nodeTemplate.next;
                        }
                    }
                    childGraphNodeConfig["category"] = Node.GRAPH_CATEGORY;
                }
                // 创建子流图节点模板
                let graphNodeTemplate = NodeManager.getInstance().createNodeTemplate(childGraphNodeConfig);
                graphNodeTemplate.isGraphNodeTemplate = true;
            }
            graph.postProcess();
            return graph;
        }
    }
    template.GraphTemplate = GraphTemplate;
})(template || (template = {}));
//# sourceMappingURL=GraphTemplate.js.map