/**
* 变量创建界面
* @author confiner 
*/
module ui
{
	import IData = core.IData;
	import Event = Laya.Event;
	import EventType = core.EventType;
	import EventManager = managers.EventManager;
	import Graph = model.Graph;
	import GraphManager = managers.GraphManager;
	import Label = Laya.Label;
	import Rectangle = Laya.Rectangle;

	export class CustomCreateView extends Editor.CustomCreateViewUI implements IData, core.IContent
	{
		data:model.Graph;
		private _dragRegion:Rectangle;

		setData(data:model.Graph):void
		{
			this.data = data;
			this.update();
			this.data.on(model.Model.UPDATE, this, this.update);
		}

		public add():void
		{
			this.addCustom();
		}

		public switcher(data:model.ContentMenuItemData):void
		{
			this.visible = data.open;
			data.height = data.open ? this.height : 0;
		}

		public getContent():Laya.Sprite
		{
			return this;
		}

		private clear():void
		{
			this.list_customs.visible = false;
			this.img_bg.visible = false;
		}

		private update():void
		{
			this.clear();

			if(!this.data || !this.data.customs || this.data.customs.length == 0)
			{
				return;
			}

			this.list_customs.height = this.data.customs.length * 29;
			this.list_customs.visible = true;
			this.list_customs.array = this.data.customs;
			this.list_customs.repeatY = this.data.customs.length;
			this.img_bg.visible = true;
			this.img_bg.height = this.list_customs.y + this.data.customs.length * 29 + 15;
			this.height = this.img_bg.height;
	}

		private addCustom():void
		{
			let graph:Graph = GraphManager.getInstance().getCurrent();
			if(!graph)
			{
				console.error("error: the current graph is null when add variable");
			}
			else
			{
				graph.createCustom();
			}
		}

		constructor()
		{
			super();

			this.init();
		}

		private init():void
		{
			this.createDragRegion();

			this.img_bg.visible = false;
			this.list_customs.visible = false;

			this.list_customs.renderHandler = new Handler(this, this.renderHandler);
			this.list_customs.mouseHandler = new Handler(this, this.onMouseClick);
			EventManager.getInstance().on(core.EventType.CHANGE_GRAPH, this, this.onChangeGraphHandler);
		}

		private createDragRegion():void
		{
			let pos:Laya.Point = new Laya.Point(this.x, this.y);
			pos = this.localToGlobal(pos);
			this._dragRegion = new Rectangle(0, 160, 1920, 920);
		}

		private onChangeGraphHandler():void
		{
			let graph:Graph = GraphManager.getInstance().getCurrent();
			if(graph)
			{
				this.setData(graph);
			}
		}

		private onMouseClick(evt:Event, index:number):void
		{
			let target:CustomCreateViewItem = evt.currentTarget as CustomCreateViewItem;
			if(target && evt.type == Event.MOUSE_DOWN)
			{
				let custom:model.Custom = target.data;
				if(custom)
				{
					// 叶子节点
					let item:Label = new Label();
					item.color = "#b5b5b5";
					item.fontSize = 16;
					item.text = custom.getName();
					item.width = target.width;
					item.height = target.height;
					item.x = evt.stageX;
					item.y = evt.stageY;
					Laya.stage.addChild(item);
					item.startDrag(this._dragRegion);
					Laya.stage.on(Event.MOUSE_UP, this, this.onStageMouseUp, [custom, item]);
				}
			}
		}

		private onStageMouseUp(custom:model.Custom, item:Label, evt:Event):void
		{
			let pos:Laya.Point = new Laya.Point(this.x, this.y);
			pos = this.localToGlobal(pos);
			if(!this._dragRegion.contains(item.x, item.y))
			{
				// 不在拖动区域内则不处理
			}
			else if(item.x < pos.x + this.width)
			{
				// 落在节点列表不生成节点
				
			}
			else
			{
				EventManager.getInstance().event(EventType.ADD_CUSTOM_NODE, [custom, item.x, item.y]);
			}
			Laya.stage.off(Event.MOUSE_UP, this, this.onStageMouseUp);
			item.destroy();
			item = null;
		}

		private renderHandler(item:CustomCreateViewItem, index:number):void
		{
			let custom:model.Custom = item.dataSource as model.Custom;
			item.setData(custom);
		}
	}
}