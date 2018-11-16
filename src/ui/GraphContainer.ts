/**
* 流图容器
* @author confiner
*/
module ui {
	import Rectangle = Laya.Rectangle;
	import Event = Laya.Event;
	import EventType = core.EventType;
	import Point = Laya.Point;
	import Slot = model.Slot;
	import EndPoint = model.EndPoint;
	import Association = model.Association;
	import EventManager = managers.EventManager;
	import Node = model.Node;
	import Graph = model.Graph;
	import GraphManager = managers.GraphManager;
	import Variable = model.Variable;

	export class GraphContainer extends Laya.Sprite implements core.IData {
		public static slotType: core.SlotType;	// 画线的开始插槽类型

		data: model.Graph;	// 流图
		private _nodeElements: Map<string, NodeView> = null;	// 节点元素列表
		private _connections: Array<ConectionView> = null;		// 连线列表
		private _variableElements: Map<Variable, VariableView>;			// 变量列表
		private _dragArea: Rectangle = null;	// 拖动区域
		private _targetNode: NodeView = null;	// 目标节点
		private _startPos: Point = null;
		private _endPos: Point = null;
		private _tmpConectionView: ConectionView = null;	// 可能的连线
		private _endPoint: EndPoint = null;	// 连线的一个端点
		private _dragNodeView: NodeView = null;	// 当前拖动的节点

		private _nodesLayer: Sprite = null;	// 节点层
		private _linesLayer: Sprite = null;	// 线层

		private _bgView: GraphContainerBgView;
		private static readonly _MAX: number = 1.0;
		private static readonly _MIN: number = 0.4;
		private static readonly _SPEED: number = 0.05;

		private zoom: number = 1.0;
		private scaleValue: number = 1.0;

		private lastX: number;
		private lastY: number;

		public getNodesLayer(): Sprite {
			return this._nodesLayer;
		}

		public getLinesLayer(): Sprite {
			return this._linesLayer;
		}

		constructor() {
			super();
			this.initialize();
		}

