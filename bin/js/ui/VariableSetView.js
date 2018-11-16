/**
* 变量设置界面
* @author confiner
*/
var ui;
(function (ui) {
    var DatumType = core.DatumType;
    var Event = Laya.Event;
    class VariableSetView extends ui.Editor.VariableSetViewUI {
        constructor() {
            super();
        }
        setData(data) {
            this.data = data;
            this.update();
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
            this.input_varName.text = this.data.getName();
            this.cbox_types.selectedLabel = this.data.getType().toString();
        }
        initialize() {
            this.input_varName.text = "";
            this.cbox_types.labels = VariableSetView._LABS.join(",");
            this.cbox_types.selectHandler = new Handler(this, this.onSelectHandler);
            this.input_varName.on(Event.INPUT, this, this.onInputHandler);
        }
        onSelectHandler(index) {
            let type = VariableSetView._TYPES[index];
            if (type != this.data.getType()) {
                this.data.setType(type);
                this.data.setDefaultValue();
            }
        }
        onInputHandler() {
            let name = this.input_varName.text.trim();
            this.data.setName(name);
        }
    }
    VariableSetView._TYPES = [DatumType.Int, DatumType.Number,
        DatumType.Vector3, DatumType.String,
        DatumType.Boolean, DatumType.UserId];
    VariableSetView._LABS = [DatumType.Int.toString(), DatumType.Number.toString(),
        DatumType.Vector3.toString(), DatumType.String.toString(),
        DatumType.Boolean.toString(), DatumType.UserId.toString()];
    ui.VariableSetView = VariableSetView;
})(ui || (ui = {}));
//# sourceMappingURL=VariableSetView.js.map