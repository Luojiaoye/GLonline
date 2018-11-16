/**
* 自定义插槽界面
* @author confiner
*/
module ui {
	export class CustomSlotView extends Editor.CustomSlotViewUI implements core.IContent {
		data: model.Custom;
		private _type:core.SlotType;

		public add(): void {
			if (this._type == core.SlotType.DataIn) {
				if(this.data.getType() == core.CustomType.SWITCH)
				{
					if(this.data.getNode().getDataInputsCount() >= 1)
						return;
				}
				this.data.createInputSlot();
				if (this.data.getBind())
					this.data.createOutputSlot();
			}
			else if(this._type == core.SlotType.DataOut) {
				this.data.createOutputSlot();
				if (this.data.getBind())
					this.data.createInputSlot();
			}
			else if(this._type == core.SlotType.ExecutionIn){
				this.data.createExecutionInSlot();
			}
			else if(this._type == core.SlotType.ExecutionOut){
				this.data.createExecutionOutSlot();
			}
		}

		public switcher(data: model.ContentMenuItemData): void {
			this.visible = data.open;
			data.height = data.open ? this.height : 0;
		}

		public getContent(): Laya.Sprite {
			return this;
		}

		setData(data: model.Custom): void {
			this.data = data;
			this.update();
			this.data.on(model.Model.UPDATE, this, this.update);
		}

		private update(): void {
			this.list_slots.visible = false;
			this.bg.visible = false;

			if (!this.data || !this.data.getNode())
				return;

			let slots: Array<model.Slot> = this.data.getNode().getSlotsByType(this._type);
			if (!slots || slots.length == 0)
				return;

			this.list_slots.visible = true;
			this.list_slots.height = slots.length * 30;
			this.list_slots.repeatY = slots.length;
			this.list_slots.array = slots;
			this.bg.visible = true;
			this.height = this.bg.height = this.list_slots.y + this.list_slots.height + 15;
		}

		constructor(slotType:core.SlotType) {
			super();
			this._type = slotType;
			this.init();
		}

		private init(): void {
			this.list_slots.visible = false;
			this.bg.visible = false;

			this.list_slots.renderHandler = new Handler(this, this.renderHandler);
			managers.EventManager.getInstance().on(core.EventType.DELETE_SLOT, this, this.delteSlot);
			managers.EventManager.getInstance().on(core.EventType.CHANGE_SLOT_NAME, this, this.changeSlotName);
			managers.EventManager.getInstance().on(core.EventType.CHANGE_SLOT_TYPE, this, this.changeeSlotType);
		}

		private changeSlotName(slot:model.Slot, name:string):void
		{
			if(this.data)
				this.data.changeSlotName(slot, name);
		}

		private changeeSlotType(slot:model.Slot, type:core.DatumType):void
		{
			if(this.data)
				this.data.changeSlotDatumType(slot, type);	
	    }

		public destroy(destroyChild?:boolean):void
		{
			managers.EventManager.getInstance().off(core.EventType.DELETE_SLOT, this, this.delteSlot);
			managers.EventManager.getInstance().off(core.EventType.CHANGE_SLOT_NAME, this, this.changeSlotName);
			managers.EventManager.getInstance().off(core.EventType.CHANGE_SLOT_TYPE, this, this.changeeSlotType);

			if(this.data)
				this.data.off(model.Model.UPDATE, this, this.update);

			if(this.parent)
				this.parent.removeChild(this);
				
			this.offAll();
			super.destroy(destroyChild);
		}

		private delteSlot(slot: model.Slot): void {
			if (this.data)
				this.data.deleteSlot(slot);
		}

		private renderHandler(item: CustomSlotViewItem, index: number): void {
			item.on(core.EventType.RESORT, this, this.onResortHandler);
			let data: model.Slot = item.dataSource as model.Slot;
			if (data)
				item.setData(data);

			let slots: Array<model.Slot> = this.data.getNode().getSlotsByType(this._type);
			if (!slots || slots.length == 1)
				return;

			item.setUpDisable((index == 1 || index == 0));
			item.setDownDisable((index == 0 || index == slots.length - 1));
		}

		private onResortHandler(slot:model.Slot, isUp:boolean):void
		{
			if(this.data)
			{
				this.data.resortSlot(slot, isUp);
			}
		}
	}
}