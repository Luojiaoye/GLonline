/**
* 插槽描述
* @author confiner
*/
module template
{
	import Slot = model.Slot;

	export class SlotTemplate implements core.ITemplate
	{
		config:Object;

		constructor(config:Object)
		{
			this.config = config;
			this.parse();
		}

		private name:string; // 插槽名
		private datumConfig:Object; // 数据配置

		parse():void
		{
			for(let prop in this.config)
			{
				this.name = String(prop);
				this.datumConfig = this.config[prop];
				break;
			}
		}

		// 创建插槽
		public createSlot():Slot
		{
			let slot:Slot = new Slot();
			slot.setName(this.name);
			let template:DatumTemplate = new DatumTemplate(this.datumConfig);
			slot.setData(template.createDatum());
			return slot;
		}
	}
}