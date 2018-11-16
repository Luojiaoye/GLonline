/**
* 内容菜单界面
* @author confiner
*/
var ui;
(function (ui) {
    class ContentMenuView extends Laya.VBox {
        constructor() {
            super();
            this.init();
        }
        init() {
            this._tabs = new Map();
            this._views = new Map();
            managers.EventManager.getInstance().on(core.EventType.Content_Menu_UPDATE, this, this.refresh);
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            managers.EventManager.getInstance().off(core.EventType.Content_Menu_UPDATE, this, this.refresh);
        }
        deleteContent(name) {
            if (this._tabs.has(name)) {
                let content = this.getView(name);
                let sp = content.getContent();
                let item = this._tabs.get(name);
                item.removeChild(sp);
                sp.destroy();
                this.removeChild(item);
                item.offAll();
                item.destroy();
                this._tabs.delete(name);
                this._views.delete(name);
            }
            this.refresh();
        }
        addContent(menuData, content) {
            if (this._tabs.has(name))
                return;
            let tab = new ui.ContentMenuItem();
            tab.setData(menuData);
            this.addTab(menuData.name, tab);
            content.getContent().visible = menuData.open;
            this.addView(menuData.name, content);
        }
        getView(name) {
            return this._views.get(name);
        }
        addTab(name, tab) {
            if (this._tabs.has(name))
                return;
            this.addChild(tab);
            this._tabs.set(name, tab);
            tab.btn_add.on(Laya.Event.CLICK, this, this.onClickHandler, [tab]);
            tab.btn_switch.on(Laya.Event.CLICK, this, this.onClickHandler, [tab]);
            this.refresh();
        }
        addView(name, view) {
            if (!this._tabs.has(name))
                return;
            let content = view.getContent();
            let item = this._tabs.get(name);
            content.y = 43;
            item.addChild(content);
            this._views.set(name, view);
            this.refresh();
        }
        onClickHandler(item, evt) {
            let data = item.data;
            let view = this._views.get(data.name);
            if (!view)
                return;
            switch (evt.currentTarget) {
                case item.btn_add:
                    view.add();
                    data.open = true;
                    view.switcher(data);
                    item.setData(data);
                    break;
                case item.btn_switch:
                    data.open = !data.open;
                    view.switcher(data);
                    item.setData(data);
                    break;
            }
            this.refresh();
        }
    }
    ui.ContentMenuView = ContentMenuView;
})(ui || (ui = {}));
//# sourceMappingURL=ContentMenuView.js.map