/**
* @desc 流图节点树叶节点
* @author confiner
*/
var ui;
(function (ui) {
    var Event = Laya.Event;
    class NodePaletteItem extends ui.Editor.Elements.NodePaletteItemUI {
        constructor() {
            super();
            this._data = null;
            this.img_over.visible = false;
            this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
            this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            this.offAll();
        }
        onMouseHandler(evt) {
            this.img_over.visible = evt.type == Event.MOUSE_OVER;
            this.txt_name.color = evt.type == Event.MOUSE_OVER ? "#ffffff" : "#758294";
            this.showTip(evt.type == Event.MOUSE_OVER);
        }
        showTip(show = false) {
            let nodeTemplate = managers.NodeManager.getInstance().getNodeTemplate(this._data.label);
            if (nodeTemplate) {
                let node = nodeTemplate.createNode();
                if (node && node.nodeTips) {
                    if (show) {
                        if (!this._tipBg) {
                            this._tipBg = new Laya.Image();
                            this._tipBg.skin = "editor/nodeViewBg.png";
                        }
                        if (!this._txt) {
                            this._txt = new Laya.Label();
                            this._txt.text = node.nodeTips;
                            this._txt.wordWrap = true;
                            this._txt.leading = 3;
                            this._txt.fontSize = 14;
                            this._txt.font = "Microsoft YaHei";
                            this._txt.color = "#b5b5b5";
                            this._txt.width = 150;
                            this._tipBg.addChild(this._txt);
                        }
                        this._tipBg.size(this._txt.width + 20, this._txt.height + 20);
                        this._txt.pos(10, 10);
                        let pos = new Laya.Point(this.mouseX, this.mouseY);
                        pos = this.localToGlobal(pos);
                        if (pos.x > this._tipBg.width / 2) {
                            this._tipBg.x = pos.x - this._tipBg.width / 2;
                        }
                        else {
                            this._tipBg.x = 0;
                        }
                        this._tipBg.x = pos.x;
                        if (pos.y < this._tipBg.height) {
                            // 下方显示
                            this._tipBg.y = pos.y;
                        }
                        else {
                            // 上方显示
                            this._tipBg.y = pos.y - this._tipBg.height;
                        }
                        Laya.stage.addChild(this._tipBg);
                    }
                    else {
                        if (this._tipBg) {
                            Laya.stage.removeChild(this._tipBg);
                            this._tipBg.destroy(true);
                            this._txt = null;
                            this._tipBg = null;
                        }
                    }
                }
            }
        }
        setData(data) {
            this._data = data;
            let hasChild = Boolean(data.hasChild);
            this.img_node.visible = !hasChild;
            this.img_node.index = managers.NodeManager.getInstance().GetColorId(data.colorId);
        }
    }
    ui.NodePaletteItem = NodePaletteItem;
})(ui || (ui = {}));
//# sourceMappingURL=NodePaletteItem.js.map