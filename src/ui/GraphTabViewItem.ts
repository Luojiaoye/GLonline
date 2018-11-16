/**
* 流图TabItem界面
* @author confiner
*/
module ui {
	import IData = core.IData;
	import GraphTabItemData = model.GraphTabItemData;
	import Event = Laya.Event;
	import AlertType = core.AlertType;
	import EventManager = managers.EventManager;
	import EventType = core.EventType;

	export class GraphTabViewItem extends Editor.Elements.GraphTabViewItemUI implements IData {
		data: GraphTabItemData;

		setData(data: GraphTabItemData): void {
			this.data = data;
			this.update();
		}

		private update(): void {
			if (!this.data)
				return;

			this.txt_name.text = this.data.name;
			this.txt_new.visible = this.data.cache;
			//this.btn_close.x = this.txt_name.x + this.txt_name.width + 10;
			this.img_down.visible = false;
			this.img_normal.visible = true;
			this.img_over.visible = false;
			//this.img_normal.width = this.img_down.width = this.img_over.width = this.btn_close.x + this.btn_close.width + 25;
		}

		constructor() {
			super();

			this.init();
		}

		private init(): void {
			this.name = "GraphTabViewItem";
			this.btn_close.on(Event.CLICK, this, this.onCloseHandler);
			this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
			this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
			this.on(Event.CLICK, this, this.changeTabHandler);

			EventManager.getInstance().on(EventType.UPDATE_TAB_ITEM_STATUS, this, this.updateStatus);
			EventManager.getInstance().on(EventType.SELECT_TAB_ITEM, this, this.onSelectHandler);
		}

		private onSelectHandler(name: string): void {
			if (this.data) {
				let select: boolean = name == this.data.name;
				this.setSelect(select);
			}
		}

		private updateStatus(oldName: string, newName: string, status: boolean): void {
			if (this.data && this.data.name == oldName) {
				this.txt_new.visible = status;
				this.txt_name.text = newName;
				this.data.cache = status;
			}
		}

		private changeTabHandler(evt: Event): void {
			if (evt.currentTarget == this)
				EventManager.getInstance().event(EventType.CHANGE_TAB, [this.data]);
		}

		private onMouseHandler(evt: Event): void {
			this.img_over.visible = evt.type == Event.MOUSE_OVER;
			this.img_down.visible = false;
			this.img_normal.visible = evt.type == Event.MOUSE_OUT;
			//this.txt_name.color = evt.type == Event.MOUSE_OVER ? "#ffffff" : "#758294";
		}

		public setSelect(select: boolean): void {
			this.img_down.visible = select;
			this.img_normal.visible = !select;
			this.img_over.visible = false;
		}

		private onCloseHandler(evt: Event): void {
			if (evt.currentTarget != this.btn_close)
				return;

			this.img_down.visible = true;
			this.img_normal.visible = false;
			this.img_over.visible = false;

			if (this.data.cache){
				let nGraph: model.Graph = managers.GraphManager.getInstance().getCurrent();
				if (nGraph) {
					let relativeGrpahs: Array<string> = nGraph.checkCommit();
					if (!relativeGrpahs)
						Alert.alert(AlertType.CLOSE_GRAPH_TAB_ITEM, this.data);
					else {
						let alert:DialogAlert = new DialogAlert();
						alert.popupCenter = true;
						alert.setData({"content":relativeGrpahs, "data":this.data, "flag":true, "name":nGraph.name});
						alert.popup();
					}
				}
			}
			else {
				let nGraph: model.Graph = managers.GraphManager.getInstance().getCurrent();
				if (nGraph) {
					EventManager.getInstance().event(EventType.DELETE_TAB_ITEM, [this.data]);
				}
				evt.stopPropagation();
			}
		}
	}
}