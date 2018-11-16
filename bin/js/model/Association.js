/**
* 关联类
* @author confiner
*/
var model;
(function (model) {
    class Association extends model.Model {
        constructor() {
            super();
        }
        getEnd() {
            return this._end;
        }
        isExecution() {
            let graph = managers.GraphManager.getInstance().getCurrent();
            let node = graph.getNodeById(this._start.getNodeId());
            let slot = node.getSlotById(this._start.getSlotId());
            return slot.getType() == core.SlotType.ExecutionOut;
        }
        setEnd(end) {
            if (end.equals(this._end))
                return;
            this._end = end;
            this._end.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            this.invalid = true;
        }
        getStart() {
            return this._start;
        }
        setStart(start) {
            if (start.equals(this._start))
                return;
            this._start = start;
            this._start.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            this.invalid = true;
        }
        dispose() {
            super.dispose();
            this.offAll();
            if (this._start)
                this._start.dispose();
            if (this._end)
                this._end.dispose();
            this.invalid = false;
        }
        update() {
            if (this._start)
                this._start.update();
            if (this._end)
                this._end.update();
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
        // 是否和节点相关
        relateToNode(nodeId) {
            if (this._start && this._start.getNodeId() == nodeId)
                return true;
            if (this._end && this._end.getNodeId() == nodeId)
                return true;
            return false;
        }
        // 相等
        equals(other) {
            if (!other)
                return false;
            let sEqual = false;
            if (!this._start && !other.getStart())
                sEqual = true;
            else if (this._start && other.getStart())
                sEqual = this._start.equals(other.getStart());
            let eEqual = false;
            if (!this._end && !other._end)
                eEqual = true;
            else if (this._end && other._end)
                eEqual = this._end.equals(other._end);
            return sEqual && eEqual;
        }
    }
    model.Association = Association;
})(model || (model = {}));
//# sourceMappingURL=Association.js.map