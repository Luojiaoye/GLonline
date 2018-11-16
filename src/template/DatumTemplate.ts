/**
* 数据描述
* @author confiner 
*/
module template
{
	import Datum = model.Datum;
	import DatumType = core.DatumType;

	export class DatumTemplate implements core.ITemplate
	{
		config:Object;
		
		
		constructor(config:Object)
		{
			this.config = config;
			this.parse();
		}

		private type:string;
		private value:any;

		parse():void
		{
			for(let prop in this.config)
			{
				this.type = String(prop);
				this.value = this.config[prop];
				break; 
			}
		}

		// 创建datum数据
		public createDatum():Datum
		{
			let datum:Datum = new Datum();
			switch(this.type)
			{
				case "boolean":
					datum.setType(DatumType.Boolean);
				break;
				case "int":
					datum.setType(DatumType.Int);
					break;
				case "number":
					datum.setType(DatumType.Number);
				break;
				case "vector3":
					datum.setType(DatumType.Vector3);
				break;
				case "string":
					datum.setType(DatumType.String);
				break;
				case "userid":
					datum.setType(DatumType.UserId);
				break;
			}
			
			let isLock:boolean = String(this.value) == Datum.LOCK;
			if(isLock)
				datum.setValue(Datum.LOCK);
			else
				datum.setValue(this.value);

			return datum;
		}
	}
}