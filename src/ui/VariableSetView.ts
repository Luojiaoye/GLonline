/**
* 变量设置界面
* @author confiner
*/
module ui
{
	import IData = core.IData;
	import Variable = model.Variable;
	import DatumType = core.DatumType;
	import Event = Laya.Event;

	export class VariableSetView extends Editor.VariableSetViewUI implements core.IContent
	{
		data:Variable;
		private static readonly _TYPES:Array<DatumType> = [DatumType.Int, DatumType.Number,
										 DatumType.Vector3, DatumType.String,
										 DatumType.Boolean, DatumType.UserId];
		private static readonly _LABS:Array<string> = [DatumType.Int.toString(), DatumType.Number.toString(),
										 DatumType.Vector3.toString(), DatumType.String.toString(),
										 DatumType.Boolean.toString(), DatumType.UserId.toString()];

		setData(data:Variable):void
		{
			this.data = data;
			this.update();
		}

		public add():void
		{
			
		}

		public switcher(data:model.ContentMenuItemData):void
		{
			this.visible = data.open;
			data.height = data.open ? this.height : 0;
		}

		public getContent():Laya.Sprite
		{
			return this;
		}

		private update():void
		{
			if(!this.data)
				return;

			this.input_varName.text = this.data.getName();
			this.cbox_types.selectedLabel = this.data.getType().toString();
		}

		constructor()
		{
			super();
		}

		protected initialize():void
		{
			this.input_varName.text = "";
			this.cbox_types.labels = VariableSetView._LABS.join(",");

			this.cbox_types.selectHandler = new Handler(this, this.onSelectHandler);
			this.input_varName.on(Event.INPUT, this, this.onInputHandler);
		}

		private onSelectHandler(index:number):void
		{
			let type:DatumType = VariableSetView._TYPES[index];
			if(type != this.data.getType()){
				this.data.setType(type);
				this.data.setDefaultValue();
			}
		}

		private onInputHandler():void
		{
			let name:string = this.input_varName.text.trim();
			this.data.setName(name);
		}
	}
}