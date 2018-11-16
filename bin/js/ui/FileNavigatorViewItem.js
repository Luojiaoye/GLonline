/**
* 文件信息显示单元
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var EventType = core.EventType;
    var EventManager = managers.EventManager;
    class FileNavigatorViewItem extends ui.Editor.Elements.FileNavigatorViewItemUI {
        constructor() {
            super();
            this.init();
        }
        init() {
            this.on(Event.CLICK, this, this.onClickHandler);
            // this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
            // this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
        }
        onMouseHandler(evt) {
            this.img_over.visible = evt.type == Event.MOUSE_OVER;
            this.txt_name.color = evt.type == Event.MOUSE_OVER ? "#000000" : "#b5b5b5";
        }
        onClickHandler(evt) {
            EventManager.getInstance().event(EventType.OPEN_FILE, [this.data.id, this.data.isDir()]);
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
            this.img_over.visible = false;
            this.icon_dir.visible = false;
            this.icon_file_normal.visible = false;
            this.icon_file_over.visible = false;
            if (this.data.isDir())
                this.icon_dir.visible = true;
            else
                this.icon_file_normal.visible = true;
            this.txt_name.text = this.data.name;
        }
    }
    ui.FileNavigatorViewItem = FileNavigatorViewItem;
})(ui || (ui = {}));
//# sourceMappingURL=FileNavigatorViewItem.js.map