/**
* 调试操作类型
* @author confiner
*/
var core;
(function (core) {
    let DebugType;
    (function (DebugType) {
        DebugType["DebugEntry"] = "entry";
        DebugType["DebugContinue"] = "continue";
        DebugType["DebugNext"] = "next";
        DebugType["DebugExit"] = "exit";
        DebugType["DebugAdd"] = "add";
        DebugType["DebugDelete"] = "delete"; // 删除断点
    })(DebugType = core.DebugType || (core.DebugType = {}));
})(core || (core = {}));
//# sourceMappingURL=DebugType.js.map