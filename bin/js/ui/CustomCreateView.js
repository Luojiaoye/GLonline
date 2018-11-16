/**
* 变量创建界面
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    var EventType = core.EventType;
    var EventManager = managers.EventManager;
    var GraphManager = managers.GraphManager;
    var Label = Laya.Label;
    var Rectangle = Laya.Rectangle;
    class CustomCreateView extends ui.Editor.CustomCreateViewUI {
        constructor() {
            super();
            this.init();
        }
        setData(data) {
            this.data = data;
            this.update();
            this.data.on(model.Model.UPDATE, this, this.update);
        }
        add() {
            this.addCustom();
        }
        switcher(data) {
            this.visible = data.open;
            data.height = data.open ? this.height : 0;
        }
        getContent() {
            return this;
        }
        clear() {
            this.list_customs.visible = false;
            this.img_bg.visible = false;
        }
        update() {
            this.clear();
            if (!this.data || !this.data.customs || this.data.customs.length == 0) {
                return;
            }
            this.list_customs.height = this.data.customs.length * 29;
            this.list_customs.visible = true;
            this.list_customs.array = this.data.customs;
            this.list_customs.repeatY = this.data.customs.length;
            this.img_bg.visible = true;
            this.img_bg.height = this.list_customs.y + this.data.customs.length * 29 + 15;
            this.height = this.img_bg.height;
        }
        addCustom() {
            let graph = GraphManager.getInstance().getCurrent();
            if (!graph) {
                console.error("error: the current graph is null when add variable");
            }
            else {
                graph.createCustom();
            }
        }
        init() {
            this.createDragRegion();
            this.img_bg.visible = false;
            this.list_customs.visible = false;
            this.list_customs.renderHandler = new Handler(this, this.renderHandler);
            this.list_customs.mouseHandler = new Handler(this, this.onMouseClick);
            EventManager.getInstance().on(core.EventType.CHANGE_GRAPH, this, this.onChangeGraphHandler);
        }
        createDragRegion() {
            let pos = new Laya.Point(this.x, this.y);
            pos = this.localToGlobal(pos);
            this._dragRegion = new Rectangle(0, 160, 1920, 920);
        }
        onChangeGraphHandler() {
            let graph = GraphManager.getInstance().getCurrent();
            if (graph) {
                this.setData(graph);
            }
        }
        onMouseClick(evt, index) {
            let target = evt.currentTarget;
            if (target && evt.type == Event.MOUSE_DOWN) {
                let custom = target.data;
                if (custom) {
                    // 叶子节点
                    let item = new Label();
                    item.color = "#b5b5b5";
                    item.fontSize = 16;
                    item.text = custom.getName();
                    item.width = target.width;
                    item.height = target.height;
                    item.x = evt.stageX;
                    item.y = evt.stageY;
                    Laya.stage.addChild(item);
                    item.startDrag(this._dragRegion);
                    Laya.stage.on(Event.MOUSE_UP, this, this.onStageMouseUp, [custom, item]);
                }
            }
        }
        onStageMouseUp(custom, item, evt) {
            let pos = new Laya.Point(this.x, this.y);
            pos = this.localToGlobal(pos);
            if (!this._dragRegion.contains(item.x, item.y)) {
                // 不在拖动区域内则不处理
            }
            else if (item.x < pos.x + this.width) {
                // 落在节点列表不生成节点
            }
            else {
                EventManager.getInstance().event(EventType.ADD_CUSTOM_NODE, [custom, item.x, item.y]);
            }
            Laya.stage.off(Event.MOUSE_UP, this, this.onStageMouseUp);
            item.destroy();
            item = null;
        }
        renderHandler(item, index) {
            let custom = item.dataSource;
            item.setData(custom);
        }
    }
    ui.CustomCreateView = CustomCreateView;
})(ui || (ui = {}));
//# sourceMappingURL=CustomCreateView.js.map