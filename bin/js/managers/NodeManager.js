/**
* 节点管理器
*  @author confiner
*/
var managers;
(function (managers) {
    //import NodeTemplate = template.NodeTemplate;
    //import NodeType = core.NodeType;
    class NodeManager {
        constructor() {
            this._nodeTemplates = new Map();
            this._nodeColors = new Array();
        }
        // 创建指定名称的node
        createNode(nodeTemplateName, id) {
            let nodeTemplate = this._nodeTemplates.get(nodeTemplateName);
            if (!nodeTemplate) {
                console.log("log: Not exist the node tempalte: " + nodeTemplateName);
            }
            else {
                let node = nodeTemplate.createNode(id);
                return node;
            }
            return null;
        }
        // 解析节点模板数据
        parseNodesTemplate(nodeTemplates) {
            for (let i = 0; i < nodeTemplates.length; ++i) {
                this.createNodeTemplate(nodeTemplates[i]);
            }
            managers.EventManager.getInstance().event(core.EventType.NODES_READY);
        }
        // 创建节点模板
        createNodeTemplate(config) {
            let nodeTemplate = new NodeTemplate(config);
            this._nodeTemplates.set(nodeTemplate.name, nodeTemplate);
            return nodeTemplate;
        }
        // 获取节点模板对象
        getNodeTemplate(templateName) {
            if (this._nodeTemplates.has(templateName)) {
                return this._nodeTemplates.get(templateName);
            }
            return null;
        }
        // 获取模式匹配的节点模板
        getMatchNodeTemplates(partten) {
            let matchs = null;
            let upperKey = null;
            for (let key of this.getAllNodeTemplates().keys()) {
                upperKey = key.toUpperCase();
                if (upperKey.indexOf(partten.toUpperCase()) >= 0) {
                    if (!matchs) {
                        matchs = new Map();
                    }
                    matchs.set(key, this.getAllNodeTemplates().get(key));
                }
            }
            return matchs;
        }
        GetColorId(category) {
            let colorId = this._nodeColors.indexOf(category);
            if (colorId < 0) {
                colorId = this._nodeColors.length;
                this._nodeColors.push(category);
            }
            return colorId;
        }
        // 获取所有模板
        getAllNodeTemplates() {
            let templates = new Map();
            let tmp = null;
            for (let tmpName of this._nodeTemplates.keys()) {
                tmp = this._nodeTemplates.get(tmpName);
                if (tmp && tmp.type == core.NodeType.Variable.toString())
                    continue;
                templates.set(tmpName, tmp);
            }
            return templates;
        }
        // 获取单例接口
        static getInstance() {
            if (!NodeManager._inst) {
                NodeManager._inst = new NodeManager();
            }
            return NodeManager._inst;
        }
    }
    managers.NodeManager = NodeManager;
})(managers || (managers = {}));
//# sourceMappingURL=NodeManager.js.map