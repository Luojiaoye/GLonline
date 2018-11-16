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
    class VariableCreateView extends ui.Editor.VariableCreateViewUI {
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
            this.addVariable();
        }
        switcher(data) {
            this.visible = data.open;
            data.height = data.open ? this.height : 0;
        }
        getContent() {
            return this;
        }
        clear() {
            this.list_varibles.visible = false;
            this.img_bg.visible = false;
            this.height = 0;
        }
        update() {
            this.clear();
            if (!this.data || !this.data.variables || this.data.variables.length == 0) {
                return;
            }
            this.list_varibles.visible = true;
            this.list_varibles.height = this.data.variables.length * 29;
            this.list_varibles.repeatY = this.data.variables.length;
            this.list_varibles.array = this.data.variables;
            this.img_bg.visible = true;
            this.height = this.img_bg.height = this.list_varibles.y + this.list_varibles.height + 15;
            managers.EventManager.getInstance().event(core.EventType.Content_Menu_UPDATE);
        }
        addVariable() {
            if (this.data)
                this.data.createVariable();
        }
        init() {
            this.createDragRegion();
            this.list_varibles.visible = false;
            this.img_bg.visible = false;
            this.list_varibles.mouseHandler = new Handler(this, this.onMouseHandler);
            this.list_varibles.renderHandler = new Handler(this, this.renderHandler);
            EventManager.getInstance().on(core.EventType.CHANGE_GRAPH, this, this.onChangeGraphHandler);
            managers.EventManager.getInstance().on(core.EventType.DELETE_TAB_ITEM, this, this.clear);
        }
        destroy(destroyChild) {
            EventManager.getInstance().off(core.EventType.CHANGE_GRAPH, this, this.onChangeGraphHandler);
            managers.EventManager.getInstance().off(core.EventType.DELETE_TAB_ITEM, this, this.clear);
            super.destroy(destroyChild);
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
        onMouseHandler(evt, index) {
            let target = evt.currentTarget;
            if (!target)
                return;
            if (evt.type == Event.MOUSE_DOWN) {
                let variable = target.data;
                if (variable) {
                    // 叶子节点
                    let item = new Label();
                    item.color = "#b5b5b5";
                    item.fontSize = 16;
                    item.text = variable.getName();
                    item.width = target.width;
                    item.height = target.height;
                    item.x = evt.stageX;
                    item.y = evt.stageY;
                    Laya.stage.addChild(item);
                    item.startDrag(this._dragRegion);
                    Laya.stage.on(Event.MOUSE_UP, this, this.onStageMouseUp, [variable, item]);
                }
            }
        }
        onStageMouseUp(variable, item, evt) {
            let pos = new Laya.Point(this.x, this.y);
            pos = this.localToGlobal(pos);
            if (!this._dragRegion.contains(item.x, item.y)) {
                // 不在拖动区域内则不处理
            }
            else if (item.x < pos.x + this.width) {
                // 落在节点列表不生成节点
            }
            else {
                EventManager.getInstance().event(EventType.ADD_VARIABLE_VIEW, [variable, item.x, item.y]);
            }
            Laya.stage.off(Event.MOUSE_UP, this, this.onStageMouseUp);
            item.destroy();
            item = null;
        }
        renderHandler(item, index) {
            let variable = item.dataSource;
            item.setData(variable);
        }
    }
    ui.VariableCreateView = VariableCreateView;
})(ui || (ui = {}));
//# sourceMappingURL=VariableCreateView.js.map