/**
* 节点描述类
* @author confiner
*/
var template;
(function (template) {
    var Node = model.Node;
    var NodeType = core.NodeType;
    var SlotType = core.SlotType;
    var SlotNames = core.SlotNames;
    class NodeTemplate {
        constructor(config) {
            this.config = config;
            this.parse();
        }
        parse() {
            this.nodeTips = this.config["nodeTips"];
            this.category = this.config["category"];
            this.type = this.config["type"];
            this.name = this.config["name"];
            this.next = this.config["next"];
            this.input = this.config["input"];
            this.output = this.config["output"];
            this.subCategory = this.config["subCategory"];
            this.before = this.config["before"];
        }
        createNode(id) {
            let node = new Node();
            node.setName(this.name);
            node.category = this.category;
            node.subCategory = this.subCategory;
            node.nodeTips = this.nodeTips;
            if (id)
                node.setId(id);
            if (this.isGraphNodeTemplate)
                node.isGraphNode = Boolean(this.isGraphNodeTemplate);
            node.setType(this.type);
            if (this.before) {
                node.createSlot(SlotType.ExecutionIn, String(this.before));
            }
            if (node.type == NodeType.Variable) {
                if (this.next) {
                    // 创建执行输出
                    node.createSlot(SlotType.ExecutionOut, SlotNames.Out);
                }
                if (this.output) {
                    // 创建数据输出
                    node.createSlot(SlotType.DataOut);
                }
                if (this.input) {
                    // 创建数据输入
                    node.createSlot(SlotType.DataIn);
                }
            }
            else {
                if (this.next) {
                    for (let i = 0; i < this.next.length; ++i) {
                        node.createSlot(SlotType.ExecutionOut, String(this.next[i]));
                    }
                }
                if (this.output) {
                    let dot = new template.DataOutTemplate(this.output);
                    let dosList = dot.createDataOutSlots();
                    for (let i = 0; i < dosList.length; ++i) {
                        node.addSlot(dosList[i]);
                    }
                }
                if (this.input) {
                    let dit = new template.DataInTemplate(this.input);
                    let disList = dit.createDataInSlots();
                    for (let i = 0; i < disList.length; ++i) {
                        node.addSlot(disList[i]);
                    }
                }
            }
            return node;
        }
    }
    template.NodeTemplate = NodeTemplate;
})(template || (template = {}));
//# sourceMappingURL=NodeTemplate.js.map