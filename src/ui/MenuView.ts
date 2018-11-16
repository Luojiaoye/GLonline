/**
* 菜单界面
* @author confiner
*/
module ui{
	import IData = core.IData;
	import MenuType = core.MenuType;
	import Event = Laya.Event;

	export class MenuView extends Editor.MenuViewUI implements IData
	{
		data:Array<MenuType>;

		constructor()
		{
			super();

			this.list_Items.renderHandler = new Handler(this, this.onRenderHandler);
			this.on(Event.CLICK, this, this.onClickHandler);
		}

		private onClickHandler(evt:Event):void
		{
			this.visible = false;
		}

		private onRenderHandler(item:MenuViewItem, index:number):void
		{
			let menuItem:MenuType = item.dataSource;
			item.setData(menuItem);
		}

		setData(data:Array<MenuType>):void
		{
			this.data = data;
			this.update();
		}

		private update():void
		{
			if(!this.data)
				return;

			this.list_Items.repeatY = this.data.length;
			this.list_Items.array = this.data;

			this.img_bg.height = this.data.length * 35 + this.list_Items.y + 12;
		}
	}
}