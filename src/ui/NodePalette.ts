/**
* @desc 节点树
* @author confiner
*/
module ui{
	import Utils = Laya.Utils;
	import Event = Laya.Event;
	import Tree = Laya.Tree;
	import Dictionary = Laya.Dictionary;
	import Rectangle = Laya.Rectangle;
	import Label = Laya.Label;
	import EventType = core.EventType;
	import NodeManager = managers.NodeManager;
	import EventManager = managers.EventManager;

	export class NodePalette extends Editor.NodPaletteUI implements core.IData, core.IContent
	{
		data:Map<string, NodeTemplate>;
	
		private _dragRegion:Rectangle = null;// 拖拽区域
	
		constructor()
		{
			super();
			this.init();
		}

		public add():void
		{

		}

		public switcher(data:model.ContentMenuItemData):void
		{
			this.visible = data.open;
			if(data.open)
				managers.EventManager.getInstance().event(core.EventType.NODES_DETAIL);
			data.height = this.visible ? this.height : 0;
		}

		public getContent():Laya.Sprite
		{
			return this;
		}

		private init():void
		{
			this.createDragRegion();
			
			this.addEvents();
			this.tree_nodes.mouseHandler = new Handler(this, this.onMouseClick);
			this.tree_nodes.renderHandler = new Handler(this, this.onItemRender);
			this.btn_close.clickHandler = new Handler(this, this.clickHandler);
			this.input_key.on(Event.INPUT, this, this.onInputHandler);

			let data:Map<string, NodeTemplate> = NodeManager.getInstance().getAllNodeTemplates();
			this.setData(data);
		}

		private createDragRegion():void
		{
			let pos:Laya.Point = new Laya.Point(this.x, this.y);
			pos = this.localToGlobal(pos);
			this._dragRegion = new Rectangle(0, 160, 1920, 1000);
		}

		private onInputHandler(evt:Event):void
		{
			let partten:string = this.input_key.text.trim();
			if(partten)
			{
				let matchs:Map<string, NodeTemplate> = NodeManager.getInstance().getMatchNodeTemplates(partten);
				if(matchs)
				{
					this.setData(matchs);
				}
			}
		}

		private clickHandler():void
		{
			this.input_key.text = "";
			this.setData(NodeManager.getInstance().getAllNodeTemplates());
		}

		private onItemRender(item:NodePaletteItem, index: number):void
		{
			item.setData(item.dataSource);
		}

		private parseNodeTemplatesToTreeData():any
		{
			let nodeTemplates:Dictionary = new Dictionary();
			for(let nodeTemplate of this.data.values())
			{
				let categoryObj:Object = nodeTemplates.get(nodeTemplate.category);
				if(!categoryObj)
				{
					categoryObj = {};
					nodeTemplates.set(nodeTemplate.category, categoryObj);
				}

				if(nodeTemplate.subCategory)
				{
					// 处理子目录
					let subCategoryObj:Dictionary = categoryObj["subs"];
					if(!subCategoryObj)
					{
						subCategoryObj = new Dictionary();
						categoryObj["subs"] = subCategoryObj;	
					}

					let leafs:Array<string> = subCategoryObj[nodeTemplate.subCategory]; 
					if(!leafs)
					{
						leafs = new Array<string>();
						subCategoryObj.set(nodeTemplate.subCategory, leafs);
					}
					leafs.push(nodeTemplate.name);
				}
				else
				{
					// 处理叶子节点
					let leafsArray:Array<string> = categoryObj["leafs"];
					if(!leafsArray)
					{
						leafsArray = new Array<string>();
						categoryObj["leafs"] = leafsArray;
					}
					leafsArray.push(nodeTemplate.name);
				}
			}		

			let openStatus:string = this.input_key.text.trim() != "" ? 'true' : 'false';
			// 组合tree数据xml
			let treeData:String = "<data>";
			for(let index in nodeTemplates.keys)
			{
				let dirName:string = nodeTemplates.keys[index];
				treeData += "<dir label='" + dirName + "' isOpen='" + openStatus + "'>";

				// 处理子节点
				let categoryObj:Object = nodeTemplates.get(dirName);
				let subCategoryObj:Dictionary = categoryObj["subs"];
				if(subCategoryObj)
				{
					for(let idx in subCategoryObj.keys)
					{
						let subName = subCategoryObj.keys[idx];
						treeData += "<dir label='" + subName + "' isOpen='" + openStatus + "'>";
						// 子节点中的叶子节点
						let leafs:Array<string> = subCategoryObj.get(subName);
						if(leafs)
						{
							for(let i = 0; i < leafs.length; ++i)
							{
								treeData += "<file label='" + leafs[i] + "' colorId='" + dirName + "'/>";
							}
						}
						treeData += "</dir>";
					}
				}

				// 处理当前节点的叶子节点
				let leafs:Array<string> = categoryObj["leafs"];
				if(leafs)
				{
					for(let i = 0; i < leafs.length; ++i)
					{
						treeData += "<file label='" + leafs[i] + "' colorId='" + dirName + "'/>";
					}
				}

				treeData += "</dir>";
			}
			treeData += "</data>"

			return Utils.parseXMLFromString(treeData);
		}

		private addEvents():void
		{
			EventManager.getInstance().on(EventType.LOAD_GRAPH, this, this.updateNodes);
		}

		private removeEvents():void
		{
			EventManager.getInstance().off(EventType.LOAD_GRAPH, this, this.updateNodes);
		}

		public destroy(destroyChild?:boolean):void
		{
			super.destroy(destroyChild);
			this.removeEvents();
		}

		setData(data:Map<string, NodeTemplate>):void
		{
			this.data = data;
			this.update();
		}

		private update():void
		{
			if(!this.data)
				return;

			this.tree_nodes.fresh();
			this.tree_nodes.xml = this.parseNodeTemplatesToTreeData();
		}

		private updateNodes():void
		{
			let data:any = NodeManager.getInstance().getAllNodeTemplates();
			this.setData(data);
		}

		private onMouseClick(evt:Event, index:number):void
		{
			let target:Object = evt.target;
			if(evt.type == Event.MOUSE_DOWN)
			{
				if(target["dataSource"])
				{
					let hasChild:boolean = (target as Laya.Box).dataSource["hasChild"];	
					if(!hasChild)
					{
						// 叶子节点
						let item:Label = new Label();
						let nodeName:string = target["dataSource"]["label"];
						item.text = nodeName;
						item.width = target["width"];
						item.height = target["height"];
						item.x = evt.stageX;
						item.y = evt.stageY;
						Laya.stage.addChild(item);
						item.startDrag(this._dragRegion);
						Laya.stage.on(Event.MOUSE_UP, this, this.onStageMouseUp, [nodeName, item]);
					}
				}
			}
		}

		private onStageMouseUp(nodeName:string, item:Label, evt:Event):void
		{
			let pos:Laya.Point = new Laya.Point(this.x, this.y);
			pos = this.localToGlobal(pos);
			if(!this._dragRegion.contains(item.x, item.y))
			{
				// 不在拖动区域内则不处理
			}
			else if(item.x < pos.x + this.width)
			{

			}
			else
			{
				EventManager.getInstance().event(EventType.ADD_NODE, [nodeName, item.x, item.y]);
			}
			Laya.stage.off(Event.MOUSE_UP, this, this.onStageMouseUp);
			item.destroy();
			item = null;
		}
	}
}