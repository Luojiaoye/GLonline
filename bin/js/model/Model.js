/**
* model数据
* @author confiner
*/
var model;
(function (model) {
    class Model extends emitter.EventEmitter {
        constructor() {
            super();
            this.invalid = false;
            //this.on(Model.UPDATE, this, this.updateInvalidStatus);
        }
        copy(other) {
        }
        //延时刷新
        delayUpdate() {
            Laya.timer.frameOnce(1, this, this.change);
        }
        change() {
            if (this.invalid)
                this.event(Model.UPDATE, this);
        }
        updateInvalidStatus(data) {
            this.invalid = true;
        }
        clone() {
            return null;
        }
        equals(other) {
            return false;
        }
        dispose() {
            //this.off(Model.UPDATE, this, this.updateInvalidStatus);
            this.offAll();
            this.invalid = false;
        }
        update() {
        }
    }
    Model.UPDATE = "update";
    model.Model = Model;
})(model || (model = {}));
//# sourceMappingURL=Model.js.map