/**
* 流图输入关联模板类
* @author confiner
*/
var template;
(function (template) {
    var Assocaition = model.Association;
    var EndPoint = model.EndPoint;
    class GraphInputTemplate {
        constructor(config) {
            this.config = config;
            this.inputs = new Map();
            this.parse();
        }
        parse() {
            for (let slotName in this.config) {
                this.inputs.set(slotName, this.config[slotName]);
            }
        }
        // 创建数据输入关联列表
        createAssociations() {
            let assocaitions = new Array();
            let assoObj = null;
            let assocaition = null;
            let startEP = null;
            let endEP = null;
            for (let key of this.inputs.keys()) {
                if (String(key) == "flow_graph")
                    continue;
                assoObj = this.inputs.get(key);
                let defaultValue = assoObj["defaultValue"];
                if (defaultValue != undefined && defaultValue != null) {
                    // 无连线设置默认值优先
                    if (!this.node)
                        console.error("error: the default value for the slot :" + key + " not exist in node");
                    else if (defaultValue != "")
                        this.node.setInputValue(String(key), assoObj["defaultValue"]);
                }
                else {
                    assocaition = new Assocaition();
                    startEP = new EndPoint();
                    startEP.setNodeId(assoObj["node_id"]);
                    startEP.setSlotName(assoObj["pin"]);
                    assocaition.setStart(startEP);
                    endEP = new EndPoint();
                    endEP.setNodeId(this.node.id);
                    endEP.setSlotName(String(key));
                    assocaition.setEnd(endEP);
                    assocaitions.push(assocaition);
                }
            }
            return assocaitions;
        }
    }
    template.GraphInputTemplate = GraphInputTemplate;
})(template || (template = {}));
//# sourceMappingURL=GraphInputTemplate.js.map