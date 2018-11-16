/**
* GraphTabItemCloseView
* @author confiner
*/
module ui
{
	import Event = Laya.Event;
	import IData = core.IData;
	import EventType = core.EventType;
	import EventManager = managers.EventManager;
	import MenuType = core.MenuType;
	import GraphTabItemData = model.GraphTabItemData;

	export class GraphTabItemCloseView extends Editor.GraphTabItemCloseAlertUI implements IData
	{
		data:GraphTabItemData;

		setData(data:GraphTabItemData):void
		{
			this.data = data;
			this.update();
		}

		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this.btn_save.on(Event.CLICK, this, this.onSaveFile);
			this.btn_cancel.on(Event.CLICK, this, this.onNotSaveFile);
		}

		private onSaveFile(evt:Event):void
		{
			EventManager.getInstance().event(EventType.CLOSE_ALERT);

			EventManager.getInstance().event(EventType.OPEN_NAVIGATOR, [MenuType.Save]);
		}

		private onNotSaveFile(evt:Event):void
		{
			EventManager.getInstance().event(EventType.CLOSE_ALERT);
			EventManager.getInstance().event(EventType.DELETE_TAB_ITEM, [this.data]);
		}

		private update():void
		{

		}
	}
}