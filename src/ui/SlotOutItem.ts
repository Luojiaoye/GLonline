/**
* @author confiner
* @desc  输出插槽Item
*/
module ui{
	import Elements = ui.Editor.Elements;
	import Point = Laya.Point;
	import Sprite = Laya.Sprite;
	import Event = Laya.Event;
	import EventType = core.EventType;
	import EventManager = managers.EventManager;
	import Slot = model.Slot;

	export class SlotOutItem extends Elements.SlotOutItemUI implements core.IData, core.ITransform
	{
		data:Slot;
		anchor:Sprite;

		constructor()
		{
			super();
			this.addEvents();
		}

		// 获取描点位置
		getAnchorPosition():Point
		{
			return this.anchor.globalToLocal(this.getStagePosition());
		}

		// 设置锚点
		setAnchor(anchor:Sprite):void
		{
			this.anchor = anchor;
		}

		// 获取舞台位置
		getStagePosition():Point
		{
			let px:number = this.btn_executionOut.x;
			let py:number = this.btn_executionOut.y + (this.btn_executionOut.height >> 1) + 1;
			if(this.data.getType() == core.SlotType.DataOut)
			{
				px = this.btn_dataOut.x;
				py = this.btn_dataOut.y + (this.btn_dataOut.height >> 1) + 1;
			}
			let pos:Point = new Point(px, py);
			let globalPos:Point = this.localToGlobal(pos);
			return globalPos;
		}

		setData(data:Slot):void
		{
			this.data = data;
			this.data.on(model.Model.UPDATE, this, this.update);
			this.update();
		}

		private update():void
		{
			this.btn_executionOut.visible = this.data.getType() == core.SlotType.ExecutionOut;
			this.btn_dataOut.visible = this.data.getType() == core.SlotType.DataOut;
			this.txt_type.visible = false;

			this.txt_slotName.text = this.data.getName();
			this.width = this.txt_slotName.width + this.txt_slotName.right;
			if(this.data.getType() == core.SlotType.DataOut)
			{
				this.txt_type.visible = true;
				this.txt_type.text = this.data.getDataType().toString() + ":";
				this.txt_type.right = this.txt_slotName.right + this.txt_slotName.width;
				this.width = this.txt_type.right + this.txt_type.width;
			}

			this.event(core.EventType.RESIZE, [false, this.width]);
		}

		destroy(destroyChild?: boolean):void
		{
			this.removeEvents();
			super.destroy(destroyChild);
		}

		public clear():void
		{

		}

		private addEvents():void
		{
			this.btn_dataOut.on(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_dataOut.on(Event.MOUSE_UP, this, this.onEventHander);
			this.btn_dataOut.on(Event.MOUSE_OVER, this, this.onEventHander);
			this.btn_executionOut.on(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_executionOut.on(Event.MOUSE_UP, this, this.onEventHander);
			this.btn_executionOut.on(Event.MOUSE_OVER, this, this.onEventHander);
		}

		public setStatus(status:boolean):void
		{
			if(!this.data)
				return;

			if(this.data.getType() == core.SlotType.ExecutionOut)
				this.btn_executionOut.selected = status;
			else if(this.data.getType() == core.SlotType.DataOut)
				this.btn_dataOut.selected = status;
		}

		private onEventHander(evt:Event):void
		{
			switch(evt.type)
			{
				case Event.MOUSE_OVER:
					if(GraphContainer.slotType)
					{
						EventManager.getInstance().event(EventType.LINE_END, [this, this.data]);
					}
					evt.stopPropagation();
					break;
				case Event.MOUSE_DOWN:
					EventManager.getInstance().event(EventType.LINE_START, [this, this.data]);
					evt.stopPropagation();
				break;
				case Event.MOUSE_UP:
					evt.stopPropagation();
				break;
			}	
		}

		private removeEvents():void
		{
			this.btn_dataOut.off(Event.CLICK, this, this.onEventHander);
			this.btn_dataOut.off(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_dataOut.off(Event.MOUSE_OVER, this, this.onEventHander);
			this.btn_executionOut.off(Event.CLICK, this, this.onEventHander);
			this.btn_executionOut.off(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_executionOut.off(Event.MOUSE_OVER, this, this.onEventHander);
			if(this.data)
				this.data.off(model.Model.UPDATE, this, this.update);
		}
	}
}