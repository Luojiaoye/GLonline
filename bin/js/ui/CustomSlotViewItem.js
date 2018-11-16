/**
* 自定义插槽Item
* @author confiner
*/
var ui;
(function (ui) {
    class CustomSlotViewItem extends ui.Editor.Elements.CustomSlotViewItemUI {
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
            this.input_varValue.text = this.data.getName();
            if (this.data.getType() == core.SlotType.ExecutionIn || this.data.getType() == core.SlotType.ExecutionOut) {
                this.cmb_types.selectedLabel = "";
                this.cmb_types.disabled = true;
                this.btn_up.disabled = true;
                this.btn_down.disabled = true;
            }
            else {
                this.cmb_types.disabled = false;
                this.btn_up.disabled = false;
                this.btn_down.disabled = false;
                if (this.data.getDataType())
                    this.cmb_types.selectedLabel = this.data.getDataType().toString();
            }
        }
        init() {
            this.input_varValue.text = "";
            this.cmb_types.labels = CustomSlotViewItem._LABS.join(",");
            this.cmb_types.selectHandler = new Handler(this, this.onSelectHandler);
            //this.input_varValue.on(Laya.Event.INPUT, this, this.onInputHandler);
            this.input_varValue.on(Laya.Event.KEY_DOWN, this, this.onInputHandler);
            this.btn_delete.on(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_up.on(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_down.on(Laya.Event.CLICK, this, this.onClickHandler);
        }
        setUpDisable(disabled) {
            this.btn_up.disabled = disabled;
        }
        setDownDisable(disabled) {
            this.btn_down.disabled = disabled;
        }
        onClickHandler(evt) {
            if (evt.currentTarget == this.btn_delete) {
                managers.EventManager.getInstance().event(core.EventType.DELETE_SLOT, [this.data]);
            }
            else if (evt.currentTarget == this.btn_up) {
                this.event(core.EventType.RESORT, [this.data, true]);
            }
            else if (evt.currentTarget == this.btn_down) {
                this.event(core.EventType.RESORT, [this.data, false]);
            }
        }
        onSelectHandler(index) {
            let type = CustomSlotViewItem._TYPES[index];
            //this.data.setDataType(type);
            managers.EventManager.getInstance().event(core.EventType.CHANGE_SLOT_TYPE, [this.data, type]);
        }
        onInputHandler(evt) {
            if (evt.keyCode == Laya.Keyboard.ENTER) {
                let name = this.input_varValue.text.trim();
                //this.data.setName(name);
                managers.EventManager.getInstance().event(core.EventType.CHANGE_SLOT_NAME, [this.data, name]);
            }
        }
        destroy(destroyChild) {
            this.offAll();
            this.input_varValue.off(Laya.Event.KEY_DOWN, this, this.onInputHandler);
            this.btn_delete.off(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_up.off(Laya.Event.CLICK, this, this.onClickHandler);
            this.btn_down.off(Laya.Event.CLICK, this, this.onClickHandler);
            super.destroy(destroyChild);
        }
    }
    CustomSlotViewItem._TYPES = [core.DatumType.Int, core.DatumType.Number,
        core.DatumType.Vector3, core.DatumType.String,
        core.DatumType.Boolean, core.DatumType.UserId];
    CustomSlotViewItem._LABS = [core.DatumType.Int.toString(), core.DatumType.Number.toString(),
        core.DatumType.Vector3.toString(), core.DatumType.String.toString(),
        core.DatumType.Boolean.toString(), core.DatumType.UserId.toString()];
    ui.CustomSlotViewItem = CustomSlotViewItem;
})(ui || (ui = {}));
//# sourceMappingURL=CustomSlotViewItem.js.map