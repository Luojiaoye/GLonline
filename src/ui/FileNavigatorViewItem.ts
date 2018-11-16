/**
* 文件信息显示单元
* @author confiner
*/
module ui
{
	import IData = core.IData;
	import FileInfo = model.FileInfo;
	import Event = Laya.Event;
	import EventType = core.EventType;
	import EventManager = managers.EventManager;

	export class FileNavigatorViewItem extends Editor.Elements.FileNavigatorViewItemUI implements IData
	{
		data:FileInfo;	// 文件信息

		constructor()
		{
			super();

			this.init();
		}

		private init():void
		{
			this.on(Event.CLICK, this, this.onClickHandler);
			// this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
			// this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
		}

		private onMouseHandler(evt:Event):void
		{
			this.img_over.visible = evt.type == Event.MOUSE_OVER;
			this.txt_name.color = evt.type == Event.MOUSE_OVER ? "#000000" : "#b5b5b5";
		}

		private onClickHandler(evt:Event):void
		{
			EventManager.getInstance().event(EventType.OPEN_FILE, [this.data.id, this.data.isDir()]);
		}

		setData(data:FileInfo):void
		{
			this.data = data;
			this.update();
		}

		private update():void
		{
			this.img_over.visible = false;
			this.icon_dir.visible = false;
			this.icon_file_normal.visible = false;
			this.icon_file_over.visible = false;

			if(this.data.isDir())
				this.icon_dir.visible = true;
			else
				this.icon_file_normal.visible = true;

			this.txt_name.text = this.data.name;
		}
	}
}