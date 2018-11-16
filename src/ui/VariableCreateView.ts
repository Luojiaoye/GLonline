/**
* 变量创建界面
* @author confiner 
*/
module ui
{
	import IData = core.IData;
	import Variable = model.Variable;
	import Event = Laya.Event;
	import EventType = core.EventType;
	import EventManager = managers.EventManager;
	import Graph = model.Graph;
	import GraphManager = managers.GraphManager;
	import Label = Laya.Label;
	import Rectangle = Laya.Rectangle;

	export class VariableCreateView extends Editor.VariableCreateViewUI implements IData, core.IContent
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
			this.addVariable();
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
			this.list_varibles.visible = false;
			this.img_bg.visible = false;
			this.height = 0;
		}

		private update():void
		{
			this.clear();

			if(!this.data || !this.data.variables || this.data.variables.length == 0)
			{
				return;
			}

			this.list_varibles.visible = true;
			this.list_varibles.height = this.data.variables.length * 29;
			this.list_varibles.repeatY = this.data.variables.length;
			this.list_varibles.array = this.data.variables;
			this.img_bg.visible = true;
			this.height = this.img_bg.height = this.list_varibles.y + this.list_varibles.height + 15;
			managers.EventManager.getInstance().event(core.EventType.Content_Menu_UPDATE);
		}

		private addVariable():void
		{
			if(this.data)
				this.data.createVariable();
		}

		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this.createDragRegion();

			this.list_varibles.visible = false;
			this.img_bg.visible = false;

			this.list_varibles.mouseHandler = new Handler(this, this.onMouseHandler);
			this.list_varibles.renderHandler = new Handler(this, this.renderHandler);

			EventManager.getInstance().on(core.EventType.CHANGE_GRAPH, this, this.onChangeGraphHandler);
			managers.EventManager.getInstance().on(core.EventType.DELETE_TAB_ITEM, this, this.clear);
		}

		public destroy(destroyChild?:boolean):void
		{
			EventManager.getInstance().off(core.EventType.CHANGE_GRAPH, this, this.onChangeGraphHandler);
			managers.EventManager.getInstance().off(core.EventType.DELETE_TAB_ITEM, this, this.clear);
			super.destroy(destroyChild);
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

		private onMouseHandler(evt:Event, index:number):void
		{
			let target:VariableCreateViewItem = evt.currentTarget as VariableCreateViewItem;
			if(!target)
				return;

			if(evt.type == Event.MOUSE_DOWN)
			{
				let variable:Variable = target.data;
				if(variable)
				{
					// 叶子节点
					let item:Label = new Label();
					item.color = "#b5b5b5";
					item.fontSize = 16;
					item.text = variable.getName();
					item.width = target.width;
					item.height = target.height;
					item.x = evt.stageX;
					item.y = evt.stageY;
					Laya.stage.addChild(item);
					item.startDrag(this._dragRegion);
					Laya.stage.on(Event.MOUSE_UP, this, this.onStageMouseUp, [variable, item]);
				}
			}
		}

		private onStageMouseUp(variable:Variable, item:Label, evt:Event):void
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
				EventManager.getInstance().event(EventType.ADD_VARIABLE_VIEW, [variable, item.x, item.y]);
			}
			Laya.stage.off(Event.MOUSE_UP, this, this.onStageMouseUp);
			item.destroy();
			item = null;
		}

		private renderHandler(item:VariableCreateViewItem, index:number):void
		{
			let variable:Variable = item.dataSource as Variable;
			item.setData(variable);
		}
	}
}