/**
* @author confiner
* @desc 节点视图
*/
var ui;
(function (ui) {
    var Elements = ui.Editor.Elements;
    var GraphManager = managers.GraphManager;
    class NodeView extends Elements.NodeViewUI {
        constructor() {
            super();
            this._box_slots = null; // 插槽界面
            this._anchor = null;
            this.clearStatus();
            this.addEvents();
            //Laya.timer.frameLoop(100, this, this.postUpdate);
        }
        postUpdate() {
            this.debugSprite(this);
            this.graphics;
        }
        debugSprite(sp) {
            let num = sp.numChildren;
            let child = null;
            if (num == 0) {
                if (sp["graphics"]) {
                    //sp["graphics"].clear();
                    sp["graphics"].drawRect(0, 0, sp["width"], sp["height"], null, "#ff0000", 1);
                }
            }
            else {
                while (num > 0) {
                    num--;
                    child = sp.getChildAt(num);
                    this.debugSprite(child);
                }
            }
        }
        // 销毁对象
        destroy(destroyChild) {
            super.destroy(destroyChild);
            managers.EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.debugResultHandler);
            managers.EventManager.getInstance().off(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
            this.offAll();
        }
        // 添加事件
        addEvents() {
            this.check_entry.clickHandler = new Handler(this, this.clickHandler, [this.check_entry]);
            this.check_exit.clickHandler = new Handler(this, this.clickHandler, [this.check_exit]);
            this.cbx_debug.clickHandler = new Handler(this, this.debugHandler);
            managers.EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
            managers.EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.debugResultHandler);
        }
        onDebugOperationHandler(operationType) {
            if (operationType == core.DebugType.DebugExit.toString()) {
                this.img_old.visible = this.img_status.visible = false;
                this.cbx_debug.selected = false;
            }
        }
        debugResultHandler(operationType) {
            this.img_old.visible = false;
            this.img_status.visible = false;
            let graphDebugInfo = managers.DebugManager.getInstance().getCurrent();
            if (graphDebugInfo) {
                if (graphDebugInfo.getHitNodeId() == this.data.id) {
                    this.img_status.visible = true;
                    this.img_status.width = this.img_select.width;
                    this.img_status.height = this.img_select.height;
                    if (this.img_select.visible)
                        this.img_select.visible = false;
                }
                // else if(graphDebugInfo.isInDebugStack(this.data.id))
                // {
                // 	this.img_old.visible = true;
                // 	this.img_old.width = this.img_select.width;
                // 	this.img_old.height = this.img_select.height;
                // }
            }
        }
        debugHandler() {
            let isDebug = this.cbx_debug.selected;
            this.data.setDebug(isDebug);
            if (isDebug)
                managers.DebugManager.getInstance().debugAdd(this.data.id);
            else
                managers.DebugManager.getInstance().debugDelete(this.data.id);
        }
        clickHandler(check) {
            let graph = GraphManager.getInstance().getGraph(this.data.ownerGraphName);
            if (!graph) {
                console.error("error: node name:" + this.data.getName() + " belong to graph name + " + this.data.ownerGraphName + " is null");
            }
            else {
                if (check == this.check_entry)
                    graph.childNodeCall = this.data.id;
                else if (check == this.check_exit)
                    graph.childNodeReturn = this.data.id;
            }
        }
        // 获取插槽
        getItem(slotId) {
            return this._box_slots.getSlotInItem(slotId);
        }
        // 更新
        update() {
            this.box_right.visible = !this.data.isBak;
            this.box_error.visible = this.data.isBak;
            this.box_error.mouseEnabled = this.data.isBak;
            this.cbx_debug.visible = this.data.type != core.NodeType.Data;
            this.img_title.skin = "editor/" + (managers.NodeManager.getInstance().GetColorId(this.data.category) % 11) + ".png";
            this.txt_nodeName.text = this.data.getName();
            let w = 2 * this.txt_nodeName.x + this.txt_nodeName.width + 20 + this.cbx_debug.width + 20;
            this.cbx_debug.x = this.txt_nodeName.x + this.txt_nodeName.width + 20;
            w = Math.max(w, 180);
            this.txt_category.text = this.data.category.toString();
            let graph = GraphManager.getInstance().getGraph(this.data.ownerGraphName);
            if (graph) {
                this.check_entry.selected = graph.childNodeCall == this.data.id;
                this.check_exit.selected = graph.childNodeReturn == this.data.id;
            }
            if (!this._box_slots) {
                this._box_slots = new ui.SlotsView();
                this._box_slots.setAnchor(this._anchor);
                this._box_slots.width = w;
                this._box_slots.y = this.img_title.height;
                this.addChild(this._box_slots);
                this._box_slots.on(core.EventType.RESIZE, this, this.onResizeHandler);
            }
            this._box_slots.setData(this.data);
            this.bg.height = this._box_slots.y + this._box_slots.height + 45;
            if (!this.data.isBak) {
                this.box_right.height = this.bg.height;
                this.box_right.width = this.bg.width;
            }
            this.cbx_debug.selected = this.data.getDebug();
            this._box_slots.visible = !this.data.isBak;
        }
        setAnchor(anchor) {
            this._anchor = anchor;
        }
        onResizeHandler() {
            if (this._box_slots) {
                this.bg.width = this._box_slots.width + 14;
                this.img_title.width = this._box_slots.width;
                this.img_select.width = this._box_slots.width + 28;
                this.width = this.bg.width;
                this.cbx_debug.right = 20;
                this.bg.height = this.img_title.height + this._box_slots.height + 45;
                this.img_select.height = this.bg.height + 22;
                this.height = this.bg.height;
                this._box_slots.updateLayout();
                this.check_entry.left = 13;
                this.check_entry.bottom = 20;
                this.check_exit.right = 21;
                this.check_exit.bottom = 20;
                if (!this.data.isBak) {
                    this.box_right.height = this.bg.height;
                    this.box_right.width = this.bg.width;
                }
            }
        }
        setSelect(slect) {
            this.clearStatus();
            let graphDebugInfo = managers.DebugManager.getInstance().getCurrent();
            if (!graphDebugInfo) {
                this.img_select.visible = slect;
            }
            else {
                if (graphDebugInfo.getHitNodeId() == this.data.id) {
                    this.img_status.visible = true;
                }
            }
        }
        clearStatus() {
            this.img_select.visible = false;
            this.img_old.visible = false;
            this.img_status.visible = false;
        }
        // 设置数据
        setData(data) {
            this.data = data;
            this.update();
            // 测试边框
            // this.graphics.drawLine(0, 0, this.width, 0, "#ff0000", 1);
            // this.graphics.drawLine(this.width, 0, this.width, this.height, "#ff0000", 1);
            // this.graphics.drawLine(this.width, this.height, 0, this.height, "#ff0000", 1);
            // this.graphics.drawLine(0, this.height, 0, 0, "#ff0000", 1);
        }
    }
    ui.NodeView = NodeView;
})(ui || (ui = {}));
//# sourceMappingURL=NodeView.js.map