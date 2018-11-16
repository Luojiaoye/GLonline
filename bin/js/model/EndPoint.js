/**
* 端点类
* @author confiner
*/
var model;
(function (model) {
    class EndPoint extends model.Model {
        constructor() {
            super();
        }
        getNodeId() {
            return this._nodeId;
        }
        setNodeId(nodeId) {
            this._nodeId = nodeId;
            this.invalid = true;
        }
        setSlotName(name) {
            this._slotName = name;
        }
        getSlotName() {
            return this._slotName;
        }
        getSlotId() {
            return this._slotId;
        }
        setSlotId(slotId) {
            this._slotId = slotId;
            this.invalid = true;
        }
        dispose() {
            this.offAll();
            super.dispose();
            this._slotId = null;
            this._nodeId = null;
            this.transform = null;
        }
        update() {
            super.update();
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
        // 等于
        equals(other) {
            if (!other)
                return false;
            return this._nodeId == other.getNodeId() && this._slotId == other.getSlotId();
        }
    }
    model.EndPoint = EndPoint;
})(model || (model = {}));
//# sourceMappingURL=EndPoint.js.map