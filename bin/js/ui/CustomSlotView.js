/**
* 自定义插槽界面
* @author confiner
*/
var ui;
(function (ui) {
    class CustomSlotView extends ui.Editor.CustomSlotViewUI {
        constructor(slotType) {
            super();
            this._type = slotType;
            this.init();
        }
        add() {
            if (this._type == core.SlotType.DataIn) {
                if (this.data.getType() == core.CustomType.SWITCH) {
                    if (this.data.getNode().getDataInputsCount() >= 1)
                        return;
                }
                this.data.createInputSlot();
                if (this.data.getBind())
                    this.data.createOutputSlot();
            }
            else if (this._type == core.SlotType.DataOut) {
                this.data.createOutputSlot();
                if (this.data.getBind())
                    this.data.createInputSlot();
            }
            else if (this._type == core.SlotType.ExecutionIn) {
                this.data.createExecutionInSlot();
            }
            else if (this._type == core.SlotType.ExecutionOut) {
                this.data.createExecutionOutSlot();
            }
        }
        switcher(data) {
            this.visible = data.open;
            data.height = data.open ? this.height : 0;
        }
        getContent() {
            return this;
        }
        setData(data) {
            this.data = data;
            this.update();
            this.data.on(model.Model.UPDATE, this, this.update);
        }
        update() {
            this.list_slots.visible = false;
            this.bg.visible = false;
            if (!this.data || !this.data.getNode())
                return;
            let slots = this.data.getNode().getSlotsByType(this._type);
            if (!slots || slots.length == 0)
                return;
            this.list_slots.visible = true;
            this.list_slots.height = slots.length * 30;
            this.list_slots.repeatY = slots.length;
            this.list_slots.array = slots;
            this.bg.visible = true;
            this.height = this.bg.height = this.list_slots.y + this.list_slots.height + 15;
        }
        init() {
            this.list_slots.visible = false;
            this.bg.visible = false;
            this.list_slots.renderHandler = new Handler(this, this.renderHandler);
            managers.EventManager.getInstance().on(core.EventType.DELETE_SLOT, this, this.delteSlot);
            managers.EventManager.getInstance().on(core.EventType.CHANGE_SLOT_NAME, this, this.changeSlotName);
            managers.EventManager.getInstance().on(core.EventType.CHANGE_SLOT_TYPE, this, this.changeeSlotType);
        }
        changeSlotName(slot, name) {
            if (this.data)
                this.data.changeSlotName(slot, name);
        }
        changeeSlotType(slot, type) {
            if (this.data)
                this.data.changeSlotDatumType(slot, type);
        }
        destroy(destroyChild) {
            managers.EventManager.getInstance().off(core.EventType.DELETE_SLOT, this, this.delteSlot);
            managers.EventManager.getInstance().off(core.EventType.CHANGE_SLOT_NAME, this, this.changeSlotName);
            managers.EventManager.getInstance().off(core.EventType.CHANGE_SLOT_TYPE, this, this.changeeSlotType);
            if (this.data)
                this.data.off(model.Model.UPDATE, this, this.update);
            if (this.parent)
                this.parent.removeChild(this);
            this.offAll();
            super.destroy(destroyChild);
        }
        delteSlot(slot) {
            if (this.data)
                this.data.deleteSlot(slot);
        }
        renderHandler(item, index) {
            item.on(core.EventType.RESORT, this, this.onResortHandler);
            let data = item.dataSource;
            if (data)
                item.setData(data);
            let slots = this.data.getNode().getSlotsByType(this._type);
            if (!slots || slots.length == 1)
                return;
            item.setUpDisable((index == 1 || index == 0));
            item.setDownDisable((index == 0 || index == slots.length - 1));
        }
        onResortHandler(slot, isUp) {
            if (this.data) {
                this.data.resortSlot(slot, isUp);
            }
        }
    }
    ui.CustomSlotView = CustomSlotView;
})(ui || (ui = {}));
//# sourceMappingURL=CustomSlotView.js.map