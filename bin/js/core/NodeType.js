/**
* @author confiner
* @desc 节点类型
*/
var core;
(function (core) {
    let NodeType;
    (function (NodeType) {
        NodeType["Data"] = "data";
        NodeType["Ctrl"] = "ctrl";
        NodeType["Event"] = "event";
        NodeType["Variable"] = "variable";
        NodeType["Graph"] = "graph";
        NodeType["Custom"] = "custom";
        NodeType["Logic"] = "logic";
        NodeType["Start"] = "start";
        NodeType["End"] = "end";
    })(NodeType = core.NodeType || (core.NodeType = {}));
})(core || (core = {}));
//# sourceMappingURL=NodeType.js.map