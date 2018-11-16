/**
* 变量设置界面
* @author confiner
*/
module ui
{
	import DatumType = core.DatumType;
	import Event = Laya.Event;

	export class CustomDescriptorView extends Editor.CustomDescriptorViewUI implements core.IContent
	{
		private static readonly _TYPES:Array<core.CustomType> = [core.CustomType.BRIDGE, core.CustomType.SWITCH];

		private static readonly _LABS:Array<string> = [core.CustomType.BRIDGE.toString(), core.CustomType.SWITCH.toString()];

		data:model.Custom;
		setData(data:model.Custom):void
		{
			this.data = data;
			this.update();
			this.data.on(model.Model.UPDATE, this, this.update);
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
			
			this.cbx_types.selectedIndex = CustomDescriptorView._TYPES.indexOf(this.data.getType());
			this.check_bind.selected = this.data.getBind();
			this.input_varValue.text = this.data.getName();
			if(this.data.getType() == core.CustomType.BRIDGE)
			{
				this.data.setBind(true);
				this.check_bind.selected = true;
			}
		}

		constructor()
		{
			super();
		}

		protected initialize():void
		{
			this.input_varValue.text = "";

			this.cbx_types.labels = CustomDescriptorView._LABS.join(",");

			this.cbx_types.selectHandler = new Handler(this, this.onSelectHandler);
			this.cbx_types.selectedIndex = 0;

			this.input_varValue.on(Event.INPUT, this, this.onInputHandler);
			this.check_bind.clickHandler = new Handler(this, this.clickHandler);
			this.check_bind.selected = true;
		}

		private onSelectHandler(index:number):void
		{
			let type:core.CustomType = CustomDescriptorView._TYPES[index];
			if(type == core.CustomType.BRIDGE)
			{
				if(this.data)
					this.data.setBind(this.check_bind.selected);
				this.check_bind.selected = true;
			}
			else
			{
				if(this.data)
					this.data.setBind(false);
				this.check_bind.selected = false;
			}
			
			if(this.data)
			{
				this.data.setType(type);
				managers.EventManager.getInstance().event(core.EventType.CHANGE_CUSTOM_TYPE, [this.data]);
			}
		}

		private clickHandler():void
		{
			this.data.setBind(this.check_bind.selected);
		}

		private onInputHandler():void
		{
			let name:string = this.input_varValue.text.trim();
			this.data.setName(name);
		}
	}
}