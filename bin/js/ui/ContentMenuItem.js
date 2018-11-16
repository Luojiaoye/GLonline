/**
* 内容面板Item
* @author confiner
*/
var ui;
(function (ui) {
    class ContentMenuItem extends ui.Editor.Elements.ContentMenuItemUI {
        constructor() {
            super();
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
            this.clear();
            this.btn_add.visible = this.data.add;
            this.btn_switch.index = !this.data.open ? 0 : 1;
            this.txt_name.text = this.data.name;
            this.setWidth(this.data.width);
        }
        setWidth(w) {
            this.width = w;
            this.bg.width = w;
            this.btn_add.x = w - this.btn_add.width - 20;
        }
        clear() {
            this.btn_add.visible = false;
            this.btn_switch.index = 0;
            this.txt_name.text = "";
        }
    }
    ContentMenuItem.ADD = "add";
    ContentMenuItem.SWITCH = "switch";
    ui.ContentMenuItem = ContentMenuItem;
})(ui || (ui = {}));
//# sourceMappingURL=ContentMenuItem.js.map