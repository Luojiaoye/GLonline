/**
* 文件管理器导航
* @author confiner
*/
module ui
{
	import Event = Laya.Event;
	import IData = core.IData;
	import FileInfo = model.FileInfo;
	import NavigatorData = model.NavigatorData;
	import MenuType = core.MenuType;
	import EventType = core.EventType;
	import EventManager = managers.EventManager;
	import GraphManager = managers.GraphManager;
	import GraphTabItemData = model.GraphTabItemData;
	import Graph = model.Graph;

	export class FileNavigatorView extends Editor.FileNavigatorViewUI implements IData
	{
		data:NavigatorData;

		private isSearching:boolean;	// 正在搜索

		constructor()
		{
			super();

			this.init();
		}

		setData(data:NavigatorData):void
		{
			this.input_path.text = "";
			this.data = data;
			this.update();
		}

		private update(inner:boolean = false):void
		{
			if(!this.data || !this.data.directory)
				return;

			this.txt_error.visible = false;
			this.box_alert.visible = false;
			this.box_dir.visible = false;
			this.btn_return.disabled =  !this.data.directory.owner;
			if(this.isSearching)
			{
				if(this.data.directory.matchFiles)
				{	
					this.list_files.repeatY = this.data.directory.matchFiles.length;
					this.list_files.array = this.data.directory.matchFiles;
				}
			}
			else
			{
				if(this.data.directory.files)
				{	
					this.list_files.repeatY = this.data.directory.files.length;
					this.list_files.array = this.data.directory.files;
				}
			}
			
			if(this.data.type == MenuType.Open)
				this.btn_openOrSave.label = "Open";
			else if(this.data.type == MenuType.New)
				this.btn_openOrSave.label =  "New";
			else if(this.data.type == MenuType.Save)
				this.btn_openOrSave.label = "Save";

			if(this.data.type == MenuType.Save && !inner)
				this.input_path.text = GraphManager.getInstance().getCurrent().name;	
		}

		private init():void
		{
			this.name = "FileNavigatorView";
			this.list_files.renderHandler = new Handler(this, this.onRenderHandler);

			this.btn_return.on(Event.CLICK, this, this.onReturnHandler);
			this.btn_close.on(Event.CLICK, this, this.onCloseHandler);
			this.btn_openOrSave.on(Event.CLICK, this, this.onOpenOrSaveHandler);
			this.btn_cancel.on(Event.CLICK, this, this.onCloseHandler);
			this.btn_continue.on(Event.CLICK, this, this.onContinueHandler);
			this.btn_no.on(Event.CLICK, this, this.onNoHandler);
			this.btn_cncl.on(Event.CLICK, this, this.onCnClHandler);
			this.btn_ok.on(Event.CLICK, this, this.onOkHandler);
			this.on(Event.RIGHT_CLICK, this, this.onRightClickHandler);
			this.input_path.on(Event.INPUT, this, this.onInputHandler);


			EventManager.getInstance().on(EventType.OPEN_FILE, this, this.onOpenFileHandler);
		}

		private onInputHandler(evt:Event):void
		{
			let partten:string = this.input_path.text.trim();
			if(partten)
			{
				this.data.directory.getMatchFiles(partten);
				this.isSearching = true;
			}
			else
			{
				this.isSearching = false;
			}

			this.update(true);
		}

		private onRightClickHandler(evt:Event):void
		{
			if(evt.currentTarget.name == "FileNavigatorView")
			{
				let pos:Laya.Point = new Laya.Point(evt.stageX, evt.stageY);
				pos = this.globalToLocal(pos);
				this.box_dir.visible = true;
				this.input_DirName.text = "";
				this.box_dir.pos(pos.x, pos.y);
			}
		}

		private onOkHandler(evt:Event):void
		{
			if(evt.currentTarget == this.btn_ok)
			{
				let dirName:string = this.input_DirName.text.trim();
				if(!dirName)
					return;

				// 创建新文件夹
				let dirFile:FileInfo = this.data.directory.createDir();
				if(dirFile)
				{
					dirFile.name = dirName;
					this.setData(this.data);
					this.box_dir.visible = false;
				}
			}
		}

		private onContinueHandler(evt:Event):void
		{
			this.box_alert.visible = false;
			this.visible = false;
			let graph:Graph = GraphManager.getInstance().getCurrent();
			GraphManager.getInstance().save(graph);
			EventManager.getInstance().event(EventType.UPDATE_TAB_ITEM_STATUS, [graph.name, graph.name, false]);
			let item:model.GraphTabItemData = new model.GraphTabItemData();
			item.name = graph.name;
			EventManager.getInstance().event(EventType.DELETE_TAB_ITEM, [item]);
		}

		private onNoHandler(evt:Event):void
		{
			this.box_alert.visible = false;
		}

		private onCnClHandler(evt:Event):void
		{
			this.box_dir.visible = false;
		}

		private onRenderHandler(item:FileNavigatorViewItem, index:number):void
		{
			let fileInfo:FileInfo = item.dataSource;
			item.setData(fileInfo);
		}

		private onOpenFileHandler(id:string, isDir:boolean):void
		{
			let fileInfo:FileInfo = GraphManager.getInstance().getDirectory(id);
			if(!fileInfo)
			{
				console.error("error: not exist the file or directory!");
				return;
			}

			if(isDir)
			{
				this.data.directory = fileInfo;
				this.setData(this.data);
			}
			else
			{
				this.input_path.text = fileInfo.name;
			}
		}

		private onOpenOrSaveHandler(evt:Event):void
		{
			switch(this.data.type)
			{
				case MenuType.Save:
					let name:string = this.input_path.text.trim();
					if(name == "")
					{
						this.txt_error.visible = true;
						this.txt_error.text = "error: file name must not empty!";
					}
					else
					{
						let exist:boolean = GraphManager.getInstance().exist(name);
						this.box_alert.visible = exist;
						if(!exist)
						{
							// 取名保存
							let graph:Graph = GraphManager.getInstance().getCurrent();
							EventManager.getInstance().event(EventType.UPDATE_TAB_ITEM_STATUS, [GraphManager.getInstance().getCurrent().name, name, false]);
							GraphManager.getInstance().changeCurrentName(name);
							GraphManager.getInstance().save(graph);
							this.visible = false;
						}
					}
				break;
				case MenuType.Open:
					let fileName:string = this.input_path.text.trim();
					if(fileName == "")
						return;

					let data:GraphTabItemData = new GraphTabItemData();
					data.name = fileName;
					data.cache = false;
					EventManager.getInstance().event(EventType.ADD_TAB_ITEM, [data]);
					this.visible = false;
				break;
			}
		}

		private onCloseHandler(evt:Event):void
		{
			this.visible = false;
		}

		private onReturnHandler(evt:Event):void
		{
			this.data.directory = GraphManager.getInstance().getDirectory(this.data.directory.owner);
			this.setData(this.data);
		}
	}
}