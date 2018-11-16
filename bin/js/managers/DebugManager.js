/**
* 调试管理器
* @author confiner
*/
var managers;
(function (managers) {
    class DebugManager {
        constructor() {
            //private _currentGraph:model.GraphDebugInfo;	// 当前运行时流图调试信息
            this._index = -1; //当前运行时流图调试信息索引
            this.init();
        }
        init() {
        }
        getStackHead() {
            if (this._graphs && this._graphs.length > 0)
                return this.getGraphDebugInfoList()[0];
            return null;
        }
        getGraphDebugInfoList() {
            return this._graphs;
        }
        parseGraphStackInfo(jsonStr) {
            let obj = JSON.parse(jsonStr);
            let graphObjs = obj["stacks"];
            this._graphs = new Array();
            graphObjs = graphObjs.reverse();
            let graph = null;
            for (let i = 0, len = graphObjs.length; i < len; ++i) {
                graph = new model.GraphDebugInfo();
                graph.deserialize(graphObjs[i]);
                this._graphs.push(graph);
            }
            this.setCurrent(0);
        }
        // 获取当前运行时流图调试信息
        getCurrent() {
            if (!this._graphs || this._index >= this._graphs.length)
                return null;
            return this._graphs[this._index];
        }
        // 是否在调试栈中
        isInDebugStack(nodeId) {
            if (!this._graphs || this._graphs.length <= this._index)
                return false;
            for (let i = this._index, len = this._graphs.length; i < len; ++i) {
                if (this._graphs[i].getHitNodeId() == nodeId)
                    return true;
            }
            return false;
        }
        // 设置当前运行时流图调试信息
        setCurrent(index) {
            if (!this._graphs || this._graphs.length <= index)
                return;
            this._index = index;
            managers.EventManager.getInstance().event(core.EventType.DEBUG_RESULT);
        }
        getDebug() {
            return this._isDebug;
        }
        // 开始调试
        debugEntry() {
            if (!this._isDebug) {
                let breakpoints = managers.GraphManager.getInstance().getBreakPoints();
                if (breakpoints && breakpoints.size > 0) {
                    let msg = {};
                    msg["debug_type"] = core.DebugType.DebugEntry.toString();
                    let graphs = new Array();
                    let nodeIds = null;
                    for (let graphName of breakpoints.keys()) {
                        nodeIds = {};
                        nodeIds[graphName] = breakpoints.get(graphName);
                        graphs.push(nodeIds);
                    }
                    msg["breakpoints"] = graphs;
                    managers.ServerManager.getInstance().sendDebugInfo(msg);
                    this._isDebug = true;
                }
            }
            else {
                this.debugContinue();
            }
        }
        // 跳出继续
        debugContinue() {
            if (!this._isDebug)
                return;
            let data = { "debug_type": core.DebugType.DebugContinue.toString() };
            managers.ServerManager.getInstance().sendDebugInfo(data);
        }
        // 执行下一步
        debugNext() {
            if (!this._isDebug)
                return;
            let data = { "debug_type": core.DebugType.DebugNext.toString() };
            managers.ServerManager.getInstance().sendDebugInfo(data);
        }
        // 添加断点
        debugAdd(nodeId) {
            if (!this._isDebug)
                return;
            let breakpoints = {};
            let graph = managers.GraphManager.getInstance().getCurrent();
            if (graph) {
                breakpoints[graph.name] = [nodeId];
            }
            let data = {
                "debug_type": core.DebugType.DebugAdd.toString(),
                "breakpoints": [breakpoints]
            };
            managers.ServerManager.getInstance().sendDebugInfo(data);
        }
        deleteGraphBreapoints(graphName) {
            let graph = managers.GraphManager.getInstance().getGraph(graphName);
            if (graph) {
                let breakpoints = {};
                breakpoints[graphName] = graph.getDebugNodeIds();
                let data = {
                    "debug_type": core.DebugType.DebugDelete.toString(),
                    "breakpoints": [breakpoints]
                };
                managers.ServerManager.getInstance().sendDebugInfo(data);
                graph.deleteDebugNodeIds();
            }
        }
        // 删除断点
        debugDelete(nodeId) {
            if (!this._isDebug)
                return;
            let breakpoints = {};
            let graph = managers.GraphManager.getInstance().getCurrent();
            if (graph) {
                breakpoints[graph.name] = [nodeId];
            }
            let data = {
                "debug_type": core.DebugType.DebugDelete.toString(),
                "breakpoints": [breakpoints]
            };
            managers.ServerManager.getInstance().sendDebugInfo(data);
        }
        // 调试结束
        debugExit() {
            if (this._isDebug) {
                let data = { "debug_type": core.DebugType.DebugExit.toString() };
                managers.ServerManager.getInstance().sendDebugInfo(data);
                managers.EventManager.getInstance().event(core.EventType.DEBUG_OPERATION, [core.DebugType.DebugExit.toString()]);
                this._isDebug = false;
                this._graphs = null;
            }
        }
        // 获取单例接口
        static getInstance() {
            if (!DebugManager._inst) {
                DebugManager._inst = new DebugManager();
            }
            return DebugManager._inst;
        }
    }
    managers.DebugManager = DebugManager;
})(managers || (managers = {}));
//# sourceMappingURL=DebugManager.js.map