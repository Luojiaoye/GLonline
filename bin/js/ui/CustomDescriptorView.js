/**
* 变量设置界面
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    class CustomDescriptorView extends ui.Editor.CustomDescriptorViewUI {
        constructor() {
            super();
        }
        setData(data) {
            this.data = data;
            this.update();
            this.data.on(model.Model.UPDATE, this, this.update);
        }
        add() {
        }
        switcher(data) {
            this.visible = data.open;
            data.height = data.open ? this.height : 0;
        }
        getContent() {
            return this;
        }
        update() {
            if (!this.data)
                return;
            this.cbx_types.selectedIndex = CustomDescriptorView._TYPES.indexOf(this.data.getType());
            this.check_bind.selected = this.data.getBind();
            this.input_varValue.text = this.data.getName();
            if (this.data.getType() == core.CustomType.BRIDGE) {
                this.data.setBind(true);
                this.check_bind.selected = true;
            }
        }
        initialize() {
            this.input_varValue.text = "";
            this.cbx_types.labels = CustomDescriptorView._LABS.join(",");
            this.cbx_types.selectHandler = new Handler(this, this.onSelectHandler);
            this.cbx_types.selectedIndex = 0;
            this.input_varValue.on(Event.INPUT, this, this.onInputHandler);
            this.check_bind.clickHandler = new Handler(this, this.clickHandler);
            this.check_bind.selected = true;
        }
        onSelectHandler(index) {
            let type = CustomDescriptorView._TYPES[index];
            if (type == core.CustomType.BRIDGE) {
                if (this.data)
                    this.data.setBind(this.check_bind.selected);
                this.check_bind.selected = true;
            }
            else {
                if (this.data)
                    this.data.setBind(false);
                this.check_bind.selected = false;
            }
            if (this.data) {
                this.data.setType(type);
                managers.EventManager.getInstance().event(core.EventType.CHANGE_CUSTOM_TYPE, [this.data]);
            }
        }
        clickHandler() {
            this.data.setBind(this.check_bind.selected);
        }
        onInputHandler() {
            let name = this.input_varValue.text.trim();
            this.data.setName(name);
        }
    }
    CustomDescriptorView._TYPES = [core.CustomType.BRIDGE, core.CustomType.SWITCH];
    CustomDescriptorView._LABS = [core.CustomType.BRIDGE.toString(), core.CustomType.SWITCH.toString()];
    ui.CustomDescriptorView = CustomDescriptorView;
})(ui || (ui = {}));
//# sourceMappingURL=CustomDescriptorView.js.map