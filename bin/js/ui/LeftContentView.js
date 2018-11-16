/**
* 左边内容区域
* @author confiner
*/
var ui;
(function (ui) {
    class LeftContentView extends ui.Editor.LeftContentViewUI {
        constructor() {
            super();
            this.init();
        }
        init() {
            this._content = new ui.ContentMenuView();
            this._content.space = 10;
            this._content.y = 121;
            this.addChild(this._content);
            this.addNodePlatte();
            this.addVariable();
            this.addCustom();
            this.onResizeHandler();
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);
        }
        onResizeHandler() {
            this.bg.height = window.innerHeight - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).y;
        }
        destroy(destoryChild) {
            super.destroy(destoryChild);
            Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
        }
        addNodePlatte() {
            let nodesItemData = new model.ContentMenuItemData();
            nodesItemData.add = false;
            nodesItemData.name = "Nodes";
            nodesItemData.open = false;
            nodesItemData.width = 310;
            let nodesView = new ui.NodePalette();
            nodesView.visible = false;
            this._content.addContent(nodesItemData, nodesView);
        }
        addVariable() {
            let variableItemData = new model.ContentMenuItemData();
            variableItemData.add = true;
            variableItemData.name = "Variables";
            variableItemData.open = false;
            variableItemData.width = 310;
            let variableView = new ui.VariableCreateView();
            this._content.addContent(variableItemData, variableView);
        }
        addCustom() {
            let customItemData = new model.ContentMenuItemData();
            customItemData.add = true;
            customItemData.name = "Custom";
            customItemData.open = false;
            customItemData.width = 310;
            let customView = new ui.CustomCreateView();
            this._content.addContent(customItemData, customView);
        }
    }
    ui.LeftContentView = LeftContentView;
})(ui || (ui = {}));
//# sourceMappingURL=LeftContentView.js.map