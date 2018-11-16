/**
* GraphTabItemCloseView
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var EventType = core.EventType;
    var EventManager = managers.EventManager;
    var MenuType = core.MenuType;
    class GraphTabItemCloseView extends ui.Editor.GraphTabItemCloseAlertUI {
        constructor() {
            super();
            this.init();
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        init() {
            this.btn_save.on(Event.CLICK, this, this.onSaveFile);
            this.btn_cancel.on(Event.CLICK, this, this.onNotSaveFile);
        }
        onSaveFile(evt) {
            EventManager.getInstance().event(EventType.CLOSE_ALERT);
            EventManager.getInstance().event(EventType.OPEN_NAVIGATOR, [MenuType.Save]);
        }
        onNotSaveFile(evt) {
            EventManager.getInstance().event(EventType.CLOSE_ALERT);
            EventManager.getInstance().event(EventType.DELETE_TAB_ITEM, [this.data]);
        }
        update() {
        }
    }
    ui.GraphTabItemCloseView = GraphTabItemCloseView;
})(ui || (ui = {}));
//# sourceMappingURL=GraphTabItemCloseView.js.map