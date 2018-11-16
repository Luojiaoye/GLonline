/**
* 变量
* @author confiner
*/
var model;
(function (model) {
    class Variable extends model.Model {
        constructor() {
            super();
            this._data = new model.Datum();
            this._data.setType(core.DatumType.Boolean);
            this._data.setDefaultValue();
            this._data.on(model.Model.UPDATE, this, this.updateInvalidStatus);
        }
        getId() {
            return this._id;
        }
        setId(id) {
            this._id = id;
        }
        copyToNode(node) {
            let nodeId = node.id;
            let ownerId = node.getOwnerId();
            let nodeData = null;
            if (node.isGetNode()) {
                nodeData = this.createGetNode();
            }
            else if (node.isSetNode()) {
                nodeData = this.createSetNode();
            }
            let change = false;
            let dos = nodeData.getGetSlot();
            if (dos && dos.getDataType() != this._data.getType()) {
                dos.setData(this._data.clone());
                change = true;
            }
            let dis = nodeData.getSetSlot();
            if (dis && dis.getDataType() != this._data.getType()) {
                dis.setData(this._data.clone());
                change = true;
            }
            if (change) {
                node.copy(nodeData);
                node.setId(nodeId);
                node.setOwnerId(ownerId);
            }
        }
        setName(name) {
            this._name = name;
            this.invalid = true;
        }
        getName() {
            return this._name;
        }
        setType(type) {
            if (!this._data) {
                console.error("error: the datum is null when set the variable type!!");
            }
            else {
                this._data.setType(type);
            }
        }
        setDefaultValue() {
            if (!this._data) {
                console.error("error: the datum is null when set the variable default value!!");
            }
            else {
                this._data.setDefaultValue();
            }
        }
        getType() {
            return this._data.getType();
        }
        getData() {
            return this._data;
        }
        getValue() {
            return this._data.getValue();
        }
        setValue(value) {
            if (!this._data) {
                console.error("error: the datum is null when set the variable value!!");
            }
            else {
                this._data.setValue(value);
                this.invalid = true;
            }
        }
        equals(other) {
            if (!other)
                return false;
            return this._id == other._id;
        }
        // 创建Get节点
        createGetNode() {
            let node = managers.NodeManager.getInstance().createNode(Variable.GET);
            if (node) {
                this.setDataOutput(node);
                this.setDataInput(node);
            }
            else {
                node = new model.Node();
                node.createSlot(core.SlotType.DataOut, this._name, this._data.clone());
            }
            node.setName(Variable.GET + this._name);
            node.category = Variable.CATEGORY;
            node.setOwnerId(this._id);
            return node;
        }
        setDataInput(node) {
            let slot = node.getGetSlot();
            if (slot) {
                slot.setName(this._name);
                slot.setData(this._data.clone());
            }
        }
        // 创建Set节点
        createSetNode() {
            let node = managers.NodeManager.getInstance().createNode(Variable.SET);
            if (node) {
                this.setDataOutput(node);
                this.setDataInput(node);
            }
            else {
                node = new model.Node();
                node.createSlot(core.SlotType.DataIn, this._name, this._data.clone());
                node.createSlot(core.SlotType.ExecutionOut, core.SlotNames.Out, this._data.clone());
                node.createSlot(core.SlotType.ExecutionIn, core.SlotNames.In, this._data.clone());
            }
            node.setName(Variable.SET + this._name);
            node.category = Variable.CATEGORY;
            return node;
        }
        setDataOutput(node) {
            let slot = node.getSetSlot();
            if (slot) {
                slot.setName(this._name);
                slot.setData(this._data.clone());
            }
        }
        dispose() {
            super.dispose();
            this.offAll();
            this.invalid = false;
            this._name = null;
            this._data.offAll();
            this._data.dispose();
            this._data = null;
        }
        update() {
            this._data.update();
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
    }
    Variable.GET = "Get";
    Variable.SET = "Set";
    Variable.CATEGORY = "variables";
    model.Variable = Variable;
})(model || (model = {}));
//# sourceMappingURL=Variable.js.map