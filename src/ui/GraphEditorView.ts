/**
* 流图编辑窗口
* @author confiner
*/
module ui
{
	import EventManager = managers.EventManager;
	import EventType = core.EventType;
	import GraphManager = managers.GraphManager;
	import Rectangle = Laya.Rectangle;
	import Event = Laya.Event;
	import IData = core.IData;
	import Variable = model.Variable;

	export class GraphEditorView extends Editor.GraphEditorViewUI implements IData
	{
		private _graphContainer:GraphContainer;
		private _viewport:Laya.Panel;
		public static _VIEW_PORT:Laya.Point = new Laya.Point(0, 0);//new Rectangle((1620 - 152) / 2, (900 -152) / 2, 152, 152);

		private static readonly _MAX:number = 1.0;
		private static readonly _MIN:number = 0.4;
		private static readonly _SPEED:number = 0.05;

		private zoom:number = 1.0;

		data:string;

		setData(data:string):void
		{
			this.data = data;
			this.update();
		}

		private update():void
		{
			if(!this.data)
				return;

			let graph:model.Graph = GraphManager.getInstance().getGraph(this.data);
			if(!graph)
			{
				console.error("error: graph:" + this.data + " is not exist!");
				return;
			}
			
			this._graphContainer.setData(graph);
		}

		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this.name = "EditorView";
			
			this._viewport = new Laya.Panel();
			this.addChild(this._viewport);
			this._graphContainer = new ui.GraphContainer();
			this._viewport.addChild(this._graphContainer);
			this.onResizeHandler();
			this.addEvents();
		}

		private onDebugHandler():void
		{
			
		}

		private addEvents():void
		{
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

		private onResizeHandler():void{
			this.bg.width = window.innerWidth - 303;
			this.bg.height = window.innerHeight - 105;
			this.width = this.bg.width;
			this.height = this.bg.height;
			this._viewport.size(this.width, this.height);
			GraphEditorView._VIEW_PORT.x = this.width;
			GraphEditorView._VIEW_PORT.y = this.height;
			this._graphContainer.setDragArea(new Rectangle(0, 0, this.width, this.height));
		}

		private onLeftMouseUpHandler():void{
			EventManager.getInstance().event(EventType.LINE_END, [null, null]);
		}

		private check():void{
			if(!(this.mouseX > this.x && this.mouseX < this.x + this.width && this.mouseY > this.y && this.mouseY < this.y + this.height))
				this._graphContainer.stopDrag();
		}

		public destroy(destroyChild?:boolean):void
		{
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

		private onZoomHandler(evt:Event):void
		{
			let delta:number = evt.delta * GraphEditorView._SPEED;
			this.zoom += delta;
			this.zoom = Math.min(this.zoom, GraphEditorView._MAX);
			this.zoom = Math.max(this.zoom, GraphEditorView._MIN);	
		
			this._graphContainer.scale(this.zoom, this.zoom);
		}

		private onStartDrag(evt:Event):void
		{
			EventManager.getInstance().event(core.EventType.Reset_Texure);
			this._graphContainer.startDrag();
		}

		private onClickHandler(evt:Event):void
		{
			EventManager.getInstance().event(EventType.CLICK, core.ClickTargetType.Window);
		}

		private onMouseUpHandler(evt:Event):void
		{
			this._graphContainer.stopDrag();
		}

		private addVarViewHandler(variable:Variable, x:number, y:number):void
		{
			if(!this.visible)
				return;

			if(!this._graphContainer)
			{
				console.error("error: graph contianer is null when create variable view!!");
			}
			else
			{
				let pos:Laya.Point = new Laya.Point(x, y);
				pos = this._graphContainer.getNodesLayer().globalToLocal(pos);
				this._graphContainer.createVariableView(variable, pos.x, pos.y);
			}
		}

		private addCustomNodeHandler(custom:model.Custom, x:number, y:number):void
		{
			if(!this.visible)
				return;

			if(!this._graphContainer)
			{
				console.error("error: graph contianer is null when add variable node!!");
			}
			else
			{
				let node:model.Node = custom.createCustomNode();
				let pos:Laya.Point = new Laya.Point(x, y);
				pos = this._graphContainer.getNodesLayer().globalToLocal(pos);
				node.x = pos.x;
				node.y = pos.y;
				let graph:model.Graph = this._graphContainer.data;
				if(graph)
				{
					graph.addNode(node);
					this._graphContainer.setData(graph);
				}
				else
				{
					console.error("error: the current graph not exist!");
				}
			}
		}

		private addVariableNodeHandler(isGet:boolean, variable:Variable, x:number, y:number):void
		{
			if(!this.visible)
				return;

			if(!this._graphContainer)
			{
				console.error("error: graph contianer is null when add variable node!!");
			}
			else
			{
				let node:model.Node = isGet ? variable.createGetNode() : variable.createSetNode();
				node.x = x;
				node.y = y;
				let graph:model.Graph = this._graphContainer.data;
				if(graph)
				{
					graph.addNode(node);
					this._graphContainer.setData(graph);
				}
				else
				{
					console.error("error: the current graph not exist!");
				}
			}
		}	

		private addNodeHandler(nodeTempalteName:string, x:number, y:number):void
		{
			if(!this.visible)
				return;

			let nodeTemplate:template.NodeTemplate = managers.NodeManager.getInstance().getNodeTemplate(nodeTempalteName);
			if(!nodeTemplate)
			{
				console.error("error: this node template name:" + nodeTempalteName + " not exist!");
			}
			else
			{
				let node:model.Node = nodeTemplate.createNode();
				let pos:Laya.Point = new Laya.Point(x, y);
				pos = this._graphContainer.getNodesLayer().globalToLocal(pos);
				node.x = pos.x;
				node.y = pos.y;
				let graph:model.Graph = this._graphContainer.data;
				if(graph)
				{
					graph.addNode(node);
					this._graphContainer.setData(graph);
				}
				else
				{
					console.error("error: the current graph not exist!");
				}
			}
		}
	}
}