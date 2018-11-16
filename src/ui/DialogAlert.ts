/**
* name 
*/
module ui {
	export class DialogAlert extends Editor.AlertUI {
		private _data: any;
		constructor() {
			super();

			this.init();
		}

		public setData(data: any): void {
			this._data = data;
			if (this._data.content && this._data.content.length > 0) {
				let str: string = this._data.content.join(",");
				str = "Application changes will affect others graphs:" + str + ", Careful operation!";
				this.txt_content.text = str;
			}

			this.btn_cancel.y = this.btn_ok.y = this.txt_content.y + this.txt_content.height + 20;
			this.bg.height = this.btn_cancel.y + this.btn_cancel.height + 20;
			this.width = this.bg.width;
			this.height = this.bg.height;
		}

		private init(): void {
			this.btn_ok.on(Laya.Event.CLICK, this, this.clickHandler);
			this.btn_cancel.on(Laya.Event.CLICK, this, this.clickHandler);
		}

		public destroy(destroyChild: boolean): void {
			super.destroy(destroyChild);
			this.btn_ok.off(Laya.Event.CLICK, this, this.clickHandler);
			this.btn_cancel.off(Laya.Event.CLICK, this, this.clickHandler);
		}

		private clickHandler(evt: Laya.Event): void {
			switch (evt.target) {
				case this.btn_ok:
					if (this._data.flag) {
						Alert.alert(core.AlertType.CLOSE_GRAPH_TAB_ITEM, this._data.data);
					}
					else {
						managers.EventManager.getInstance().event(core.EventType.OPEN_NAVIGATOR, [this._data.data]);
					}
					break;
				case this.btn_cancel:
					let item: model.GraphTabItemData = new model.GraphTabItemData();
					item.name = this._data.name;
					managers.EventManager.getInstance().event(core.EventType.DELETE_TAB_ITEM, [item]);
					break;
			}
			this.close();
			//this.parent.removeChild(this);
		}
	}
}