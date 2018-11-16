/**
* 自定义节点
* @author confienr
*/
var model;
(function (model) {
    //import DatumType = core.DatumType;
    //import SlotType = core.SlotType;
    class Custom extends model.Model {
        constructor() {
            super();
            this._type = core.CustomType.BRIDGE;
            this._node = new model.Node();
            this._node.type = core.NodeType.Custom;
            this._node.category = Custom.CATEGORY;
            this._node.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            this.init();
        }
        init() {
            this._node.createSlot(core.SlotType.ExecutionIn, core.SlotNames.In.toString());
        }
        getType() {
            return this._type;
        }
        setType(type) {
            this._type = type;
        }
        getNode() {
            return this._node;
        }
        createCustomNode() {
            return this._node.clone();
        }
        setBind(bind) {
            this._bind = bind;
        }
        getId() {
            return this._id;
        }
        setId(id) {
            this._id = id;
            this._node.setOwnerId(this._id);
        }
        getBind() {
            return this._bind;
        }
        equals(other) {
            if (!other)
                return false;
            return this._id == other._id;
        }
        getName() {
            return this._name;
        }
        setName(name) {
            if (this._name == name)
                return;
            this._name = name;
            this._node.setName(name);
            this.invalid = true;
        }
        changeSlotName(slot, name) {
            let realName = "";
            if (this._bind) {
                let other = this.getRelativeSlot(slot);
                if (other) {
                    if (other.getType() == core.SlotType.DataIn)
                        realName = "Input" + name;
                    else if (other.getType() == core.SlotType.DataOut)
                        realName = "Output" + name;
                    this._node.changeSlotName(other, realName);
                }
            }
            if (slot.getType() == core.SlotType.DataIn)
                realName = "Input" + name;
            else if (slot.getType() == core.SlotType.DataOut)
                realName = "Output" + name;
            else
                realName = name;
            this._node.changeSlotName(slot, realName);
        }
        changeSlotDatumType(slot, type) {
            if (this._bind) {
                let other = this.getRelativeSlot(slot);
                if (other)
                    other.setDataType(type);
            }
            slot.setDataType(type);
        }
        createInputSlot() {
            let name = "Input" + this._node.getDataInputsCount();
            let slot = this._node.createSlot(core.SlotType.DataIn, name);
            slot.setData(new model.Datum());
            slot.setDataType(core.DatumType.Boolean);
            slot.setDefaultData();
            return slot;
        }
        createOutputSlot() {
            let name = "Output" + this._node.getDataOutputsCount();
            let slot = this._node.createSlot(core.SlotType.DataOut, name);
            slot.setData(new model.Datum());
            slot.setDataType(core.DatumType.Boolean);
            slot.setDefaultData();
            return slot;
        }
        createExecutionInSlot() {
            if (this._node.executionIn)
                return this._node.executionIn;
            let slot = this._node.createSlot(core.SlotType.ExecutionIn, core.SlotNames.In.toString());
            return slot;
        }
        createExecutionOutSlot() {
            let name = core.SlotNames.Out + this._node.getExecutionOutCount();
            let slot = this._node.createSlot(core.SlotType.ExecutionOut, name);
            return slot;
        }
        deleteSlot(slot) {
            if (this._bind) {
                let other = this.getRelativeSlot(slot);
                if (other)
                    this._node.deleteSlot(other);
            }
            this._node.deleteSlot(slot);
        }
        getRelativeSlot(slot) {
            let type = core.SlotType.DataOut;
            if (slot.getType() == core.SlotType.DataOut)
                type = core.SlotType.DataIn;
            if (slot.getType() == core.SlotType.ExecutionOut)
                type = core.SlotType.ExecutionIn;
            let index = this._node.getIndexBySlot(slot);
            if (index > -1) {
                let other = this._node.getSlotByIndex(type, index);
                return other;
            }
            return null;
        }
        readFrom(customObj) {
            this._node.readFrom(customObj);
            this._name = this._node.getName();
            let typeStr = customObj["subType"];
            switch (typeStr) {
                case core.CustomType.BRIDGE.toString():
                    this.setType(core.CustomType.BRIDGE);
                    break;
                case core.CustomType.SWITCH.toString():
                    this.setType(core.CustomType.SWITCH);
                    break;
            }
        }
        writeTo(customObj) {
            this._node.writeTo(customObj);
        }
        copyToNode(node) {
            let nodeId = node.id;
            node.copy(this._node);
            node.setId(nodeId); // id不能被覆盖
            //node.setOwnerId(this._id);
        }
        resortSlot(slot, isUp) {
            if (this._bind) {
                let other = this.getRelativeSlot(slot);
                if (other)
                    this._node.resortSlot(other, isUp);
            }
            this._node.resortSlot(slot, isUp);
        }
        dispose() {
            super.dispose();
            this.offAll();
            this._name = null;
            this._node.dispose();
            this._node = null;
        }
        update() {
            this._node.update();
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
    }
    Custom.CATEGORY = "customs";
    model.Custom = Custom;
})(model || (model = {}));
//# sourceMappingURL=Custom.js.map