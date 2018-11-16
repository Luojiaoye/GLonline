/**
* 菜单界面
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    class MenuView extends ui.Editor.MenuViewUI {
        constructor() {
            super();
            this.list_Items.renderHandler = new Handler(this, this.onRenderHandler);
            this.on(Event.CLICK, this, this.onClickHandler);
        }
        onClickHandler(evt) {
            this.visible = false;
        }
        onRenderHandler(item, index) {
            let menuItem = item.dataSource;
            item.setData(menuItem);
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        update() {
            if (!this.data)
                return;
            this.list_Items.repeatY = this.data.length;
            this.list_Items.array = this.data;
            this.img_bg.height = this.data.length * 35 + this.list_Items.y + 12;
        }
    }
    ui.MenuView = MenuView;
})(ui || (ui = {}));
//# sourceMappingURL=MenuView.js.map