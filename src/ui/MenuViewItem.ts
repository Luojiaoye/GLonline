/**
* 菜单栏item
* @author confiner  
*/
module ui {
	import Event = Laya.Event;
	import MenuType = core.MenuType;
	import EventType = core.EventType;
	import EventManager = managers.EventManager;
	import GraphTabItemData = model.GraphTabItemData;
	import Graph = model.Graph;
	import GraphManager = managers.GraphManager;

	export class MenuViewItem extends Editor.Elements.MenuViewItemUI implements IData {
		data: MenuType;

		constructor() {
			super();

			this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
			this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
			this.on(Event.CLICK, this, this.onMouseHandler);
		}

		private onMouseHandler(evt: Event): void {
			if (evt.type == Event.CLICK) {
				switch (this.data) {
					case MenuType.Open:
						EventManager.getInstance().event(EventType.OPEN_NAVIGATOR, [this.data]);
						break;

					case MenuType.Save:
						let nGraph: model.Graph = GraphManager.getInstance().getCurrent();
						if (nGraph) {
							let relativeGrpahs: Array<string> = nGraph.checkCommit();
							if (!relativeGrpahs)
								EventManager.getInstance().event(EventType.OPEN_NAVIGATOR, [this.data]);
							else {
								//console.log(relativeGrpahs.join(","));
								let alert: DialogAlert = new DialogAlert();
								alert.popupCenter = true;
								alert.setData({ "content": relativeGrpahs, "data": this.data, "flag": false, "name":nGraph.name });
								alert.popup();
							}
						}
						break;

					case MenuType.New:
						let graph: Graph = GraphManager.getInstance().createGraph();
						let data: GraphTabItemData = new GraphTabItemData();
						data.name = graph.name;
						data.cache = true;
						EventManager.getInstance().event(EventType.ADD_TAB_ITEM, [data]);
						break;
				}
			}

			if (evt.type == Event.MOUSE_OVER) {
				this.img_over.visible = true;
				this.txt_name.color = "#000000";
			}
			else {
				this.img_over.visible = false;
				this.txt_name.color = "#b5b5b5";
			}
		}

		setData(data: MenuType): void {
			this.data = data;
			this.update();
		}

		private update(): void {
			if (this.data)
				this.txt_name.text = this.data.toString();
		}
	}
}