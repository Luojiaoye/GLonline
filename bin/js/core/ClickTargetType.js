/**
* 点击目标类型
* @author confiner
*/
var core;
(function (core) {
    let ClickTargetType;
    (function (ClickTargetType) {
        ClickTargetType[ClickTargetType["Line"] = 0] = "Line";
        ClickTargetType[ClickTargetType["Node"] = 1] = "Node";
        ClickTargetType[ClickTargetType["Window"] = 2] = "Window"; // 窗口
    })(ClickTargetType = core.ClickTargetType || (core.ClickTargetType = {}));
})(core || (core = {}));
//# sourceMappingURL=ClickTargetType.js.map