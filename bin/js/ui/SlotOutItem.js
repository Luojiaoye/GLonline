/**
* @author confiner
* @desc  输出插槽Item
*/
var ui;
(function (ui) {
    var Elements = ui.Editor.Elements;
    var Point = Laya.Point;
    var Event = Laya.Event;
    var EventType = core.EventType;
    var EventManager = managers.EventManager;
    class SlotOutItem extends Elements.SlotOutItemUI {
        constructor() {
            super();
            this.addEvents();
        }
        // 获取描点位置
        getAnchorPosition() {
            return this.anchor.globalToLocal(this.getStagePosition());
        }
        // 设置锚点
        setAnchor(anchor) {
            this.anchor = anchor;
        }
        // 获取舞台位置
        getStagePosition() {
            let px = this.btn_executionOut.x;
            let py = this.btn_executionOut.y + (this.btn_executionOut.height >> 1) + 1;
            if (this.data.getType() == core.SlotType.DataOut) {
                px = this.btn_dataOut.x;
                py = this.btn_dataOut.y + (this.btn_dataOut.height >> 1) + 1;
            }
            let pos = new Point(px, py);
            let globalPos = this.localToGlobal(pos);
            return globalPos;
        }
        setData(data) {
            this.data = data;
            this.data.on(model.Model.UPDATE, this, this.update);
            this.update();
        }
        update() {
            this.btn_executionOut.visible = this.data.getType() == core.SlotType.ExecutionOut;
            this.btn_dataOut.visible = this.data.getType() == core.SlotType.DataOut;
            this.txt_type.visible = false;
            this.txt_slotName.text = this.data.getName();
            this.width = this.txt_slotName.width + this.txt_slotName.right;
            if (this.data.getType() == core.SlotType.DataOut) {
                this.txt_type.visible = true;
                this.txt_type.text = this.data.getDataType().toString() + ":";
                this.txt_type.right = this.txt_slotName.right + this.txt_slotName.width;
                this.width = this.txt_type.right + this.txt_type.width;
            }
            this.event(core.EventType.RESIZE, [false, this.width]);
        }
        destroy(destroyChild) {
            this.removeEvents();
            super.destroy(destroyChild);
        }
        clear() {
        }
        addEvents() {
            this.btn_dataOut.on(Event.MOUSE_DOWN, this, this.onEventHander);
            this.btn_dataOut.on(Event.MOUSE_UP, this, this.onEventHander);
            this.btn_dataOut.on(Event.MOUSE_OVER, this, this.onEventHander);
            this.btn_executionOut.on(Event.MOUSE_DOWN, this, this.onEventHander);
            this.btn_executionOut.on(Event.MOUSE_UP, this, this.onEventHander);
            this.btn_executionOut.on(Event.MOUSE_OVER, this, this.onEventHander);
        }
        setStatus(status) {
            if (!this.data)
                return;
            if (this.data.getType() == core.SlotType.ExecutionOut)
                this.btn_executionOut.selected = status;
            else if (this.data.getType() == core.SlotType.DataOut)
                this.btn_dataOut.selected = status;
        }
        onEventHander(evt) {
            switch (evt.type) {
                case Event.MOUSE_OVER:
                    if (ui.GraphContainer.slotType) {
                        EventManager.getInstance().event(EventType.LINE_END, [this, this.data]);
                    }
                    evt.stopPropagation();
                    break;
                case Event.MOUSE_DOWN:
                    EventManager.getInstance().event(EventType.LINE_START, [this, this.data]);
                    evt.stopPropagation();
                    break;
                case Event.MOUSE_UP:
                    evt.stopPropagation();
                    break;
            }
        }
        removeEvents() {
            this.btn_dataOut.off(Event.CLICK, this, this.onEventHander);
            this.btn_dataOut.off(Event.MOUSE_DOWN, this, this.onEventHander);
            this.btn_dataOut.off(Event.MOUSE_OVER, this, this.onEventHander);
            this.btn_executionOut.off(Event.CLICK, this, this.onEventHander);
            this.btn_executionOut.off(Event.MOUSE_DOWN, this, this.onEventHander);
            this.btn_executionOut.off(Event.MOUSE_OVER, this, this.onEventHander);
            if (this.data)
                this.data.off(model.Model.UPDATE, this, this.update);
        }
    }
    ui.SlotOutItem = SlotOutItem;
})(ui || (ui = {}));
//# sourceMappingURL=SlotOutItem.js.map