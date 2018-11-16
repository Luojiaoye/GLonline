/**
* GraphTabView
* @author confiner
*/
module ui
{
	import IData = core.IData;
	import GraphTabItemData = model.GraphTabItemData;
	import EventManager = managers.EventManager;
	import EventType = core.EventType;
	import Event = Laya.Event;
	import Graph = model.Graph;
	import GraphManager = managers.GraphManager;

	export class GraphTabView extends Editor.GraphTabViewUI implements IData
	{
		data:Array<GraphTabItemData>;

		setData(data:Array<GraphTabItemData>):void
		{
			this.data = data;
			this.update();
		}

		private update():void
		{
			if(!this.data)
				return;

			this.list_menu.visible = true;
			this.list_menu.repeatX = this.data.length;
			this.list_menu.array = this.data;
			this.list_menu.renderHandler = new Handler(this, this.onRenderHandler);
			this.list_menu.selectHandler = new Handler(this, this.onSelectHandler);
			this.btn_add.x = this.list_menu.x + this.list_menu.array.length * 178 + 20;
		}
		
		private onSelectHandler(index:number):void
		{
			let item:GraphTabViewItem = this.list_menu.getCell(index) as GraphTabViewItem;
			if(item)
				item.setSelect(true);
		}

		private onRenderHandler(item:GraphTabViewItem, index:number):void
		{
			let data:GraphTabItemData = item.dataSource;
			item.setData(data);
		}

		constructor()
		{
			super();

			this.init();
		}

		private init():void
		{
			this.list_menu.visible = false;
			EventManager.getInstance().on(EventType.ADD_TAB_ITEM, this, this.addItem);
			EventManager.getInstance().on(EventType.DELETE_TAB_ITEM, this, this.deleteItem);
			this.onResizeHandler();
			Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);

			this.btn_add.on(Event.CLICK, this, this.onAddFile);
		}

		private onResizeHandler():void{
			this.bg.width = window.innerWidth - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).x;
		}

		public destroy(destroyChild:boolean):void{
			super.destroy(destroyChild);
			Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
			EventManager.getInstance().off(EventType.ADD_TAB_ITEM, this, this.addItem);
			EventManager.getInstance().off(EventType.DELETE_TAB_ITEM, this, this.deleteItem);
			this.btn_add.off(Event.CLICK, this, this.onAddFile);
		}

		private onAddFile(evt:Event):void
		{
			if(evt.currentTarget == this.btn_add)
			{
				let graph:Graph = GraphManager.getInstance().createGraph();
				let fixedVars:Array<model.Variable> = managers.VariableManager.getInstance().getVariables();
				let variable:model.Variable = null;
				for(let i:number = 0, len = fixedVars.length; i < len; ++i)
				{
					variable = graph.createVariable();
					variable.setName(fixedVars[i].getName());
					variable.setType(fixedVars[i].getType());
					variable.setValue(fixedVars[i].getValue());
				}
				let data:GraphTabItemData = new GraphTabItemData();
				data.name = graph.name;
				data.cache = true;
				this.addItem(data);
			}
		}

		private addItem(itemData:GraphTabItemData):void
		{
			if(!this.data)
				this.data = new Array<GraphTabItemData>();

			if(this.data.find(elem=>elem.name == itemData.name))
				return;
				
			this.data.push(itemData);
			this.setData(this.data);
			EventManager.getInstance().event(EventType.CHANGE_TAB, [itemData]);
		}

		private deleteItem(itemData:GraphTabItemData):void
		{
			if(!this.data)
				return;

			for(let i:number = 0; i < this.data.length; ++i)
			{
				if(this.data[i].name == itemData.name)
				{
					this.data.splice(i, 1);
					managers.DebugManager.getInstance().debugExit();
					break;
				}
			}

			this.setData(this.data);
		}
	}
}