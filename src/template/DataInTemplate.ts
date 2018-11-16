/**
* 执行输出描述
* @author confiner
*/
module template
{
	import Slot = model.Slot;
	import SlotType = core.SlotType;

	export class DataInTemplate implements core.ITemplate
	{
		config:Object;

		private _slotConfigs:Array<Object>;

		constructor(config:Object)
		{
			this.config = config;
			this.parse();
		}

		parse():void
		{
			this._slotConfigs = this.config as Array<Object>;
		}

		// 创建数据输入插槽
		public createDataInSlots():Array<Slot>
		{
			let slots:Array<Slot> = new Array<Slot>();

			let slotTemplate:SlotTemplate = null;
			let slot:Slot = null;
			for(let i:number = 0; i < this._slotConfigs.length; ++i)
			{
				slotTemplate = new SlotTemplate(this._slotConfigs[i]);
				slot = slotTemplate.createSlot();
				slot.setType(SlotType.DataIn);
				slots.push(slot);
			} 

			return slots;
		}
	}
}