/**
* 内容菜单界面
* @author confiner
*/
module ui
{
	import Sprite = Laya.Sprite;

	export class ContentMenuView extends Laya.VBox
	{
		private _tabs:Map<string, ContentMenuItem>;
		private _views:Map<string, core.IContent>

		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this._tabs = new Map<string, ContentMenuItem>();
			this._views = new Map<string, core.IContent>();

			managers.EventManager.getInstance().on(core.EventType.Content_Menu_UPDATE, this, this.refresh);
		}

		public destroy(destroyChild:boolean):void{
			super.destroy(destroyChild);
			managers.EventManager.getInstance().off(core.EventType.Content_Menu_UPDATE, this, this.refresh);
		}

		public deleteContent(name:string):void
		{
			if(this._tabs.has(name))
			{
				let content:core.IContent = this.getView(name);
				let sp:Laya.Sprite = content.getContent();
				let item:ContentMenuItem = this._tabs.get(name);
				item.removeChild(sp);
				sp.destroy();
				this.removeChild(item);
				item.offAll();
				item.destroy();
				this._tabs.delete(name);
				this._views.delete(name);
			}
			this.refresh();
		}

		public addContent(menuData:model.ContentMenuItemData, content:core.IContent):void
		{
			if(this._tabs.has(name))
				return;

			let tab:ContentMenuItem = new ContentMenuItem();
			tab.setData(menuData);
			this.addTab(menuData.name, tab);
			content.getContent().visible = menuData.open;
			this.addView(menuData.name, content);
		}

		public getView(name:string):core.IContent
		{
			return this._views.get(name);
		}

		private addTab(name:string, tab:ContentMenuItem):void
		{
			if(this._tabs.has(name))
				return;

			this.addChild(tab);
			this._tabs.set(name, tab);
			tab.btn_add.on(Laya.Event.CLICK, this, this.onClickHandler, [tab]);
			tab.btn_switch.on(Laya.Event.CLICK, this, this.onClickHandler, [tab]);
			this.refresh();
		}

		private addView(name:string, view:core.IContent):void
		{
			if(!this._tabs.has(name))
				return;
			
			let content:Laya.Sprite = view.getContent();
			let item:ContentMenuItem = this._tabs.get(name);
			content.y = 43;
			item.addChild(content);
			this._views.set(name, view);
			this.refresh();
		}

		private onClickHandler(item:ContentMenuItem, evt:Laya.Event):void
		{
			let data:model.ContentMenuItemData = item.data;
			let view:core.IContent = this._views.get(data.name);
			if(!view)
				return;

			switch(evt.currentTarget)
			{
				case item.btn_add:
					view.add();
					data.open = true;
					view.switcher(data);
					item.setData(data);
				break;
				
				case item.btn_switch:
					data.open = !data.open;
					view.switcher(data);
					item.setData(data);
				break;
			}

			this.refresh();
		}
	}
}