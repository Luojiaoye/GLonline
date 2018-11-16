/**
* 流图管理器
* @author confiner
*/
var managers;
(function (managers) {
    var FileInfo = model.FileInfo;
    //import GraphTemplate = template.GraphTemplate;
    class GraphManager {
        constructor() {
            this._guid = 0;
            this.initialize();
        }
        initialize() {
            this._graphs = new Map();
            Laya.timer.frameLoop(1, this, this.postUpdate);
        }
        postUpdate() {
            // 只更新当前流图
            let graph = this.getCurrent();
            if (graph)
                graph.update();
        }
        // 创建流图[如果流图名称重复则创建失败]
        createGraph(name) {
            if (!name)
                name = this.getDefaultName();
            if (this._graphs.has(name))
                return this._graphs.get(name);
            let graph = new model.Graph();
            graph.name = name;
            this._graphs.set(name, graph);
            return graph;
        }
        getDefaultName() {
            (++this._guid);
            return "untitle" + this._guid.toString();
        }
        // 获取所有断点
        getBreakPoints() {
            let breakPoints = new Map();
            let nodeIds = null;
            for (let graph of this._graphs.values()) {
                nodeIds = graph.getDebugNodeIds();
                if (nodeIds && nodeIds.length > 0) {
                    breakPoints.set(graph.name, nodeIds);
                }
            }
            return breakPoints;
        }
        // 加载所有流图
        loadGraphs(config) {
            this._graphs.clear();
            this._curGraph = null;
            this._graphConfig = this.preProcessConfig(config);
            for (let i = 0; i < this._graphConfig.length; ++i) {
                this.loadGraph(this._graphConfig[i]);
            }
            this.parseGraphFiles();
            managers.EventManager.getInstance().event(core.EventType.LOAD_GRAPH);
        }
        parseGraphFiles() {
            this._graphsDir = new FileInfo();
            this._graphsDir.files = new Array();
            this._graphsDir.name = "flowGraphs";
            let file = null;
            for (let i = 0; i < this._graphConfig.length; ++i) {
                file = this._graphsDir.createFile();
                if (file) {
                    file.name = this._graphConfig[i]["name"];
                }
            }
        }
        // 获取流图配置
        getGraphConfig(name) {
            for (let graphCfg of this._graphConfig) {
                if (graphCfg["name"] == name)
                    return graphCfg;
            }
            return null;
        }
        preProcessConfig(config) {
            let children = new Array();
            let main = new Array();
            let graphs = JSON.parse(config);
            for (let graph of graphs) {
                let graphObj = JSON.parse(graph);
                if (graphObj["children_flow_graph_call"] && graphObj["children_flow_graph_return"]) {
                    children.push(graphObj);
                }
                else {
                    main.push(graphObj);
                }
            }
            return children.concat(main);
        }
        // 获取流图文件目录
        getDirectory(id) {
            if (id) {
                return this._graphsDir.getFile(id);
            }
            else {
                return this._graphsDir;
            }
        }
        loadGraph(graphObj) {
            let graphTemplate = new template.GraphTemplate(graphObj);
            if (this._graphs.has(graphTemplate.name))
                return;
            let graph = graphTemplate.createGraph();
            this._graphs.set(graph.name, graph);
        }
        // 获取所有流图
        getGraphs() {
            let arr = new Array();
            for (let graph of this._graphs.values()) {
                arr.push(graph);
            }
            return arr;
        }
        // 通过名称获取流图
        getGraph(name) {
            return this._graphs.get(name);
        }
        exist(name) {
            if (this._graphs.has(name)) {
                // 重复的名字
                return true;
            }
            return false;
        }
        setCurrent(graph) {
            this._curGraph = graph;
            managers.EventManager.getInstance().event(core.EventType.CHANGE_GRAPH);
        }
        getCurrent() {
            return this._curGraph;
        }
        changeCurrentName(newName) {
            this._graphs.delete(this._curGraph.name);
            this._curGraph.name = newName;
            this._graphs.set(newName, this._curGraph);
        }
        save(graph) {
            if (managers.DebugManager.getInstance().getDebug())
                return; // 调试状态无法保存
            if (graph)
                managers.ServerManager.getInstance().sendGraph(graph.toJson());
        }
        syncGraph(name) {
            let graph = this._graphs.get(name);
            if (!graph) {
                console.error("error: the current graph:" + name + " is null to save!!!");
            }
            else {
                managers.ServerManager.getInstance().sendGraph(graph.toJson());
            }
        }
        // 获取单例接口
        static getInstance() {
            if (!GraphManager._inst) {
                GraphManager._inst = new GraphManager();
            }
            return GraphManager._inst;
        }
    }
    managers.GraphManager = GraphManager;
})(managers || (managers = {}));
//# sourceMappingURL=GraphManager.js.map