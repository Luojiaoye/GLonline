/**
* 创建变量的Item
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var EventManager = managers.EventManager;
    var EventType = core.EventType;
    var GraphManager = managers.GraphManager;
    class VariableCreateViewItem extends ui.Editor.Elements.VariableCreateViewItemUI {
        constructor() {
            super();
            this.init();
        }
        setData(data) {
            if (data.equals(this.data))
                return;
            this.data = data;
            this.update();
            this.data.on(model.Model.UPDATE, this, this.update);
        }
        init() {
            this.btn_delete.visible = false;
            this.img_over.visible = false;
            this.btn_delete.on(Event.CLICK, this, this.onDeleteHandler);
            this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
            this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
            this.on(Event.CLICK, this, this.onMouseHandler);
        }
        onMouseHandler(evt) {
            if (evt.currentTarget == this) {
                switch (evt.type) {
                    case Event.MOUSE_OVER:
                        this.img_over.visible = true;
                        this.btn_delete.visible = true;
                        break;
                    case Event.MOUSE_OUT:
                        this.img_over.visible = false;
                        this.btn_delete.visible = false;
                        break;
                    case Event.CLICK:
                        EventManager.getInstance().event(EventType.VARIABLE_DETAIL, [this.data]);
                        break;
                }
            }
        }
        onDeleteHandler(evt) {
            if (evt.currentTarget == this.btn_delete) {
                let graph = GraphManager.getInstance().getCurrent();
                if (!graph) {
                    console.error("error: the current graph is null when delete variable");
                }
                else {
                    graph.removeVariable(this.data);
                    managers.EventManager.getInstance().event(core.EventType.HIDE_DETAIL);
                }
                evt.stopPropagation();
            }
        }
        update() {
            if (!this.data)
                return;
            this.txt_name.text = this.data.getName();
        }
    }
    ui.VariableCreateViewItem = VariableCreateViewItem;
})(ui || (ui = {}));
//# sourceMappingURL=VariableCreateViewItem.js.map