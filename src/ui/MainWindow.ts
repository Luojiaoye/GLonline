/**
* name 主窗口界面
*/
module ui{
	import Rectangle = Laya.Rectangle;
	import EventType = core.EventType;
	import Point = Laya.Point;
	import Event = Laya.Event;
	import SlotType = core.SlotType;
	import IItem = core.IItem;
	import ServerManager = managers.ServerManager;
	import IData = core.IData;
	import GraphManager = managers.GraphManager;
	import EventManager = managers.EventManager;
	import NodeManager = managers.NodeManager;
	import MenuType = core.MenuType;
	import NavigatorData = model.NavigatorData;
	import GraphTabItemData = model.GraphTabItemData;
	import Graph = model.Graph;
	import Variable = model.Variable;

	export class MainWindow extends Editor.MainWindowUI
	{
		private _graphView:GraphsView = null;
		private _dragRegion:Laya.Rectangle = null;
		private _menuView:MenuView;
		private _navigatorView:FileNavigatorView;
		private _tabView:GraphTabView;
		private _tabContents:Map<string, GraphEditorView>;
		private _tabContainer:Sprite;
		private _leftView:LeftContentView;
		private _rightView:RightContentView;
		private _debugOperationView:DebugOpeationView;
		private _debugStackView:DebugStackView;


		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this.name = "MainWindow";

			this._tabContents = new Map<string, GraphEditorView>();

			this._leftView = new LeftContentView();
			this.addChild(this._leftView);

			this._tabContainer = new Sprite();
			this._tabContainer.pos(303, 105);
			this.addChild(this._tabContainer);

			this._tabView = new GraphTabView();
			this.addChild(this._tabView);

			this._rightView = new RightContentView();
			this.addChild(this._rightView);
			this._rightView.visible = false;

			this._debugOperationView = new DebugOpeationView();
			this.addChild(this._debugOperationView);
			this._debugOperationView.visible = false;

			this._debugStackView = new DebugStackView();
			this.addChild(this._debugStackView);
			this._debugStackView.visible = false;

			this.btn_file.on(Event.CLICK, this, this.onMouseHandler);
			Laya.stage.on(Event.CLICK, this, this.onMouseHandler);

			this.removeChild(this.img_last);
			this.addChild(this.img_last);
			this.onResizeHandler();

			EventManager.getInstance().on(EventType.OPEN_NAVIGATOR, this, this.onOpenNavigatorHandler);
			EventManager.getInstance().on(EventType.CHANGE_TAB, this, this.changeTabHandler);
			EventManager.getInstance().on(EventType.DELETE_TAB_ITEM, this, this.deleteTabHandler);
			EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.onDebugResultHandler);
			Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onKeyDownHandler);
			Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);
		}

		private onResizeHandler():void{
			this.img_last.width = window.innerWidth;
			this.bg.width = window.innerWidth;
			this.bg.height = window.innerHeight - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).y;
		}

		public destroy(destoryChild:boolean):void{
			super.destroy(destoryChild);
			Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
		}

		private onDebugResultHandler():void
		{
			let graphDebugInfo:model.GraphDebugInfo = managers.DebugManager.getInstance().getCurrent();
			if(graphDebugInfo)
			{
				let data:GraphTabItemData = new GraphTabItemData();
				data.name = graphDebugInfo.getName();
				data.cache = false;
				EventManager.getInstance().event(EventType.ADD_TAB_ITEM, [data]);
			}
		}

		private onKeyDownHandler(evt:Laya.Event):void
		{
			if(evt.keyCode == Laya.Keyboard.F6)
			{
				managers.DebugManager.getInstance().debugEntry();
				this._debugOperationView.visible = true;
				this._debugStackView.visible = true;
			}
			else if(evt.keyCode == Laya.Keyboard.F10)
			{
				managers.DebugManager.getInstance().debugNext();
			}
		}

		private onDebugOperationHandler(operationType:string):void
		{
			if(operationType == core.DebugType.DebugExit.toString())
			{
				this._debugStackView.visible = false;
				this._debugOperationView.visible = false;
			}
		}

		private deleteTabHandler(item:GraphTabItemData):void
		{
			managers.DebugManager.getInstance().deleteGraphBreapoints(item.name);
			if(this._tabContents.has(item.name))
			{
				let tabView:GraphEditorView = this._tabContents.get(item.name);
				this._tabContainer.removeChild(tabView);
				tabView.destroy(true);
				this._tabContents.delete(item.name);
				tabView = null;
			}
		}

		private changeTabHandler(data:GraphTabItemData):void
		{
			let graph:Graph = GraphManager.getInstance().getGraph(data.name);
			GraphManager.getInstance().setCurrent(graph);

			this.clearTabContainer();

			let editorView:GraphEditorView = this._tabContents.get(data.name);
			if(!editorView)
			{
				let exist:boolean = GraphManager.getInstance().exist(data.name);
				if(!exist)
				{
					console.error("error: graph:" + data.name + " not created");
					return;
				}
				editorView = this.createGraphEditorView(data.name);
			}
			editorView.visible = true;
			
			EventManager.getInstance().event(EventType.SELECT_TAB_ITEM, [data.name]);
		}

		private clearTabContainer():void
		{
			for(let view of this._tabContents.values())
			{
				view.visible = false;
			}
		}

		private createGraphEditorView(name:string):GraphEditorView
		{
			let editorView:GraphEditorView = new ui.GraphEditorView();
			this._tabContainer.addChild(editorView);
			editorView.setData(name);
			this._tabContents.set(name, editorView);
			return editorView;
		}

		private onOpenNavigatorHandler(type:MenuType):void
		{
			let navigator:NavigatorData = new NavigatorData();
			navigator.type = type;
			navigator.directory = GraphManager.getInstance().getDirectory();

			if(!this._navigatorView)
			{
				this._navigatorView = new FileNavigatorView();
				this.addChild(this._navigatorView);
			}

			this._navigatorView.pos((this.width - this._navigatorView.width) >> 1, (this.height - this._navigatorView.height) >> 1);
			if(!this._navigatorView.visible)
				this._navigatorView.visible = true;

			this._navigatorView.setData(navigator);
		}

		private onMouseHandler(evt:Event):void
		{
			if(evt.type != Event.CLICK)
				return;

			if(evt.currentTarget.name == "file")
			{
				if(!this._menuView)
				{
					this._menuView = new MenuView();
					this._menuView.x = 225;
					this._menuView.y = 50;
					let data:Array<MenuType> = [MenuType.New, MenuType.Open, MenuType.Save];
					this._menuView.setData(data);
					this.addChild(this._menuView);
					this._menuView.visible = false;
				}

				this._menuView.visible = !this._menuView.visible;
				evt.stopPropagation();
			}
			else
			{
				if(this._menuView)
					this._menuView.visible = false;
			}
		}

		private onClick(evt:Laya.Event):void
		{
			if(this._menuView)
				this._menuView.visible = false;
		}
	}
}