		private initialize(): void {
			this._nodeElements = new Map<string, NodeView>();
			this._connections = new Array<ConectionView>();
			this._variableElements = new Map<Variable, VariableView>();
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

		public destory(): void {
			super.destroy(true);
			EventManager.getInstance().off(EventType.LINE_START, this, this.onLineStartHandler);
			EventManager.getInstance().off(EventType.LINE_END, this, this.onLineEndHandler);
			EventManager.getInstance().off(EventType.CLICK, this, this.dealClickHandler);
			EventManager.getInstance().off(EventType.DELETE_VARIABLE_VIEW, this, this.deleteVairableViewHandler);

			Laya.timer.clear(this, this.postUpdate);
		}

		private deleteVairableViewHandler(variable: Variable): void {
			if (!this.visible)
				return;

			if (!this._variableElements.has(variable))
				return;

			let varView: VariableView = this._variableElements.get(variable);
			this.removeChild(varView);
			varView.destroy(true);
			this._variableElements.delete(variable);
		}

		public createVariableView(variable: Variable, x: number, y: number): void {
			if (this._variableElements.has(variable))
				return;

			let varView: VariableView = new VariableView();
			varView.x = x;
			varView.y = y;
			varView.on(Event.MOUSE_DOWN, this, this.onStartDrag);
			varView.name = "VariableView";
			varView.setData(variable);
			this._nodesLayer.addChild(varView);
			this._variableElements.set(variable, varView);
		}

		private dealClickHandler(type: core.ClickTargetType): void {
			if (!this.visible)
				return;

			if (core.ClickTargetType.Node != type && this._targetNode) {
				this.clearSelectStatus();
				this._targetNode = null;
			}
		}

		private postUpdate(): void {
			if (GraphContainer.slotType) {
				let sX: number = this._startPos.x;
				let sY: number = this._startPos.y;
				let eX: number = this.mouseX;
				let eY: number = this.mouseY;
				let startPoint: Point = new Point(sX, sY);
				let endPoint: Point = new Point(eX, eY);
				endPoint = this.localToGlobal(endPoint);
				endPoint = this._linesLayer.globalToLocal(endPoint);
				let color: string = (GraphContainer.slotType == core.SlotType.ExecutionIn || GraphContainer.slotType == core.SlotType.ExecutionOut) ? "#008a5c " : "#ffb761";
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

		private updateLines(): void {
			if (!this._connections)
				return;

			for (let con of this._connections) {
				// 刷新连线
				con.update();
			}
		}

		private removeConectionHandler(asso: Association): void {
			if (!this.visible)
				return;

			if (this.data.associations) {
				let association: Association = null;
				for (let i: number = 0; i < this.data.associations.length; ++i) {
					association = this.data.associations[i];
					if (association.equals(asso)) {
						this.data.associations.splice(i, 1);
						this.deleteConectionElement(association);
						break;
					}
				}
			}
		}

		private onLineEndHandler(transform: core.ITransform, slot: Slot): void {
			if (!this.visible)
				return;

			GraphContainer.slotType = null;
			if (!transform) {
				this.destoryTempConectionView();
				return;
			}

			let ep: EndPoint = new EndPoint();
			ep.setNodeId(slot.getNodeId());
			ep.setSlotId(slot.getId());
			ep.transform = transform;
			if (this._endPoint && this._endPoint.getNodeId() != ep.getNodeId()) {
				let asso: Association = this.data.createAssociation(ep, this._endPoint);
				if (!asso) {
					console.error("error: can not create association slot name is:" + slot.getName());
				}
				else {
					this.createConectionElement(asso);
				}
			}

			this.destoryTempConectionView();
		}

		private destoryTempConectionView(): void {
			if (this._tmpConectionView) {
				this._tmpConectionView.clearLine();
				this._linesLayer.removeChild(this._tmpConectionView);
				this._tmpConectionView.destroy(true);
				this._tmpConectionView.offAll();
				this._tmpConectionView = null;
			}
		}

		private onLineStartHandler(transform: core.ITransform, slot: Slot): void {
			if (!this.visible)
				return;

			this._startPos = transform.getAnchorPosition();
			GraphContainer.slotType = slot.getType();
			this._tmpConectionView = new ConectionView();
			this._linesLayer.addChild(this._tmpConectionView);
			this._endPoint = new EndPoint();
			this._endPoint.setNodeId(slot.getNodeId());
			this._endPoint.setSlotId(slot.getId());
			this._endPoint.transform = transform;
		}

		public setDragArea(area: Rectangle): void {
			this._dragArea = area;
			//this._dragArea = new Rectangle(this.x, this.y, this.width, this.height);
		}

		private clear(): void {
			for (let nodeView of this._nodeElements.values()) {
				this.removeChild(nodeView);
				nodeView.offAll();
				nodeView.destroy(true);
			}
			this._nodeElements.clear();

			let conectionView: ConectionView = null;
			while (this._connections.length > 0) {
				conectionView = this._connections.pop();
				this.removeChild(conectionView);
				conectionView.offAll();
				conectionView.destroy(true);
			}
		}

		public destroy(destroyChild?: boolean): void {
			super.destroy(destroyChild);
			this.clear();
			this.offAll();
		}

		setData(data: model.Graph): void {
			if (!data)
				return;

			if (data.equals(this.data)) {
				return;
			}

			this.data = data;
			this.data.on(model.Model.UPDATE, this, this.update);
			this.update();
		}

		private update(): void {
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

		private createConectionElement(association: Association): void {
			let assoElement: ConectionView = new ConectionView();
			let startNode: NodeView = this._nodeElements.get(association.getStart().getNodeId());
			if (startNode)
				association.getStart().transform = startNode.getItem(association.getStart().getSlotId());
			else {
				console.error("error: startNode " + association.getStart().getNodeId() + " is null when set transform");
			}

			let endNode: NodeView = this._nodeElements.get(association.getEnd().getNodeId());
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



		private deleteConectionElement(association: Association): void {
			let conectionView: ConectionView = null;
			for (let i: number = 0; i < this._connections.length; ++i) {
				conectionView = this._connections[i];
				if (conectionView.data.equals(association)) {
					this.removeChild(conectionView);
					conectionView.offAll();
					conectionView.destroy(true);
					this._connections.splice(i, 1);
				}
			}
		}

		private createNodeElement(node: model.Node): void {
			if (!node.id) {
				console.error("error: node id is undefined node name is:" + node.getName());
				return;
			}
			let nodeElement: NodeView = new NodeView();
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

		private deleteNodeElement(node: model.Node): void {
			if (this._nodeElements.has(node.id)) {
				let elem: NodeView = this._nodeElements.get(node.id);
				this.removeChild(elem);
				elem.offAll();
				elem.destroy(true);
				this._nodeElements.delete(node.id);
			}

			this.updateTabStatus();
		}

		private onClickHandler(evt: Event): void {
			if (evt.currentTarget.name == "NodeView") {
				Laya.stage.on(Event.KEY_DOWN, this, this.onKeyDownHandler);
				this._targetNode = evt.currentTarget as NodeView;
				this.clearSelectStatus();
				this._targetNode.setSelect(true);
				evt.stopPropagation();
				EventManager.getInstance().event(EventType.CLICK, core.ClickTargetType.Node);
			}
		}

		private clearSelectStatus(): void {
			for (let it of this._nodeElements.values()) {
				it.setSelect(false);
			}
		}

		private onKeyDownHandler(evt: Event, nodeView: NodeView): void {
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
		private deleteNodeConectionElements(node: Node): void {
			let badAssoArr: Array<Association> = new Array<Association>();
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

		private updateTabStatus(): void {
			let graph: Graph = GraphManager.getInstance().getCurrent();
			if (graph)
				EventManager.getInstance().event(EventType.UPDATE_TAB_ITEM_STATUS, [graph.name, graph.name, true]);
		}

		private onStartDrag(evt: Event): void {
			if (evt.currentTarget.name == "NodeView") {
				let nodeView: NodeView = evt.currentTarget as NodeView;
				this._dragNodeView = nodeView;
				//nodeView.startDrag(this._dragArea);
				nodeView.startDrag();
				nodeView.on(Event.MOUSE_UP, this, this.onStopDrag);
			}
			else if (evt.currentTarget.name == "VariableView") {
				let varView: VariableView = evt.currentTarget as VariableView;
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

		private onStopDrag(evt: Event): void {
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
}