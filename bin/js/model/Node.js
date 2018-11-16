/**
* 节点类
* @author confiner
*/
var model;
(function (model) {
    //import NodeType = core.NodeType;
    class Node extends model.Model {
        constructor() {
            super();
            this.disGUID = 0;
            this.dosGUID = 0;
            this.eosGUID = 0;
            this.isBak = false;
        }
        setDebug(debug) {
            this._debug = debug;
        }
        getDebug() {
            return this._debug;
        }
        same(other) {
            let diffType = false;
            if (other.type != this.type)
                diffType = true;
            let diffIn = false;
            if ((other.executionIn == undefined || other.executionIn == null) && (this.executionIn == undefined || this.executionIn == null)
                || (other.executionIn && this.executionIn)) {
                diffIn = false;
            }
            else {
                diffIn = true;
            }
            let diffOut = false;
            if ((other.executionOuts == null || other.executionOuts == undefined) && (this.executionOuts == null || this.executionOuts == undefined))
                diffOut = false;
            else if (!other.executionOuts && this.executionOuts || other.executionOuts && !this.executionOuts) {
                diffOut = true;
            }
            else {
                if (other.executionOuts.length != this.executionOuts.length) {
                    diffOut = true;
                }
                else {
                    for (let i = 0, len = this.executionOuts.length; i < len; ++i) {
                        if (this.executionOuts[i].getName() != other.executionOuts[i].getName())
                            diffOut = true;
                    }
                }
            }
            let diffDataIn = false;
            if ((this._dataInputs == undefined || this._dataInputs == null) && (other._dataInputs == undefined || other._dataInputs == null)) {
                diffDataIn = false;
            }
            else {
                if (other._dataInputs.length != this._dataInputs.length) {
                    diffDataIn = true;
                }
                else {
                    for (let i = 0, len = this._dataInputs.length; i < len; ++i) {
                        if ((!this._dataInputs[i].getData() && other._dataInputs[i].getData() || this._dataInputs[i].getData && !other._dataInputs[i].getData()) || this._dataInputs[i].getName() != other._dataInputs[i].getName()) {
                            diffDataIn = true;
                        }
                        else {
                            if (this._dataInputs[i].getDataType() != other._dataInputs[i].getDataType())
                                diffDataIn = true;
                        }
                    }
                }
            }
            let diffDataOut = false;
            if ((other._dataOutputs == undefined || other._dataOutputs == null) && (this._dataOutputs == null || this._dataOutputs == undefined)) {
                diffDataOut = false;
            }
            else {
                if (other._dataOutputs.length != this._dataOutputs.length) {
                    diffDataOut = true;
                }
                else {
                    for (let i = 0, len = this._dataOutputs.length; i < len; ++i) {
                        if ((!this._dataOutputs[i].getData() && other._dataOutputs[i].getData() || this._dataOutputs[i].getData() && !other._dataOutputs[i].getData()) || this._dataOutputs[i].getName() != other._dataOutputs[i].getName()) {
                            return false;
                        }
                        else {
                            if (this._dataOutputs[i].getDataType() != other._dataOutputs[i].getDataType())
                                return false;
                        }
                    }
                }
            }
            return !diffType && !diffDataIn && !diffDataOut && !diffIn && !diffOut;
        }
        changeSlotName(slot, name) {
            let one = this.getSlotByName(name);
            if (!one) {
                slot.setName(name);
            }
        }
        getSlotByName(name) {
            if (this.executionIn && this.executionIn.getName() == name)
                return this.executionIn;
            let slot = null;
            if (this.executionOuts)
                slot = this.findSlotByName(this.executionOuts, name);
            if (!slot && this._dataInputs)
                slot = this.findSlotByName(this._dataInputs, name);
            if (!slot && this._dataOutputs)
                slot = this.findSlotByName(this._dataOutputs, name);
            return slot;
        }
        findSlotByName(arr, name) {
            for (let i = 0, len = arr.length; i < len; ++i) {
                if (arr[i].getName() == name)
                    return arr[i];
            }
            return null;
        }
        resortSlot(slot, isUp) {
            if (slot.getType() == core.SlotType.DataIn)
                this.resortDataInput(slot, isUp);
            else if (slot.getType() == core.SlotType.DataOut)
                this.resortDataOutput(slot, isUp);
            else if (slot.getType() == core.SlotType.ExecutionOut)
                this.resortExecutionOuts(slot, isUp);
        }
        getIndexBySlot(slot) {
            if (slot.getType() == core.SlotType.ExecutionIn)
                return 0;
            else {
                if (this.executionOuts) {
                    for (let i = 0, len = this.executionOuts.length; i < len; ++i) {
                        if (this.executionOuts[i].equals(slot))
                            return i;
                    }
                }
                if (this._dataInputs) {
                    for (let i = 0, len = this._dataInputs.length; i < len; ++i) {
                        if (this._dataInputs[i].equals(slot))
                            return i;
                    }
                }
                if (this._dataOutputs) {
                    for (let i = 0, len = this._dataOutputs.length; i < len; ++i) {
                        if (this._dataOutputs[i].equals(slot))
                            return i;
                    }
                }
            }
            return -1;
        }
        getSlotByIndex(type, index = 0) {
            if (type == core.SlotType.DataIn) {
                if (this._dataInputs && this._dataInputs.length > index)
                    return this._dataInputs[index];
            }
            else if (type == core.SlotType.DataOut) {
                if (this._dataOutputs && this._dataOutputs.length > index)
                    return this._dataOutputs[index];
            }
            else if (type == core.SlotType.ExecutionIn) {
                return this.executionIn;
            }
            else if (type == core.SlotType.ExecutionOut) {
                if (this._dataOutputs && this._dataOutputs.length > index)
                    return this._dataOutputs[index];
            }
            return null;
        }
        resortDataInput(slot, isUp) {
            if (this._dataInputs) {
                let index = -1;
                for (let i = 0, len = this._dataInputs.length; i < len; ++i) {
                    if (this._dataInputs[i].equals(slot)) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    if (isUp && index > 0) {
                        this._dataInputs[index] = this._dataInputs[index - 1];
                        this._dataInputs[index - 1] = slot;
                        this.invalid = true;
                    }
                    else if (!isUp && index < this._dataInputs.length) {
                        this._dataInputs[index] = this._dataInputs[index + 1];
                        this._dataInputs[index + 1] = slot;
                        this.invalid = true;
                    }
                }
            }
        }
        resortDataOutput(slot, isUp) {
            if (this._dataOutputs) {
                let index = -1;
                for (let i = 0, len = this._dataOutputs.length; i < len; ++i) {
                    if (this._dataOutputs[i].equals(slot)) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    if (isUp && index > 0) {
                        this._dataOutputs[index] = this._dataOutputs[index - 1];
                        this._dataOutputs[index - 1] = slot;
                        this.invalid = true;
                    }
                    else if (!isUp && index < this._dataOutputs.length) {
                        this._dataOutputs[index] = this._dataOutputs[index + 1];
                        this._dataOutputs[index + 1] = slot;
                        this.invalid = true;
                    }
                }
            }
        }
        resortExecutionOuts(slot, isUp) {
            if (this.executionOuts) {
                let index = -1;
                for (let i = 0, len = this.executionOuts.length; i < len; ++i) {
                    if (this.executionOuts[i].equals(slot)) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    if (isUp && index > 0) {
                        this.executionOuts[index] = this.executionOuts[index - 1];
                        this.executionOuts[index - 1] = slot;
                        this.invalid = true;
                    }
                    else if (!isUp && index < this.executionOuts.length) {
                        this.executionOuts[index] = this.executionOuts[index + 1];
                        this.executionOuts[index + 1] = slot;
                        this.invalid = true;
                    }
                }
            }
        }
        setOwnerId(id) {
            this._ownerId = id;
        }
        getOwnerId() {
            return this._ownerId;
        }
        getSlotsByType(type) {
            let arr = null;
            switch (type) {
                case core.SlotType.ExecutionIn:
                    arr = [this.executionIn];
                    break;
                case core.SlotType.ExecutionOut:
                    arr = this.executionOuts;
                    break;
                case core.SlotType.DataIn:
                    arr = this._dataInputs;
                    break;
                case core.SlotType.DataOut:
                    arr = this._dataOutputs;
                    break;
            }
            return arr;
        }
        getSlotOuts() {
            let slotsOut = new Array();
            if (this.executionOuts) {
                slotsOut = slotsOut.concat(this.executionOuts);
            }
            if (this.getDataOutputsCount() > 0) {
                slotsOut = slotsOut.concat(this._dataOutputs);
            }
            return slotsOut;
        }
        getSlotIns() {
            let slotsIn = new Array();
            if (this.executionIn) {
                slotsIn.push(this.executionIn);
            }
            if (this.getDataInputsCount() > 0) {
                slotsIn = slotsIn.concat(this._dataInputs);
            }
            return slotsIn;
        }
        getGetSlot() {
            if (this.type != core.NodeType.Variable)
                return null;
            if (this.getDataOutputsCount() == 0)
                return null;
            return this._dataOutputs[0];
        }
        getSetSlot() {
            if (this.type != core.NodeType.Variable)
                return null;
            if (this.getDataInputsCount() == 0)
                return null;
            return this._dataInputs[0];
        }
        copy(other) {
            this._name = other._name;
            this.type = other.type;
            this.category = other.category;
            this.setOwnerId(other.getOwnerId());
            if (other.executionIn) {
                if (!this.executionIn) {
                    this.createSlot(core.SlotType.ExecutionIn, core.SlotNames.In.toString());
                    this.invalid = true;
                }
                //this.executionIn.copy(other.executionIn);
            }
            else if (this.executionIn) {
                this.executionIn.dispose();
                this.executionIn = null;
                this.invalid = true;
            }
            if (other.executionOuts) {
                if (!this.executionOuts)
                    this.executionOuts = new Array();
                this.copySlotArray(other.executionOuts, this.executionOuts);
            }
            else if (this.executionOuts) {
                this.disposeSlotArray(this.executionOuts);
                this.executionOuts = null;
            }
            if (other._dataInputs) {
                if (!this._dataInputs)
                    this._dataInputs = new Array();
                this.copySlotArray(other._dataInputs, this._dataInputs);
            }
            else if (this._dataInputs) {
                this.disposeSlotArray(this._dataInputs);
                this._dataInputs = null;
                this.invalid = true;
            }
            if (other._dataOutputs) {
                if (!this._dataOutputs)
                    this._dataOutputs = new Array();
                this.copySlotArray(other._dataOutputs, this._dataOutputs);
            }
            else if (this._dataOutputs) {
                this.disposeSlotArray(this._dataOutputs);
                this._dataOutputs = null;
                this.invalid = true;
            }
        }
        disposeSlotArray(slots) {
            for (let slot of slots) {
                slot.dispose();
            }
        }
        copySlotArray(src, dest) {
            if (!dest)
                return;
            if (!src)
                return;
            let slot = null;
            for (let i = 0; i < src.length; ++i) {
                if (i < dest.length) {
                    dest[i].copy(src[i]);
                }
                else {
                    this.addSlot(src[i].clone());
                }
            }
            if (src.length < dest.length) {
                let cnt = dest.length - src.length;
                let slot = null;
                while (cnt > 0) {
                    slot = dest.pop();
                    slot.dispose();
                    cnt--;
                }
                this.invalid = true;
            }
        }
        isGetNode() {
            if (this.type != core.NodeType.Variable)
                return false;
            return this.getDataInputsCount() == 0;
        }
        isSetNode() {
            if (this.type != core.NodeType.Variable)
                return false;
            return this.getDataInputsCount() != 0;
        }
        writeDefaultDataInputsTo(cfg, excludeSlots) {
            // 无连线的则取默认值
            for (let slot of this._dataInputs) {
                if (!excludeSlots.has(slot.getId())) {
                    if (!cfg)
                        cfg = {};
                    cfg[slot.getName()] = { "defaultValue": slot.getValue() };
                }
            }
            return cfg;
        }
        createSlot(type, name, data) {
            let slot = new model.Slot();
            slot.setType(type);
            if (name)
                slot.setName(name);
            if (data)
                slot.setData(data);
            slot.setNodeId(this.id);
            this.addSlot(slot);
            return slot;
        }
        addSlot(slot) {
            if (slot.getNodeId() != this.id)
                slot.setNodeId(this.id);
            switch (slot.getType()) {
                case core.SlotType.DataIn:
                    this.addDataInput(slot);
                    break;
                case core.SlotType.DataOut:
                    this.addDataOutput(slot);
                    break;
                case core.SlotType.ExecutionIn:
                    if (!slot.equals(this.executionIn)) {
                        this.executionIn = slot;
                        this.executionIn.on(model.Model.UPDATE, this, this.updateInvalidStatus);
                        this.executionIn.setId(core.SlotNames.In.toString() + "0");
                        this.invalid = true;
                    }
                    break;
                case core.SlotType.ExecutionOut:
                    this.addExecutionOuts(slot);
                    break;
            }
        }
        deleteSlot(slot) {
            switch (slot.getType()) {
                case core.SlotType.DataIn:
                    this.deleteDataInput(slot);
                    break;
                case core.SlotType.DataOut:
                    this.deleteDataOutput(slot);
                    break;
                case core.SlotType.ExecutionIn:
                    break;
                case core.SlotType.ExecutionOut:
                    this.deleteExecutionOut(slot);
                    break;
            }
        }
        addDataInput(dataInput) {
            if (!this.verifyDataInput(dataInput))
                return;
            if (!this._dataInputs)
                this._dataInputs = new Array();
            if (dataInput.hasListener(model.Model.UPDATE))
                dataInput.off(model.Model.UPDATE, this, this.updateInvalidStatus);
            this._dataInputs.push(dataInput);
            dataInput.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            dataInput.setId(core.SlotNames.DataIn.toString() + (++this.disGUID));
            this.invalid = true;
        }
        addExecutionOuts(slot) {
            if (!this.verifyExecutionOut(slot))
                return;
            if (!this.executionOuts)
                this.executionOuts = new Array();
            slot.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            this.executionOuts.push(slot);
            slot.setId(core.SlotNames.Out.toString() + (++this.eosGUID));
            this.invalid = true;
        }
        addDataOutput(dataOutput) {
            if (!this.verifyDataOutput(dataOutput))
                return;
            if (!this._dataOutputs)
                this._dataOutputs = new Array();
            if (dataOutput.hasListener(model.Model.UPDATE))
                dataOutput.off(model.Model.UPDATE, this, this.updateInvalidStatus);
            this._dataOutputs.push(dataOutput);
            dataOutput.on(model.Model.UPDATE, this, this.updateInvalidStatus);
            dataOutput.setId(core.SlotNames.DataOut.toString() + (++this.dosGUID));
            this.invalid = true;
        }
        deleteDataOutput(slot) {
            if (!this._dataOutputs)
                return;
            let dos = null;
            for (let i = 0; i < this._dataOutputs.length; ++i) {
                dos = this._dataOutputs[i];
                if (slot.equals(dos)) {
                    this._dataOutputs.splice(i, 1);
                    slot.offAll();
                    slot.dispose();
                    this.invalid = true;
                    break;
                }
            }
        }
        deleteDataInput(slot) {
            if (!this._dataInputs)
                return;
            let dis = null;
            for (let i = 0; i < this._dataInputs.length; ++i) {
                dis = this._dataInputs[i];
                if (slot.equals(dis)) {
                    this._dataInputs.splice(i, 1);
                    slot.offAll();
                    slot.dispose();
                    this.invalid = true;
                    break;
                }
            }
        }
        deleteExecutionOut(slot) {
            if (!this.executionOuts)
                return;
            let eos = null;
            for (let i = 0; i < this.executionOuts.length; ++i) {
                eos = this.executionOuts[i];
                if (slot.equals(eos)) {
                    this.executionOuts.splice(i, 1);
                    slot.offAll();
                    slot.dispose();
                    this.invalid = true;
                    break;
                }
            }
        }
        getDataInputsCount() {
            if (!this._dataInputs)
                return 0;
            return this._dataInputs.length;
        }
        getDataOutputsCount() {
            if (!this._dataOutputs)
                return 0;
            return this._dataOutputs.length;
        }
        getExecutionOutCount() {
            if (!this.executionOuts)
                return 0;
            return this.executionOuts.length;
        }
        verifyDataInput(dataInput) {
            if (!this._dataInputs)
                return true;
            let exist = false;
            for (let dis of this._dataInputs) {
                if (dis.equals(dataInput)) {
                    exist = true;
                    break;
                }
            }
            return !exist;
        }
        verifyDataOutput(dataOutput) {
            if (!this._dataOutputs)
                return true;
            let exist = false;
            for (let dos of this._dataOutputs) {
                if (dos.equals(dataOutput)) {
                    exist = true;
                    break;
                }
            }
            return !exist;
        }
        verifyExecutionOut(executionOut) {
            if (!this.executionOuts)
                return true;
            let exist = false;
            for (let eos of this.executionOuts) {
                if (eos.equals(executionOut)) {
                    exist = true;
                    break;
                }
            }
            return !exist;
        }
        getName() {
            return this._name;
        }
        setName(name) {
            if (this._name == name)
                return;
            this._name = name;
            this.invalid = true;
        }
        readFrom(nodeObj) {
            if (!nodeObj)
                return;
            let nodeTemplate = new NodeTemplate(nodeObj);
            let node = nodeTemplate.createNode();
            this.copyFrom(node);
        }
        copyFrom(other) {
            let clone = other.clone();
            this._name = clone._name;
            this.category = clone.category;
            this._dataInputs = clone._dataInputs;
            this._dataOutputs = clone._dataOutputs;
            this.executionIn = clone.executionIn;
            this.executionOuts = clone.executionOuts;
            this.id = clone.id;
            this.isGraphNode = clone.isGraphNode;
            this.nodeTips = clone.nodeTips;
            this.ownerGraphName = clone.ownerGraphName;
            this.subCategory = clone.subCategory;
            this.type = clone.type;
        }
        writeTo(nodeObj) {
            if (this.type == core.NodeType.Variable)
                nodeObj["name"] = this._name.substring(3);
            else
                nodeObj["name"] = this._name;
            nodeObj["type"] = this.type.toString();
            nodeObj["category"] = this.category;
            this.writeBefore(nodeObj);
            this.writeNexts(nodeObj);
            this.writeInputs(nodeObj);
            this.writeOutputs(nodeObj);
        }
        writeBefore(nodeObj) {
            if (!this.executionIn)
                return;
            nodeObj["before"] = core.SlotNames.In.toString(); //this.executionIn.getName();
        }
        writeNexts(nextsObj) {
            if (!this.executionOuts)
                return;
            let nextObjs = null;
            let slot = null;
            for (let i = 0; i < this.executionOuts.length; ++i) {
                slot = this.executionOuts[i];
                if (!nextObjs)
                    nextObjs = new Array();
                nextObjs.push(slot.getName());
            }
            if (nextObjs && nextObjs.length > 0)
                nextsObj["next"] = nextObjs;
        }
        writeInputs(inputsObj) {
            if (!this._dataInputs)
                return;
            let inputObjs = null;
            let slot = null;
            let slotObj = null;
            for (let i = 0; i < this._dataInputs.length; ++i) {
                slot = this._dataInputs[i];
                if (!inputObjs)
                    inputObjs = new Array();
                slotObj = {};
                slot.writeTo(slotObj);
                inputObjs.push(slotObj);
            }
            if (inputObjs && inputObjs.length > 0)
                inputsObj["input"] = inputObjs;
        }
        writeOutputs(outputsObj) {
            if (!this._dataOutputs)
                return;
            let outputObjs = null;
            let slot = null;
            let slotObj = null;
            for (let i = 0; i < this._dataOutputs.length; ++i) {
                slot = this._dataOutputs[i];
                if (!outputObjs)
                    outputObjs = new Array();
                slotObj = {};
                slot.writeTo(slotObj);
                outputObjs.push(slotObj);
            }
            if (outputObjs && outputObjs.length > 0)
                outputsObj["output"] = outputObjs;
        }
        setType(type) {
            switch (type) {
                case core.NodeType.Data.toString():
                    this.type = core.NodeType.Data;
                    break;
                case core.NodeType.Ctrl.toString():
                    this.type = core.NodeType.Ctrl;
                    break;
                case core.NodeType.Event.toString():
                    this.type = core.NodeType.Event;
                    break;
                case core.NodeType.Variable.toString():
                    this.type = core.NodeType.Variable;
                    break;
                case core.NodeType.Custom.toString():
                    this.type = core.NodeType.Custom;
                    break;
                case core.NodeType.Logic.toString():
                    this.type = core.NodeType.Logic;
                    break;
                case core.NodeType.Graph.toString():
                    this.type = core.NodeType.Graph;
                    break;
                case core.NodeType.Start.toString():
                    this.type = core.NodeType.Start;
                    break;
                case core.NodeType.End.toString():
                    this.type = core.NodeType.End;
                    break;
            }
        }
        // 通过插槽id获取插槽数据
        getSlotById(id) {
            if (this.executionIn && this.executionIn.getId() == id)
                return this.executionIn;
            if (this.executionOuts) {
                for (let eOut of this.executionOuts) {
                    if (eOut.getId() == id)
                        return eOut;
                }
            }
            if (this._dataInputs) {
                for (let dIn of this._dataInputs) {
                    if (dIn.getId() == id)
                        return dIn;
                }
            }
            if (this._dataOutputs) {
                for (let dOut of this._dataOutputs) {
                    if (dOut.getId() == id)
                        return dOut;
                }
            }
            return null;
        }
        // 设置id
        setId(id) {
            this.id = id;
            if (this.executionIn)
                this.executionIn.setNodeId(id);
            if (this.executionOuts) {
                for (let eOut of this.executionOuts) {
                    eOut.setNodeId(id);
                }
            }
            if (this._dataInputs) {
                for (let dIn of this._dataInputs) {
                    dIn.setNodeId(id);
                }
            }
            if (this._dataOutputs) {
                for (let dOut of this._dataOutputs) {
                    dOut.setNodeId(id);
                }
            }
        }
        // 设置输入值
        setInputValue(slotName, value) {
            if (!this._dataInputs) {
                console.error("error: the node :" + this._name + " is not initialized, can not to be setInputValue");
                return;
            }
            let slot = null;
            for (let i = 0; i < this._dataInputs.length; ++i) {
                slot = this._dataInputs[i];
                if (slot.getName() == slotName)
                    break;
            }
            if (slot)
                slot.setValue(value);
        }
        dispose() {
            super.dispose();
            this.offAll();
            if (this._dataInputs) {
                for (let dis of this._dataInputs) {
                    dis.dispose();
                }
            }
            if (this._dataOutputs) {
                for (let dos of this._dataOutputs) {
                    dos.dispose();
                }
            }
            if (this.executionIn)
                this.executionIn.dispose();
            if (this.executionOuts) {
                for (let eos of this.executionOuts) {
                    eos.dispose();
                }
            }
        }
        clone() {
            let node = new Node();
            node.copy(this);
            return node;
        }
        update() {
            if (this.executionIn)
                this.executionIn.update();
            if (this.executionOuts) {
                for (let eos of this.executionOuts) {
                    eos.update();
                }
            }
            if (this._dataInputs) {
                for (let dis of this._dataInputs) {
                    dis.update();
                }
            }
            if (this._dataOutputs) {
                for (let dos of this._dataOutputs) {
                    dos.update();
                }
            }
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
    }
    Node.GRAPH_CATEGORY = "Graph"; // 
    model.Node = Node;
})(model || (model = {}));
//# sourceMappingURL=Node.js.map