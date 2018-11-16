/**
* @author confiner
* @desc  输入插槽Item
*/
module ui{
	import Elements = ui.Editor.Elements;
	import Event = Laya.Event;
	import EventType = core.EventType;
	import Point = Laya.Point;
	import Sprite = Laya.Sprite;
	import EventManager = managers.EventManager;
	import Slot = model.Slot;

	export class SlotInItem extends Elements.SlotInItemUI implements core.IData, core.ITransform
	{
		data:Slot;
		anchor:Sprite;

		constructor()
		{
			super();
			this.addEvents();
		}

		private debugResultHandler():void
		{
			let graphDebugInfo:model.GraphDebugInfo = managers.DebugManager.getInstance().getCurrent();
			if(graphDebugInfo)
			{
				let datum:model.Datum = graphDebugInfo.getDatum(this.data.getNodeId(), this.data.getName());
				if(datum)
				{
					this.input_slotValue.text = datum.toString();
				}
				else
				{
					this.update();
				}
			}
		}

		// 获取锚点位置
		getAnchorPosition():Point
		{
			return this.anchor.globalToLocal(this.getStagePosition());
		}

		// 设置锚点
		setAnchor(anchor:Sprite):void
		{
			this.anchor = anchor;
		}

		public clear():void
		{

		}

		// 获取舞台位置
		getStagePosition():Point
		{
			let px:number = this.btn_executionIn.x;
			let py:number = this.btn_executionIn.y + (this.btn_executionIn.height >> 1) + 1;
			if(this.data.getType() == core.SlotType.DataIn)
			{
				px = this.btn_dataInput.x;
				py = this.btn_dataInput.y + (this.btn_dataInput.height >> 1) + 1;
			}

			let pos:Point = new Point(px, py);
			let globalPos:Point = this.localToGlobal(pos);
			return globalPos;
		}

		setData(data:Slot):void
		{
			if(data.equals(this.data))
				return;

			this.data = data;
			this.update();
		}

		private update():void
		{
			this.btn_executionIn.visible = this.data.getType() == core.SlotType.ExecutionIn;
			this.btn_dataInput.visible = this.data.getType() == core.SlotType.DataIn;

			this.txt_slotName.text = this.data.getName();
			this.input_slotValue.visible = false;
			this.txt_type.visible = false;
			this.width = this.txt_slotName.x + this.txt_slotName.width;

			if(this.data.getType() == core.SlotType.DataIn)
			{
				this.txt_type.visible = true;
				this.txt_type.text = ":" + this.data.getDataType().toString();
				this.txt_type.x = this.txt_slotName.x + this.txt_slotName.textField.width;
				this.width = this.txt_type.x + this.txt_type.width;
				if(this.data.isLock())
				{
					this.input_slotValue.visible = false;
				}
				else
				{
					this.input_slotValue.visible = true;
					this.input_slotValue.text = this.data.getData().toString();
					this.input_slotValue.x = this.txt_type.x + this.txt_type.textField.width + 10;
					this.width = this.input_slotValue.x + this.input_slotValue.width;
				}
			}

			this.event(core.EventType.RESIZE, [true, this.width]);
		}

		destroy(destroyChild?: boolean):void
		{
			if(this.data)
				this.data.off(model.Model.UPDATE, this, this.update);
			this.removeEvents();
			super.destroy(destroyChild);
		}

		private addEvents():void
		{
			this.btn_dataInput.on(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_dataInput.on(Event.MOUSE_UP, this, this.onEventHander);
			this.btn_dataInput.on(Event.MOUSE_OVER, this, this.onEventHander);
			this.btn_executionIn.on(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_executionIn.on(Event.MOUSE_UP, this, this.onEventHander);
			this.btn_executionIn.on(Event.MOUSE_OVER, this, this.onEventHander);
			this.input_slotValue.on(Event.KEY_DOWN, this, this.onInputHandler);
			managers.EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			managers.EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.debugResultHandler);
		}

		public setStatus(status:boolean):void
		{
			if(!this.data)
				return;

			if(this.data.getType() == core.SlotType.ExecutionIn)
				this.btn_executionIn.selected = status;
			else if(this.data.getType() == core.SlotType.DataIn)
				this.btn_dataInput.selected = status;
		}

		public setValue(value:string):void
		{
			this.input_slotValue.text = value;
		}

		private onInputHandler(evt:Event):void
		{
			if(evt.keyCode == Laya.Keyboard.ENTER)
			{
				this.data.getData().parseString(this.input_slotValue.text.trim());
			}
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
			this.btn_dataInput.off(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_dataInput.off(Event.MOUSE_OVER, this, this.onEventHander);
			this.btn_dataInput.off(Event.MOUSE_UP, this, this.onEventHander);
			this.btn_executionIn.off(Event.MOUSE_DOWN, this, this.onEventHander);
			this.btn_executionIn.off(Event.MOUSE_OVER, this, this.onEventHander);
			this.btn_executionIn.off(Event.MOUSE_UP, this, this.onEventHander);
			this.input_slotValue.off(Event.INPUT, this, this.onInputHandler);
			managers.EventManager.getInstance().off(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			managers.EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.debugResultHandler);
		}

		private onDebugOperationHandler(operationType:string):void
		{
			if(operationType == core.DebugType.DebugExit.toString())
			{
				this.update();
			}
		}
	}
}