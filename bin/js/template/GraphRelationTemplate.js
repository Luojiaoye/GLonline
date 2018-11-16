/**
* 流图节点模板类(包含关系)
* @author confiner
*/
var template;
(function (template) {
    var Node = model.Node;
    var NodeManager = managers.NodeManager;
    var Relation = model.Relation;
    var GraphManager = managers.GraphManager;
    class GraphRelationTemplate {
        constructor(config) {
            this.config = config;
            this.parse();
        }
        parse() {
            this.name = this.config["name"];
            this.input = this.config["input"];
            this.next = this.config["next"];
            this.ownerGrahpName = this.config["children_flow_graph_name"];
            this.position = this.config["ui_position"];
            this.varName = this.config["varName"];
            this.type = this.config["type"];
        }
        // 创建关联组合
        createRelation() {
            let relation = new Relation();
            let nodeName = this.ownerGrahpName ? this.ownerGrahpName : this.name;
            let node = null;
            if (this.type == core.NodeType.Variable.toString() && this.variables) {
                let variable = null;
                for (let vari of this.variables) {
                    if (vari.getName() == this.varName) {
                        variable = vari;
                        break;
                    }
                }
                if (variable) {
                    if (this.input) {
                        // set 变量节点
                        node = variable.createSetNode();
                    }
                    else {
                        // get变量节点
                        node = variable.createGetNode();
                    }
                    node.setId(this.nodeId);
                    node.setOwnerId(variable.getId());
                }
            }
            else if (this.type == core.NodeType.Custom.toString() && this.customs) {
                let custom = null;
                for (let csm of this.customs) {
                    if (csm.getName() == nodeName) {
                        custom = csm;
                        break;
                    }
                }
                if (custom) {
                    node = new Node();
                    node.copyFrom(custom.getNode());
                    node.setId(this.nodeId);
                }
            }
            else if (this.type == core.NodeType.Graph.toString()) {
                let graphCfg = GraphManager.getInstance().getGraphConfig(nodeName);
                GraphManager.getInstance().loadGraph(graphCfg);
                node = NodeManager.getInstance().createNode(nodeName, this.nodeId);
                if (this.subGraphTemplateBaks) {
                    let nodeBak = this.subGraphTemplateBaks.get(nodeName);
                    if (!node.same(nodeBak)) {
                        //node = nodeBak;
                        node.isBak = true;
                        console.log(node.id + "--->bak");
                    }
                }
            }
            else {
                node = NodeManager.getInstance().createNode(nodeName, this.nodeId);
            }
            node.x = this.position[0];
            node.y = this.position[1];
            relation.node = node;
            let input = new template.GraphInputTemplate(this.input);
            input.node = node;
            let inputAssociations = input.createAssociations();
            let next = new template.GraphNextTemplate(this.next);
            next.nodeId = this.nodeId;
            let nextAssociations = next.createAssociations();
            let allAssociation = null;
            if (inputAssociations) {
                allAssociation = inputAssociations;
            }
            if (nextAssociations) {
                if (allAssociation)
                    allAssociation = allAssociation.concat(nextAssociations);
                else
                    allAssociation = nextAssociations;
            }
            relation.associations = allAssociation;
            return relation;
        }
    }
    template.GraphRelationTemplate = GraphRelationTemplate;
})(template || (template = {}));
//# sourceMappingURL=GraphRelationTemplate.js.map