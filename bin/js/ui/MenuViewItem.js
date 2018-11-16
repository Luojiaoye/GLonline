/**
* 菜单栏item
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var MenuType = core.MenuType;
    var EventType = core.EventType;
    var EventManager = managers.EventManager;
    var GraphTabItemData = model.GraphTabItemData;
    var GraphManager = managers.GraphManager;
    class MenuViewItem extends ui.Editor.Elements.MenuViewItemUI {
        constructor() {
            super();
            this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
            this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
            this.on(Event.CLICK, this, this.onMouseHandler);
        }
        onMouseHandler(evt) {
            if (evt.type == Event.CLICK) {
                switch (this.data) {
                    case MenuType.Open:
                        EventManager.getInstance().event(EventType.OPEN_NAVIGATOR, [this.data]);
                        break;
                    case MenuType.Save:
                        let nGraph = GraphManager.getInstance().getCurrent();
                        if (nGraph) {
                            let relativeGrpahs = nGraph.checkCommit();
                            if (!relativeGrpahs)
                                EventManager.getInstance().event(EventType.OPEN_NAVIGATOR, [this.data]);
                            else {
                                //console.log(relativeGrpahs.join(","));
                                let alert = new ui.DialogAlert();
                                alert.popupCenter = true;
                                alert.setData({ "content": relativeGrpahs, "data": this.data, "flag": false, "name": nGraph.name });
                                alert.popup();
                            }
                        }
                        break;
                    case MenuType.New:
                        let graph = GraphManager.getInstance().createGraph();
                        let data = new GraphTabItemData();
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
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
            if (this.data)
                this.txt_name.text = this.data.toString();
        }
    }
    ui.MenuViewItem = MenuViewItem;
})(ui || (ui = {}));
//# sourceMappingURL=MenuViewItem.js.map