/**
* 调试栈Item
@author confiner
*/
var ui;
(function (ui) {
    class DebugStackViewItem extends ui.Editor.Elements.DebugStackViewItemUI {
        constructor() {
            super();
            this.clear();
            this.on(Laya.Event.MOUSE_OVER, this, this.onMouseHandler);
            this.on(Laya.Event.MOUSE_OUT, this, this.onMouseHandler);
            managers.EventManager.getInstance().on(core.EventType.DEBUG_ITEM_SELECT, this, this.onSelectHandler);
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            this.offAll();
            managers.EventManager.getInstance().off(core.EventType.DEBUG_ITEM_SELECT, this, this.onSelectHandler);
        }
        onSelectHandler() {
            this.img_select.visible = false;
            this.img_over.visible = false;
        }
        onMouseHandler(evt) {
            this.img_over.visible = evt.type == Laya.Event.MOUSE_OVER;
        }
        clear() {
            this.icon_cur.visible = false;
            this.img_select.visible = false;
            this.txt_nodeInfo.visible = false;
            this.icon_select.visible = false;
            this.img_over.visible = false;
        }
        setData(data) {
            this.data = data;
            this.update();
        }
        setSelect() {
            if (!this.data)
                return;
            let nodeId = this.data.getHitNodeId();
            let graphDebugInfo = managers.DebugManager.getInstance().getStackHead();
            if (graphDebugInfo) {
                if (graphDebugInfo.getHitNodeId() == nodeId) {
                    this.icon_select.visible = true;
                }
                else {
                    this.img_select.visible = true;
                    this.img_over.visible = false;
                }
            }
        }
        update() {
            if (!this.data)
                return;
            let nodeId = this.data.getHitNodeId();
            let graphDebugInfo = managers.DebugManager.getInstance().getStackHead();
            if (graphDebugInfo) {
                this.txt_nodeInfo.visible = true;
                if (graphDebugInfo.getHitNodeId() == nodeId) {
                    // 当前击中断点
                    this.icon_cur.visible = true;
                    this.icon_select.visible = false;
                    this.txt_nodeInfo.color = "#efc748";
                }
                else {
                    this.icon_cur.visible = false;
                    this.txt_nodeInfo.color = "#adadad";
                }
                this.txt_nodeInfo.text = this.data.getName()
                    + ":" + managers.GraphManager.getInstance().getCurrent().getNodeById(nodeId).getName()
                    + ":" + nodeId;
            }
        }
    }
    ui.DebugStackViewItem = DebugStackViewItem;
})(ui || (ui = {}));
//# sourceMappingURL=DebugStackViewItem.js.map