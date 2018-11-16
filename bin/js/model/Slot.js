/**
* 插槽类
* @author confiner
*/
var model;
(function (model) {
    //import SlotType = core.SlotType;
    class Slot extends model.Model {
        constructor() {
            super();
        }
        isLock() {
            if (this._data)
                return this._data.isLock();
            return false;
        }
        setId(id) {
            if (this._id == id)
                return;
            this._id = id;
            //this.invalid = true;
        }
        getType() {
            return this._type;
        }
        setDefaultData() {
            if (this._data)
                this._data.setDefaultValue();
        }
        setType(type) {
            if (this._type == type)
                return;
            this._type = type;
            this.invalid = true;
        }
        getId() {
            return this._id;
        }
        getNodeId() {
            return this._nodeId;
        }
        setNodeId(nodeId) {
            if (this._nodeId == nodeId)
                return;
            this._nodeId = nodeId;
            this.invalid = true;
        }
        getName() {
            return this._name;
        }
        setName(name) {
            if (name == this._name)
                return;
            this._name = name;
            this.invalid = true;
        }
        setData(data) {
            if (data.equals(this._data))
                return;
            if (this._data && this._data.hasListener(model.Model.UPDATE))
                this._data.off(model.Model.UPDATE, this, this.updateInvalidStatus);
            this._data = data;
            this._data.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            this.invalid = true;
        }
        setDataType(type) {
            if (!this._data || this._data.getType() == type)
                return;
            this._data.setType(type);
            this._data.setDefaultValue();
        }
        getDataType() {
            if (this._data)
                return this._data.getType();
            return null;
        }
        writeTo(slotObj) {
            if (this._type == core.SlotType.ExecutionOut || this._type == core.SlotType.ExecutionIn) {
                //slotObj = this._name;
                // 字符串类型不是引用类型无法传出
            }
            else if (this._type == core.SlotType.DataIn || this._type == core.SlotType.DataOut) {
                slotObj[this._name] = {};
                this._data.writeTo(slotObj[this._name]);
            }
        }
        setValue(value) {
            if (!this._data) {
                console.error("error: the slot :" + this._name + " is not initialized, can not to be setValue");
                return;
            }
            this._data.setValue(value);
        }
        getValue() {
            if (this._data)
                return this._data.getValue();
            return null;
        }
        getData() {
            return this._data;
        }
        // 是否匹配
        match(other) {
            if (this._type == core.SlotType.ExecutionIn && other._type == core.SlotType.ExecutionOut
                || this._type == core.SlotType.ExecutionOut && other._type == core.SlotType.ExecutionIn) {
                return true;
            }
            if ((!this._data && other._data) || (this._data && !other._data)) {
                return false;
            }
            if (((!this._data && !other._data) || this._data.getType() == other._data.getType())
                && (this._type == core.SlotType.DataIn && other._type == core.SlotType.DataOut
                    || this._type == core.SlotType.DataOut && other._type == core.SlotType.DataIn)) {
                return true;
            }
            return false;
        }
        update() {
            if (this._data)
                this._data.update();
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
        dispose() {
            this.offAll();
            super.dispose();
            this._name = null;
            this._type = null;
            this._nodeId = null;
            if (this._data)
                this._data.dispose();
        }
        equals(other) {
            if (!other)
                return false;
            // 如果名字相同则认为是同一个插槽
            if (this._name == other._name)
                return true;
            return false;
        }
        clone() {
            let slot = new Slot();
            slot._id = this._id;
            slot._name = this._name;
            if (this._data)
                slot._data = this._data.clone();
            slot._type = this._type;
            slot._nodeId = this._nodeId;
            return slot;
        }
        copy(other) {
            this._id = other._id;
            this._name = other._name;
            if (other._data) {
                if (!this._data) {
                    this.setData(other._data.clone());
                }
                else {
                    this._data.copy(other._data);
                }
            }
            this._type = other._type;
            this._nodeId = other._nodeId;
        }
    }
    model.Slot = Slot;
})(model || (model = {}));
//# sourceMappingURL=Slot.js.map