/**
* 流图执行输出关联类
* @author confiner
*/
var template;
(function (template) {
    var Assocaition = model.Association;
    var SlotNames = core.SlotNames;
    var EndPoint = model.EndPoint;
    class GraphNextTemplate {
        constructor(config) {
            this.config = config;
            this.nexts = new Map();
            this.parse();
        }
        parse() {
            for (let slotName in this.config) {
                this.nexts.set(slotName, this.config[slotName]);
            }
        }
        // 创建数据输入关联列表
        createAssociations() {
            let assocaitions = new Array();
            let assoObj = null;
            let assocaition = null;
            let startEP = null;
            let endEP = null;
            let nextNodeIds = null;
            let nodeId = null;
            for (let key of this.nexts.keys()) {
                assoObj = this.nexts.get(key);
                if (assoObj) {
                    nextNodeIds = assoObj;
                    if (nextNodeIds) {
                        for (let i = 0; i < nextNodeIds.length; ++i) {
                            nodeId = nextNodeIds[i];
                            assocaition = new Assocaition();
                            startEP = new EndPoint();
                            startEP.setNodeId(this.nodeId);
                            startEP.setSlotName(String(key));
                            assocaition.setStart(startEP);
                            endEP = new EndPoint();
                            endEP.setNodeId(nodeId);
                            endEP.setSlotName(SlotNames.In.toString());
                            assocaition.setEnd(endEP);
                            assocaitions.push(assocaition);
                        }
                    }
                }
            }
            return assocaitions;
        }
    }
    template.GraphNextTemplate = GraphNextTemplate;
})(template || (template = {}));
//# sourceMappingURL=GraphNextTemplate.js.map