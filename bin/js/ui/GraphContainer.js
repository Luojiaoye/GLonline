/**
* 流图容器
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var EventType = core.EventType;
    var Point = Laya.Point;
    var EndPoint = model.EndPoint;
    var EventManager = managers.EventManager;
    var GraphManager = managers.GraphManager;
    class GraphContainer extends Laya.Sprite {
        constructor() {
            super();
            this._nodeElements = null; // 节点元素列表
            this._connections = null; // 连线列表
            this._dragArea = null; // 拖动区域
            this._targetNode = null; // 目标节点
            this._startPos = null;
            this._endPos = null;
            this._tmpConectionView = null; // 可能的连线
            this._endPoint = null; // 连线的一个端点
            this._dragNodeView = null; // 当前拖动的节点
            this._nodesLayer = null; // 节点层
            this._linesLayer = null; // 线层
            this.zoom = 1.0;
            this.scaleValue = 1.0;
            this.initialize();
        }
        getNodesLayer() {
            return this._nodesLayer;
        }
        getLinesLayer() {
            return this._linesLayer;
        }
        initialize() {
            this._nodeElements = new Map();
            this._connections = new Array();
            this._variableElements = new Map();
            this._linesLayer = new Sprite();
            this.addChild(this._linesLayer);
            this._nodesLayer = new Sprite();
            this.addChild(this._nodesLayer);
            EventManager.getInstance().on(EventType.LINE_START, this, this.onLineStartHandler);
            EventManager.getInstance().on(EventType.LINE_END, this, this.onLineEndHandler);
            EventManager.getInstance().on(EventType.CLICK, this, this.dealClickHandler);
            EventManager.getInstance().on(EventType.DELETE_VARIABLE_VIEW, this, this.deleteVairableViewHandler);
            Laya.timer.frameLoop(1, this, this.postUpdate);
        }
        destory() {
            super.destroy(true);
            EventManager.getInstance().off(EventType.LINE_START, this, this.onLineStartHandler);
            EventManager.getInstance().off(EventType.LINE_END, this, this.onLineEndHandler);
            EventManager.getInstance().off(EventType.CLICK, this, this.dealClickHandler);
            EventManager.getInstance().off(EventType.DELETE_VARIABLE_VIEW, this, this.deleteVairableViewHandler);
            Laya.timer.clear(this, this.postUpdate);
        }
        deleteVairableViewHandler(variable) {
            if (!this.visible)
                return;
            if (!this._variableElements.has(variable))
                return;
            let varView = this._variableElements.get(variable);
            this.removeChild(varView);
            varView.destroy(true);
            this._variableElements.delete(variable);
        }
        createVariableView(variable, x, y) {
            if (this._variableElements.has(variable))
                return;
            let varView = new ui.VariableView();
            varView.x = x;
            varView.y = y;
            varView.on(Event.MOUSE_DOWN, this, this.onStartDrag);
            varView.name = "VariableView";
            varView.setData(variable);
            this._nodesLayer.addChild(varView);
            this._variableElements.set(variable, varView);
        }
        dealClickHandler(type) {
            if (!this.visible)
                return;
            if (core.ClickTargetType.Node != type && this._targetNode) {
                this.clearSelectStatus();
                this._targetNode = null;
            }
        }
        postUpdate() {
            if (GraphContainer.slotType) {
                let sX = this._startPos.x;
                let sY = this._startPos.y;
                let eX = this.mouseX;
                let eY = this.mouseY;
                let startPoint = new Point(sX, sY);
                let endPoint = new Point(eX, eY);
                endPoint = this.localToGlobal(endPoint);
                endPoint = this._linesLayer.globalToLocal(endPoint);
                let color = (GraphContainer.slotType == core.SlotType.ExecutionIn || GraphContainer.slotType == core.SlotType.ExecutionOut) ? "#008a5c " : "#ffb761";
                this._tmpConectionView.drawCurves(startPoint, endPoint, color);
            }
            if (this._dragNodeView) {
                for (let con of this._connections) {
                    if (con.data.relateToNode(this._dragNodeView.data.id)) {
                        // 刷新连线
                        con.update();
                    }
                }
            }
        }
        updateLines() {
            if (!this._connections)
                return;
            for (let con of this._connections) {
                // 刷新连线
                con.update();
            }
        }
        removeConectionHandler(asso) {
            if (!this.visible)
                return;
            if (this.data.associations) {
                let association = null;
                for (let i = 0; i < this.data.associations.length; ++i) {
                    association = this.data.associations[i];
                    if (association.equals(asso)) {
                        this.data.associations.splice(i, 1);
                        this.deleteConectionElement(association);
                        break;
                    }
                }
            }
        }
        onLineEndHandler(transform, slot) {
            if (!this.visible)
                return;
            GraphContainer.slotType = null;
            if (!transform) {
                this.destoryTempConectionView();
                return;
            }
            let ep = new EndPoint();
            ep.setNodeId(slot.getNodeId());
            ep.setSlotId(slot.getId());
            ep.transform = transform;
            if (this._endPoint && this._endPoint.getNodeId() != ep.getNodeId()) {
                let asso = this.data.createAssociation(ep, this._endPoint);
                if (!asso) {
                    console.error("error: can not create association slot name is:" + slot.getName());
                }
                else {
                    this.createConectionElement(asso);
                }
            }
            this.destoryTempConectionView();
        }
        destoryTempConectionView() {
            if (this._tmpConectionView) {
                this._tmpConectionView.clearLine();
                this._linesLayer.removeChild(this._tmpConectionView);
                this._tmpConectionView.destroy(true);
                this._tmpConectionView.offAll();
                this._tmpConectionView = null;
            }
        }
        onLineStartHandler(transform, slot) {
            if (!this.visible)
                return;
            this._startPos = transform.getAnchorPosition();
            GraphContainer.slotType = slot.getType();
            this._tmpConectionView = new ui.ConectionView();
            this._linesLayer.addChild(this._tmpConectionView);
            this._endPoint = new EndPoint();
            this._endPoint.setNodeId(slot.getNodeId());
            this._endPoint.setSlotId(slot.getId());
            this._endPoint.transform = transform;
        }
        setDragArea(area) {
            this._dragArea = area;
            //this._dragArea = new Rectangle(this.x, this.y, this.width, this.height);
        }
        clear() {
            for (let nodeView of this._nodeElements.values()) {
                this.removeChild(nodeView);
                nodeView.offAll();
                nodeView.destroy(true);
            }
            this._nodeElements.clear();
            let conectionView = null;
            while (this._connections.length > 0) {
                conectionView = this._connections.pop();
                this.removeChild(conectionView);
                conectionView.offAll();
                conectionView.destroy(true);
            }
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            this.clear();
            this.offAll();
        }
        setData(data) {
            if (!data)
                return;
            if (data.equals(this.data)) {
                return;
            }
            this.data = data;
            this.data.on(model.Model.UPDATE, this, this.update);
            this.update();
        }
        update() {
            if (!this.visible)
                return;
            this.clear();
            if (this.data.nodes) {
                for (let node of this.data.nodes.values()) {
                    this.createNodeElement(node);
                }
                for (let asso of this.data.associations) {
                    this.createConectionElement(asso);
                }
            }
        }
        createConectionElement(association) {
            let assoElement = new ui.ConectionView();
            let startNode = this._nodeElements.get(association.getStart().getNodeId());
            if (startNode)
                association.getStart().transform = startNode.getItem(association.getStart().getSlotId());
            else {
                console.error("error: startNode " + association.getStart().getNodeId() + " is null when set transform");
            }
            let endNode = this._nodeElements.get(association.getEnd().getNodeId());
            if (endNode)
                association.getEnd().transform = endNode.getItem(association.getEnd().getSlotId());
            else {
                console.error("error: endNode " + association.getEnd().getNodeId() + " is null when set transform");
            }
            assoElement.setAnchor(this._linesLayer);
            assoElement.setData(association);
            this._connections.push(assoElement);
            this._linesLayer.addChild(assoElement);
            this.updateTabStatus();
        }
        deleteConectionElement(association) {
            let conectionView = null;
            for (let i = 0; i < this._connections.length; ++i) {
                conectionView = this._connections[i];
                if (conectionView.data.equals(association)) {
                    this.removeChild(conectionView);
                    conectionView.offAll();
                    conectionView.destroy(true);
                    this._connections.splice(i, 1);
                }
            }
        }
        createNodeElement(node) {
            if (!node.id) {
                console.error("error: node id is undefined node name is:" + node.getName());
                return;
            }
            let nodeElement = new ui.NodeView();
            nodeElement.on(Event.MOUSE_DOWN, this, this.onStartDrag);
            nodeElement.name = "NodeView";
            nodeElement.on(Event.CLICK, this, this.onClickHandler);
            nodeElement.setAnchor(this._nodesLayer);
            nodeElement.setData(node);
            this._nodeElements.set(node.id, nodeElement);
            nodeElement.x = node.x;
            nodeElement.y = node.y;
            this._nodesLayer.addChild(nodeElement);
            this.updateTabStatus();
        }
        deleteNodeElement(node) {
            if (this._nodeElements.has(node.id)) {
                let elem = this._nodeElements.get(node.id);
                this.removeChild(elem);
                elem.offAll();
                elem.destroy(true);
                this._nodeElements.delete(node.id);
            }
            this.updateTabStatus();
        }
        onClickHandler(evt) {
            if (evt.currentTarget.name == "NodeView") {
                Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDownHandler);
                this._targetNode = evt.currentTarget;
                this.clearSelectStatus();
                this._targetNode.setSelect(true);
                evt.stopPropagation();
                EventManager.getInstance().event(EventType.CLICK, core.ClickTargetType.Node);
            }
        }
        clearSelectStatus() {
            for (let it of this._nodeElements.values()) {
                it.setSelect(false);
            }
        }
        onKeyDownHandler(evt, nodeView) {
            if (evt.keyCode == Laya.Keyboard.DELETE) {
                Laya.stage.off(Event.KEY_DOWN, this, this.onKeyDownHandler);
                if (this._targetNode) {
                    this.deleteNodeConectionElements(this._targetNode.data);
                    this.deleteNodeElement(this._targetNode.data);
                    this.data.deleteNode(this._targetNode.data);
                    this._targetNode = null;
                }
                this.clearSelectStatus();
            }
        }
        // 删掉节点连线
        deleteNodeConectionElements(node) {
            let badAssoArr = new Array();
            for (let con of this._connections) {
                if (con.data.relateToNode(node.id)) {
                    badAssoArr.push(con.data);
                }
            }
            // 删除
            for (let asso of badAssoArr) {
                this.deleteConectionElement(asso);
            }
            this.updateTabStatus();
        }
        updateTabStatus() {
            let graph = GraphManager.getInstance().getCurrent();
            if (graph)
                EventManager.getInstance().event(EventType.UPDATE_TAB_ITEM_STATUS, [graph.name, graph.name, true]);
        }
        onStartDrag(evt) {
            if (evt.currentTarget.name == "NodeView") {
                let nodeView = evt.currentTarget;
                this._dragNodeView = nodeView;
                //nodeView.startDrag(this._dragArea);
                nodeView.startDrag();
                nodeView.on(Event.MOUSE_UP, this, this.onStopDrag);
            }
            else if (evt.currentTarget.name == "VariableView") {
                let varView = evt.currentTarget;
                varView.startDrag();
                varView.on(Event.MOUSE_UP, this, this.onStopDrag);
            }
            else if (evt.target.name == "GraphContainerBgView") {
                this.lastX = this.x;
                this.lastY = this.y;
                this.startDrag();
                this._bgView.on(Event.MOUSE_UP, this, this.onStopDrag);
            }
            this.updateTabStatus();
            evt.stopPropagation();
        }
        onStopDrag(evt) {
            evt.target.off(Event.MOUSE_UP, this, this.onStopDrag);
            evt.target.stopDrag();
            if (evt.currentTarget.name == "NodeView") {
                if (this._dragNodeView) {
                    this._dragNodeView.data.x = this._dragNodeView.x;
                    this._dragNodeView.data.y = this._dragNodeView.y;
                    this._dragNodeView = null;
                }
            }
            else if (evt.target.name == "GraphContainerBgView") {
                this.stopDrag();
                this._bgView.drawBg();
                this._bgView.pos(this.x, this.y);
            }
        }
    }
    GraphContainer._MAX = 1.0;
    GraphContainer._MIN = 0.4;
    GraphContainer._SPEED = 0.05;
    ui.GraphContainer = GraphContainer;
})(ui || (ui = {}));
//# sourceMappingURL=GraphContainer.js.map