/**
* @author confiner
* @desc	插槽列表界面
*/
var ui;
(function (ui) {
    class SlotsView extends Laya.Sprite {
        constructor() {
            super();
            this._leftWidth = 0;
            this._rightWidth = 0;
            this._hasIn = false;
            this._hasOut = false;
            this._ItemHeight = 29;
            this._anchor = null;
            this._slotInPool = new Array();
            this._slotOutPool = new Array();
            this._slotIns = new Array();
            this._slotOuts = new Array();
        }
        setAnchor(anchor) {
            this._anchor = anchor;
        }
        getSlotInItem(id) {
            for (let i = 0, len = this._slotIns.length; i < len; ++i) {
                if (this._slotIns[i].data.getId() == id)
                    return this._slotIns[i];
            }
            for (let i = 0, len = this._slotOuts.length; i < len; ++i) {
                if (this._slotOuts[i].data.getId() == id)
                    return this._slotOuts[i];
            }
            return null;
        }
        destroy(destroyChild) {
            let slotIn = null;
            while (this._slotIns.length > 0) {
                slotIn = this._slotIns.pop();
                if (slotIn.parent)
                    slotIn.parent.removeChild(slotIn);
                slotIn.offAll();
                slotIn.destroy(true);
            }
            while (this._slotInPool.length > 0) {
                slotIn = this._slotInPool.pop();
                if (slotIn.parent)
                    slotIn.parent.removeChild(slotIn);
                slotIn.offAll();
                slotIn.destroy(true);
            }
            let slotOut = null;
            while (this._slotOuts.length > 0) {
                slotOut = this._slotOuts.pop();
                if (slotOut.parent)
                    slotOut.parent.removeChild(slotOut);
                slotOut.offAll();
                slotOut.destroy(true);
            }
            while (this._slotOutPool.length > 0) {
                slotOut = this._slotOutPool.pop();
                if (slotOut.parent)
                    slotOut.parent.removeChild(slotOut);
                slotOut.offAll();
                slotOut.destroy(true);
            }
        }
        update() {
            this.clear();
            let slotsIn = this.data.getSlotIns();
            if (slotsIn.length > 0) {
                this.createSlotInList(slotsIn);
            }
            let slotsOut = this.data.getSlotOuts();
            if (slotsOut.length > 0) {
                this.createSlotOutList(slotsOut);
            }
            this.updateSlotItem();
        }
        updateSlotItem() {
            let startY = 0;
            if (this._hasIn || this._hasOut) {
                startY = 30;
            }
            let leftHeigh = 0;
            let rightHeigh = 0;
            let slotIn = null;
            let index = 0;
            let graph = managers.GraphManager.getInstance().getCurrent();
            for (let i = 0, len = this._slotIns.length; i < len; ++i) {
                slotIn = this._slotIns[i];
                if (slotIn.data.getType() == core.SlotType.ExecutionIn) {
                    slotIn.y = 5;
                }
                else {
                    slotIn.y = startY + index * this._ItemHeight;
                    index++;
                }
                leftHeigh = slotIn.y + this._ItemHeight;
                if (graph)
                    slotIn.setStatus(graph.existAssociation(this.data.id, slotIn.data.getId()));
            }
            index = 0;
            let slotOut = null;
            for (let i = 0, len = this._slotOuts.length; i < len; ++i) {
                slotOut = this._slotOuts[i];
                if (slotOut.data.getType() == core.SlotType.ExecutionOut && i == 0)
                    slotOut.y = 5;
                else {
                    slotOut.y = startY + index * this._ItemHeight;
                    index++;
                }
                rightHeigh = slotOut.y + this._ItemHeight;
                if (graph)
                    slotOut.setStatus(graph.existAssociation(this.data.id, slotOut.data.getId()));
            }
            this.height = Math.max(leftHeigh, rightHeigh);
            this.event(core.EventType.RESIZE);
        }
        updateLayout() {
            for (let i = 0, len = this._slotOuts.length; i < len; ++i) {
                this._slotOuts[i].right = 0;
            }
        }
        clear() {
            this._hasIn = false;
            this._hasOut = false;
            let slotIn = null;
            while (this._slotIns.length > 0) {
                slotIn = this._slotIns.pop();
                if (slotIn.parent)
                    slotIn.parent.removeChild(slotIn);
                this._slotInPool.push(slotIn);
            }
            let slotOut = null;
            while (this._slotOuts.length > 0) {
                slotOut = this._slotOuts.pop();
                if (slotOut.parent)
                    slotOut.parent.removeChild(slotOut);
                this._slotOutPool.push(slotOut);
            }
        }
        createSlotInList(arr) {
            let slotIn = null;
            let graph = managers.GraphManager.getInstance().getCurrent();
            for (let i = 0, len = arr.length; i < len; ++i) {
                slotIn = this.createSlotInItem();
                if (arr[i].getType() == core.SlotType.ExecutionIn)
                    this._hasIn = true;
                slotIn.setData(arr[i]);
                slotIn.input_slotValue.editable = true;
                if (graph && graph.hasAssociation(this.data.id, arr[i].getId())) {
                    slotIn.input_slotValue.editable = false;
                }
                this._slotIns.push(slotIn);
            }
        }
        createSlotInItem() {
            let slotIn = null;
            if (this._slotInPool.length > 0) {
                slotIn = this._slotInPool.pop();
                slotIn.clear();
            }
            if (!slotIn) {
                slotIn = new ui.SlotInItem();
                //slotIn.setAnchor(this.parent as Sprite);
                slotIn.setAnchor(this._anchor);
                this.addChild(slotIn);
                slotIn.on(core.EventType.RESIZE, this, this.onResizeHandler);
            }
            return slotIn;
        }
        onResizeHandler(isIn, w) {
            if (isIn) {
                this._leftWidth = this._leftWidth > w ? this._leftWidth : w;
            }
            else {
                this._rightWidth = this._rightWidth > w ? this._rightWidth : w;
            }
            let width = this._leftWidth + this._rightWidth + 10;
            this.width = this.width < width ? width : this.width;
            this.event(core.EventType.RESIZE);
        }
        createSlotOutList(arr) {
            let slotOut = null;
            for (let i = 0, len = arr.length; i < len; ++i) {
                slotOut = this.createSlotOutItem();
                if (arr[i].getType() == core.SlotType.ExecutionOut)
                    this._hasOut = true;
                slotOut.setData(arr[i]);
                this._slotOuts.push(slotOut);
            }
        }
        createSlotOutItem() {
            let slotOut = null;
            if (this._slotOutPool.length > 0) {
                slotOut = this._slotOutPool.pop();
                slotOut.clear();
            }
            if (!slotOut) {
                slotOut = new ui.SlotOutItem();
                this.addChild(slotOut);
                slotOut.on(core.EventType.RESIZE, this, this.onResizeHandler);
                //slotOut.setAnchor(this.parent as Sprite);
                slotOut.setAnchor(this._anchor);
            }
            slotOut.right = 0;
            return slotOut;
        }
        setData(data) {
            this.data = data;
            this.update();
        }
    }
    ui.SlotsView = SlotsView;
})(ui || (ui = {}));
//# sourceMappingURL=SlotsView.js.map