/**
* 调试栈界面
* @author confiner 
*/
module ui
{
	export class DebugStackView extends Editor.DebugStackViewUI
	{
		constructor()
		{
			super();

			this.init();
		}

		private init():void
		{
			this.y = Laya.stage.height - 230;
			this.clip_upDown.on(Laya.Event.CLICK, this, this.upDownHandler);	
			this.list_stack.renderHandler = new Handler(this, this.onRenderHandler);
			this.btn_stack.on(Laya.Event.CLICK, this, this.onClickHandler);
			this.btn_logs.on(Laya.Event.CLICK, this, this.onClickHandler);
			this.btn_stack.selected = true;
			this.list_stack.visible = false;
			this.txt_logs.visible = false;
			this.btn_logs.selected = false;
			managers.EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.update);
			//this.test_txt.text = "hedafda\n" + "dddfdafd";
		}

		private onSelectHandler(item:DebugStackViewItem, index:number):void
		{
			managers.EventManager.getInstance().event(core.EventType.DEBUG_ITEM_SELECT);
			item.setSelect();
			managers.DebugManager.getInstance().setCurrent(index);
		}

		private update():void
		{
			let graphs:Array<model.GraphDebugInfo> = managers.DebugManager.getInstance().getGraphDebugInfoList();
			this.list_stack.visible = false;
			if(graphs && graphs.length > 0)
			{
				this.list_stack.visible = true;
				this.list_stack.array = graphs;
				this.list_stack.repeatY = graphs.length;

				let log:string = "";

				let isDebug:boolean = false;
				for(let i:number = graphs.length - 1; i >= 0; --i)
				{
					isDebug = managers.DebugManager.getInstance().isInDebugStack(graphs[i].getHitNodeId());
					if(!isDebug)
						continue;

					if(graphs[i].getLog() == "")
						continue;

					log += graphs[i].getLog() + "\n"; //+ this.addLineString() + "\n";
				}

				this.txt_logs.text = log;
			}
		}

		private addLineString():string
		{
			let str:string = "";
			for(let i:number = 0; i < 100; ++i)
			{
				str += "=";
			}

			return str;
		}

		public destroy(destoryChild?:boolean):void
		{
			managers.EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.update);
			this.offAll();
			super.destroy(destoryChild);
		}

		private onClickHandler(evt:Laya.Event):void
		{
			if(evt.currentTarget == this.btn_stack)
			{
				this.btn_stack.selected = true;
				this.btn_logs.selected = false;
				this.list_stack.visible = true;
				this.txt_logs.visible = false;
			}
			else if(evt.currentTarget == this.btn_logs)
			{
				this.btn_stack.selected = false;
				this.btn_logs.selected = true;
				this.list_stack.visible = false;
				this.txt_logs.visible = true;
			}
		}

		private onRenderHandler(item:DebugStackViewItem, index:number):void
		{
			if(index % 2 == 0)
			{
				item.img_one.visible = true;
				item.img_two.visible = false;
			}
			else
			{
				item.img_one.visible = false;
				item.img_two.visible = true;
			}

			item.on(Laya.Event.CLICK, this, this.onSelectHandler, [item, index]);
			item.setData(item.dataSource);
		}

		private upDownHandler():void
		{
			if(this.clip_upDown.index == 0)
			{
				this.clip_upDown.index = 1;
				this.y = Laya.stage.height - 30;
				this.btn_logs.visible = false;
				this.btn_stack.visible = false;
			}
			else
			{
				this.clip_upDown.index = 0;
				this.y = Laya.stage.height - 230;
				this.btn_logs.visible = true;
				this.btn_stack.visible = true;
			}
		}

	}
}