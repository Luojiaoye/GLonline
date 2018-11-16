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

	export class VariableDefaultValueView extends Editor.VariableDefaultValueViewUI implements core.IContent
	{
		data:Variable;
		setData(data:Variable):void
		{
			this.data = data;
			this.update();
			this.data.on(model.Model.UPDATE, this, this.update);
		}

		public destroy(destroyChild?:boolean):void
		{
			super.destroy(destroyChild);
			this.offAll();
			this.data.off(model.Model.UPDATE, this, this.update);
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

			this.input_varValue.text = this.data.getData().toString();
		}

		constructor()
		{
			super();
		}

		protected initialize():void
		{
			this.input_varValue.text = "";

			this.input_varValue.on(Event.KEY_DOWN, this, this.onInputHandler);//.on(Event.INPUT, this, this.onInputHandler);
		}

		private onInputHandler(evt:Laya.Event):void
		{
			if(evt.keyCode == Laya.Keyboard.ENTER)
			{
				let value:string = this.input_varValue.text.trim();
				this.data.setValue(value);
			}
		}
	}
}