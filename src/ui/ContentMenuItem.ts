/**
* 内容面板Item
* @author confiner
*/
module ui
{
	export class ContentMenuItem extends Editor.Elements.ContentMenuItemUI implements core.IData
	{
		public static readonly ADD:string = "add";
		public static readonly SWITCH:string = "switch";

		data:model.ContentMenuItemData;

		public setData(data:model.ContentMenuItemData):void
		{
			this.data = data;
			this.update();
		}

		private update():void
		{
			this.clear();
			this.btn_add.visible = this.data.add;
			this.btn_switch.index = !this.data.open ? 0 : 1;
			this.txt_name.text = this.data.name;
			this.setWidth(this.data.width);
		}

		private setWidth(w:number):void
		{
			this.width = w;
			this.bg.width = w;
			this.btn_add.x = w - this.btn_add.width - 20;
		}

		private clear():void
		{
			this.btn_add.visible = false;
			this.btn_switch.index = 0;
			this.txt_name.text = "";
		}

		constructor()
		{
			super();
		}
	}
}