/**
* 流图编辑窗口
* @author confiner
*/
var ui;
(function (ui) {
    var EventManager = managers.EventManager;
    var EventType = core.EventType;
    var GraphManager = managers.GraphManager;
    var Rectangle = Laya.Rectangle;
    var Event = Laya.Event;
    class GraphEditorView extends ui.Editor.GraphEditorViewUI {
        constructor() {
            super();
            this.zoom = 1.0;
            this.init();
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
            if (!this.data)
                return;
            let graph = GraphManager.getInstance().getGraph(this.data);
            if (!graph) {
                console.error("error: graph:" + this.data + " is not exist!");
                return;
            }
            this._graphContainer.setData(graph);
        }
        init() {
            this.name = "EditorView";
            this._viewport = new Laya.Panel();
            this.addChild(this._viewport);
            this._graphContainer = new ui.GraphContainer();
            this._viewport.addChild(this._graphContainer);
            this.onResizeHandler();
            this.addEvents();
        }
        onDebugHandler() {
        }
        addEvents() {
            EventManager.getInstance().on(EventType.ADD_NODE, this, this.addNodeHandler);
            EventManager.getInstance().on(EventType.ADD_VARIABLE_VIEW, this, this.addVarViewHandler);
            EventManager.getInstance().on(EventType.ADD_VARIABLE_GET, this, this.addVariableNodeHandler, [true]);
            EventManager.getInstance().on(EventType.ADD_VARIABLE_SET, this, this.addVariableNodeHandler, [false]);
            EventManager.getInstance().on(EventType.ADD_CUSTOM_NODE, this, this.addCustomNodeHandler);
            EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.onDebugHandler);
            this.on(Event.RIGHT_MOUSE_DOWN, this, this.onStartDrag);
            this.on(Event.RIGHT_MOUSE_UP, this, this.onMouseUpHandler);
            this.on(Event.MOUSE_UP, this, this.onLeftMouseUpHandler);
            this.on(Event.CLICK, this, this.onClickHandler);
            this.on(Event.MOUSE_WHEEL, this, this.onZoomHandler);
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);
            Laya.timer.frameLoop(10, this, this.check);
        }
        onResizeHandler() {
            this.bg.width = window.innerWidth - 303;
            this.bg.height = window.innerHeight - 105;
            this.width = this.bg.width;
            this.height = this.bg.height;
            this._viewport.size(this.width, this.height);
            GraphEditorView._VIEW_PORT.x = this.width;
            GraphEditorView._VIEW_PORT.y = this.height;
            this._graphContainer.setDragArea(new Rectangle(0, 0, this.width, this.height));
        }
        onLeftMouseUpHandler() {
            EventManager.getInstance().event(EventType.LINE_END, [null, null]);
        }
        check() {
            if (!(this.mouseX > this.x && this.mouseX < this.x + this.width && this.mouseY > this.y && this.mouseY < this.y + this.height))
                this._graphContainer.stopDrag();
        }
        destroy(destroyChild) {
            this._graphContainer.destory();
            super.destroy(destroyChild);
            this._graphContainer = null;
            this.off(Event.RIGHT_MOUSE_DOWN, this, this.onStartDrag);
            this.off(Event.RIGHT_MOUSE_UP, this, this.onMouseUpHandler);
            this.off(Event.MOUSE_UP, this, this.onLeftMouseUpHandler);
            this.off(Event.CLICK, this, this.onClickHandler);
            this.off(Event.MOUSE_WHEEL, this, this.onZoomHandler);
            this.offAll();
            Laya.timer.clear(this, this.check);
            this.off(Event.MOUSE_UP, this, this.onLeftMouseUpHandler);
            Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
            EventManager.getInstance().off(EventType.ADD_NODE, this, this.addNodeHandler);
            EventManager.getInstance().off(EventType.ADD_VARIABLE_VIEW, this, this.addVarViewHandler);
            EventManager.getInstance().off(EventType.ADD_VARIABLE_GET, this, this.addVariableNodeHandler);
            EventManager.getInstance().off(EventType.ADD_VARIABLE_SET, this, this.addVariableNodeHandler);
            EventManager.getInstance().off(EventType.ADD_CUSTOM_NODE, this, this.addCustomNodeHandler);
            EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.onDebugHandler);
        }
        onZoomHandler(evt) {
            let delta = evt.delta * GraphEditorView._SPEED;
            this.zoom += delta;
            this.zoom = Math.min(this.zoom, GraphEditorView._MAX);
            this.zoom = Math.max(this.zoom, GraphEditorView._MIN);
            this._graphContainer.scale(this.zoom, this.zoom);
        }
        onStartDrag(evt) {
            EventManager.getInstance().event(core.EventType.Reset_Texure);
            this._graphContainer.startDrag();
        }
        onClickHandler(evt) {
            EventManager.getInstance().event(EventType.CLICK, core.ClickTargetType.Window);
        }
        onMouseUpHandler(evt) {
            this._graphContainer.stopDrag();
        }
        addVarViewHandler(variable, x, y) {
            if (!this.visible)
                return;
            if (!this._graphContainer) {
                console.error("error: graph contianer is null when create variable view!!");
            }
            else {
                let pos = new Laya.Point(x, y);
                pos = this._graphContainer.getNodesLayer().globalToLocal(pos);
                this._graphContainer.createVariableView(variable, pos.x, pos.y);
            }
        }
        addCustomNodeHandler(custom, x, y) {
            if (!this.visible)
                return;
            if (!this._graphContainer) {
                console.error("error: graph contianer is null when add variable node!!");
            }
            else {
                let node = custom.createCustomNode();
                let pos = new Laya.Point(x, y);
                pos = this._graphContainer.getNodesLayer().globalToLocal(pos);
                node.x = pos.x;
                node.y = pos.y;
                let graph = this._graphContainer.data;
                if (graph) {
                    graph.addNode(node);
                    this._graphContainer.setData(graph);
                }
                else {
                    console.error("error: the current graph not exist!");
                }
            }
        }
        addVariableNodeHandler(isGet, variable, x, y) {
            if (!this.visible)
                return;
            if (!this._graphContainer) {
                console.error("error: graph contianer is null when add variable node!!");
            }
            else {
                let node = isGet ? variable.createGetNode() : variable.createSetNode();
                node.x = x;
                node.y = y;
                let graph = this._graphContainer.data;
                if (graph) {
                    graph.addNode(node);
                    this._graphContainer.setData(graph);
                }
                else {
                    console.error("error: the current graph not exist!");
                }
            }
        }
        addNodeHandler(nodeTempalteName, x, y) {
            if (!this.visible)
                return;
            let nodeTemplate = managers.NodeManager.getInstance().getNodeTemplate(nodeTempalteName);
            if (!nodeTemplate) {
                console.error("error: this node template name:" + nodeTempalteName + " not exist!");
            }
            else {
                let node = nodeTemplate.createNode();
                let pos = new Laya.Point(x, y);
                pos = this._graphContainer.getNodesLayer().globalToLocal(pos);
                node.x = pos.x;
                node.y = pos.y;
                let graph = this._graphContainer.data;
                if (graph) {
                    graph.addNode(node);
                    this._graphContainer.setData(graph);
                }
                else {
                    console.error("error: the current graph not exist!");
                }
            }
        }
    }
    GraphEditorView._VIEW_PORT = new Laya.Point(0, 0); //new Rectangle((1620 - 152) / 2, (900 -152) / 2, 152, 152);
    GraphEditorView._MAX = 1.0;
    GraphEditorView._MIN = 0.4;
    GraphEditorView._SPEED = 0.05;
    ui.GraphEditorView = GraphEditorView;
})(ui || (ui = {}));
//# sourceMappingURL=GraphEditorView.js.map