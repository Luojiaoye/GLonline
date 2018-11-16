/**
* 调试栈Item
@author confiner
*/
module ui
{
	export class DebugStackViewItem extends Editor.Elements.DebugStackViewItemUI implements core.IData
	{
		data:model.GraphDebugInfo;

		constructor()
		{
			super();
			this.clear();
			this.on(Laya.Event.MOUSE_OVER, this, this.onMouseHandler);
			this.on(Laya.Event.MOUSE_OUT, this, this.onMouseHandler);
			managers.EventManager.getInstance().on(core.EventType.DEBUG_ITEM_SELECT, this, this.onSelectHandler);
		}

		public destroy(destroyChild?:boolean):void
		{
			super.destroy(destroyChild);
			this.offAll();
			managers.EventManager.getInstance().off(core.EventType.DEBUG_ITEM_SELECT, this, this.onSelectHandler);
		}

		private  onSelectHandler():void
		{
			this.img_select.visible = false;
			this.img_over.visible = false;
		}

		private onMouseHandler(evt:Laya.Event):void
		{
			this.img_over.visible = evt.type == Laya.Event.MOUSE_OVER;
		}

		private clear():void
		{
			this.icon_cur.visible = false;
			this.img_select.visible = false;
			this.txt_nodeInfo.visible = false;
			this.icon_select.visible = false;
			this.img_over.visible = false;
		}

		setData(data:model.GraphDebugInfo):void
		{
			this.data = data;
			this.update();
		}

		public setSelect():void
		{
			if(!this.data)
				return;

			let nodeId:string = this.data.getHitNodeId();
			let graphDebugInfo:model.GraphDebugInfo = managers.DebugManager.getInstance().getStackHead();
			if(graphDebugInfo)
			{
				if(graphDebugInfo.getHitNodeId() == nodeId)
				{
					this.icon_select.visible = true;
				}
				else
				{
					this.img_select.visible = true;
					this.img_over.visible = false;
				}
			}
		}

		private update():void
		{
			if(!this.data)
				return;
			
			let nodeId:string = this.data.getHitNodeId();
			let graphDebugInfo:model.GraphDebugInfo = managers.DebugManager.getInstance().getStackHead();
			if(graphDebugInfo)
			{
				this.txt_nodeInfo.visible = true;
				if(graphDebugInfo.getHitNodeId() == nodeId)
				{
					// 当前击中断点
					this.icon_cur.visible = true;
					this.icon_select.visible = false;
					this.txt_nodeInfo.color = "#efc748";
				}
				else
				{
					this.icon_cur.visible = false;
					this.txt_nodeInfo.color = "#adadad";
				}

				this.txt_nodeInfo.text = this.data.getName() 
											+ ":" + managers.GraphManager.getInstance().getCurrent().getNodeById(nodeId).getName() 
											+ ":" + nodeId;
			}
		}
	}
}