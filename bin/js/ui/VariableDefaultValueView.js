/**
* 变量设置界面
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    class VariableDefaultValueView extends ui.Editor.VariableDefaultValueViewUI {
        constructor() {
            super();
        }
        setData(data) {
            this.data = data;
            this.update();
            this.data.on(model.Model.UPDATE, this, this.update);
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            this.offAll();
            this.data.off(model.Model.UPDATE, this, this.update);
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
            this.input_varValue.text = this.data.getData().toString();
        }
        initialize() {
            this.input_varValue.text = "";
            this.input_varValue.on(Event.KEY_DOWN, this, this.onInputHandler); //.on(Event.INPUT, this, this.onInputHandler);
        }
        onInputHandler(evt) {
            if (evt.keyCode == Laya.Keyboard.ENTER) {
                let value = this.input_varValue.text.trim();
                this.data.setValue(value);
            }
        }
    }
    ui.VariableDefaultValueView = VariableDefaultValueView;
})(ui || (ui = {}));
//# sourceMappingURL=VariableDefaultValueView.js.map