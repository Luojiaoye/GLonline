/**
* 变量界面
* @author confiner
*/
var ui;
(function (ui) {
    var Variable = model.Variable;
    var Event = Laya.Event;
    var EventManager = managers.EventManager;
    var EventType = core.EventType;
    class VariableView extends ui.Editor.Elements.VariableViewUI {
        constructor() {
            super();
            this.initialize();
        }
        setData(data) {
            this.data = data;
            this.update();
            this.data.on(model.Model.UPDATE, this, this.update);
        }
        update() {
            if (!this.data)
                return;
            this.txt_varName.text = this.data.getName();
            this.btn_get.label = Variable.GET + this.data.getName();
            this.btn_set.label = Variable.SET + this.data.getName();
        }
        initialize() {
            super.initialize();
            this.btn_get.on(Event.CLICK, this, this.onClickHandler);
            this.btn_set.on(Event.CLICK, this, this.onClickHandler);
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            this.btn_get.off(Event.CLICK, this, this.onClickHandler);
            this.btn_set.off(Event.CLICK, this, this.onClickHandler);
            if (this.parent) {
                this.parent.removeChild(this);
            }
        }
        onClickHandler(evt) {
            if (evt.currentTarget == this.btn_get) {
                EventManager.getInstance().event(EventType.ADD_VARIABLE_GET, [this.data, this.x + this.width, this.y + this.height]);
            }
            else if (evt.currentTarget == this.btn_set) {
                EventManager.getInstance().event(EventType.ADD_VARIABLE_SET, [this.data, this.x + this.width, this.y + this.height]);
            }
            EventManager.getInstance().event(EventType.DELETE_VARIABLE_VIEW, [this.data]);
        }
    }
    ui.VariableView = VariableView;
})(ui || (ui = {}));
//# sourceMappingURL=VariableView.js.map