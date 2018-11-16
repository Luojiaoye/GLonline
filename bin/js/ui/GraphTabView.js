/**
* GraphTabView
* @author confiner
*/
var ui;
(function (ui) {
    var GraphTabItemData = model.GraphTabItemData;
    var EventManager = managers.EventManager;
    var EventType = core.EventType;
    var Event = Laya.Event;
    var GraphManager = managers.GraphManager;
    class GraphTabView extends ui.Editor.GraphTabViewUI {
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
            this.list_menu.visible = true;
            this.list_menu.repeatX = this.data.length;
            this.list_menu.array = this.data;
            this.list_menu.renderHandler = new Handler(this, this.onRenderHandler);
            this.list_menu.selectHandler = new Handler(this, this.onSelectHandler);
            this.btn_add.x = this.list_menu.x + this.list_menu.array.length * 178 + 20;
        }
        onSelectHandler(index) {
            let item = this.list_menu.getCell(index);
            if (item)
                item.setSelect(true);
        }
        onRenderHandler(item, index) {
            let data = item.dataSource;
            item.setData(data);
        }
        init() {
            this.list_menu.visible = false;
            EventManager.getInstance().on(EventType.ADD_TAB_ITEM, this, this.addItem);
            EventManager.getInstance().on(EventType.DELETE_TAB_ITEM, this, this.deleteItem);
            this.onResizeHandler();
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);
            this.btn_add.on(Event.CLICK, this, this.onAddFile);
        }
        onResizeHandler() {
            this.bg.width = window.innerWidth - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).x;
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
            EventManager.getInstance().off(EventType.ADD_TAB_ITEM, this, this.addItem);
            EventManager.getInstance().off(EventType.DELETE_TAB_ITEM, this, this.deleteItem);
            this.btn_add.off(Event.CLICK, this, this.onAddFile);
        }
        onAddFile(evt) {
            if (evt.currentTarget == this.btn_add) {
                let graph = GraphManager.getInstance().createGraph();
                let fixedVars = managers.VariableManager.getInstance().getVariables();
                let variable = null;
                for (let i = 0, len = fixedVars.length; i < len; ++i) {
                    variable = graph.createVariable();
                    variable.setName(fixedVars[i].getName());
                    variable.setType(fixedVars[i].getType());
                    variable.setValue(fixedVars[i].getValue());
                }
                let data = new GraphTabItemData();
                data.name = graph.name;
                data.cache = true;
                this.addItem(data);
            }
        }
        addItem(itemData) {
            if (!this.data)
                this.data = new Array();
            if (this.data.find(elem => elem.name == itemData.name))
                return;
            this.data.push(itemData);
            this.setData(this.data);
            EventManager.getInstance().event(EventType.CHANGE_TAB, [itemData]);
        }
        deleteItem(itemData) {
            if (!this.data)
                return;
            for (let i = 0; i < this.data.length; ++i) {
                if (this.data[i].name == itemData.name) {
                    this.data.splice(i, 1);
                    managers.DebugManager.getInstance().debugExit();
                    break;
                }
            }
            this.setData(this.data);
        }
    }
    ui.GraphTabView = GraphTabView;
})(ui || (ui = {}));
//# sourceMappingURL=GraphTabView.js.map