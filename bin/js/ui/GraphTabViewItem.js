/**
* 流图TabItem界面
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var AlertType = core.AlertType;
    var EventManager = managers.EventManager;
    var EventType = core.EventType;
    class GraphTabViewItem extends ui.Editor.Elements.GraphTabViewItemUI {
        constructor() {
            super();
            this.init();
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
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
        init() {
            this.name = "GraphTabViewItem";
            this.btn_close.on(Event.CLICK, this, this.onCloseHandler);
            this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
            this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
            this.on(Event.CLICK, this, this.changeTabHandler);
            EventManager.getInstance().on(EventType.UPDATE_TAB_ITEM_STATUS, this, this.updateStatus);
            EventManager.getInstance().on(EventType.SELECT_TAB_ITEM, this, this.onSelectHandler);
        }
        onSelectHandler(name) {
            if (this.data) {
                let select = name == this.data.name;
                this.setSelect(select);
            }
        }
        updateStatus(oldName, newName, status) {
            if (this.data && this.data.name == oldName) {
                this.txt_new.visible = status;
                this.txt_name.text = newName;
                this.data.cache = status;
            }
        }
        changeTabHandler(evt) {
            if (evt.currentTarget == this)
                EventManager.getInstance().event(EventType.CHANGE_TAB, [this.data]);
        }
        onMouseHandler(evt) {
            this.img_over.visible = evt.type == Event.MOUSE_OVER;
            this.img_down.visible = false;
            this.img_normal.visible = evt.type == Event.MOUSE_OUT;
            //this.txt_name.color = evt.type == Event.MOUSE_OVER ? "#ffffff" : "#758294";
        }
        setSelect(select) {
            this.img_down.visible = select;
            this.img_normal.visible = !select;
            this.img_over.visible = false;
        }
        onCloseHandler(evt) {
            if (evt.currentTarget != this.btn_close)
                return;
            this.img_down.visible = true;
            this.img_normal.visible = false;
            this.img_over.visible = false;
            if (this.data.cache) {
                let nGraph = managers.GraphManager.getInstance().getCurrent();
                if (nGraph) {
                    let relativeGrpahs = nGraph.checkCommit();
                    if (!relativeGrpahs)
                        ui.Alert.alert(AlertType.CLOSE_GRAPH_TAB_ITEM, this.data);
                    else {
                        let alert = new ui.DialogAlert();
                        alert.popupCenter = true;
                        alert.setData({ "content": relativeGrpahs, "data": this.data, "flag": true, "name": nGraph.name });
                        alert.popup();
                    }
                }
            }
            else {
                let nGraph = managers.GraphManager.getInstance().getCurrent();
                if (nGraph) {
                    EventManager.getInstance().event(EventType.DELETE_TAB_ITEM, [this.data]);
                }
                evt.stopPropagation();
            }
        }
    }
    ui.GraphTabViewItem = GraphTabViewItem;
})(ui || (ui = {}));
//# sourceMappingURL=GraphTabViewItem.js.map