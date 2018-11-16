/**
* 右边内容区域
* @author confiner
*/
var ui;
(function (ui) {
    class RightContentView extends ui.Editor.RightContentViewUI {
        constructor() {
            super();
            this.init();
        }
        init() {
            this._variableContent = new ui.ContentMenuView();
            this._variableContent.space = 10;
            this._variableContent.y = 121;
            this.addChild(this._variableContent);
            this._customContent = new ui.ContentMenuView();
            this._customContent.space = 10;
            this._customContent.y = 121;
            this.addChild(this._customContent);
            this.addVariable();
            this.addDefaultValue();
            this.addCustom();
            //this.addExeIns();
            this.addExeOuts();
            this.addInputs();
            this.addOutputs();
            this.onResizeHandler();
            managers.EventManager.getInstance().on(core.EventType.VARIABLE_DETAIL, this, this.updateVariableDetailHandler);
            managers.EventManager.getInstance().on(core.EventType.CUSTOM_DETAIL, this, this.updateCustomDetailHandler);
            managers.EventManager.getInstance().on(core.EventType.NODES_DETAIL, this, this.updateNodesDetailHandler);
            managers.EventManager.getInstance().on(core.EventType.CHANGE_GRAPH, this, this.hideView);
            managers.EventManager.getInstance().on(core.EventType.HIDE_DETAIL, this, this.hideView);
            managers.EventManager.getInstance().on(core.EventType.DELETE_TAB_ITEM, this, this.hideView);
            managers.EventManager.getInstance().on(core.EventType.CHANGE_CUSTOM_TYPE, this, this.changeCustonTypeHandler);
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResizeHandler);
        }
        destroy(destroyChild) {
            super.destroy(destroyChild);
            managers.EventManager.getInstance().off(core.EventType.VARIABLE_DETAIL, this, this.updateVariableDetailHandler);
            managers.EventManager.getInstance().off(core.EventType.CUSTOM_DETAIL, this, this.updateCustomDetailHandler);
            managers.EventManager.getInstance().off(core.EventType.NODES_DETAIL, this, this.updateNodesDetailHandler);
            managers.EventManager.getInstance().off(core.EventType.CHANGE_GRAPH, this, this.hideView);
            managers.EventManager.getInstance().off(core.EventType.HIDE_DETAIL, this, this.hideView);
            managers.EventManager.getInstance().off(core.EventType.DELETE_TAB_ITEM, this, this.hideView);
            managers.EventManager.getInstance().off(core.EventType.CHANGE_CUSTOM_TYPE, this, this.changeCustonTypeHandler);
            Laya.stage.off(Laya.Event.RESIZE, this, this.onResizeHandler);
        }
        onResizeHandler() {
            this.bg.height = window.innerHeight - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).y;
            this.height = this.bg.height;
            if (this.parent)
                this.x = window.innerWidth - this.width;
        }
        hideView() {
            this.visible = false;
        }
        updateNodesDetailHandler() {
            this.visible = false;
        }
        // 自定义节点
        addCustom() {
            let customItemData = new model.ContentMenuItemData();
            customItemData.add = false;
            customItemData.name = "Custom";
            customItemData.open = false;
            customItemData.width = 375;
            let customView = new ui.CustomDescriptorView();
            this._customContent.addContent(customItemData, customView);
        }
        addExeIns() {
            let customItemData = new model.ContentMenuItemData();
            customItemData.add = true;
            customItemData.name = "ExeIns";
            customItemData.open = false;
            customItemData.width = 375;
            let customView = new ui.CustomSlotView(core.SlotType.ExecutionIn);
            this._customContent.addContent(customItemData, customView);
        }
        addExeOuts() {
            let customItemData = new model.ContentMenuItemData();
            customItemData.add = true;
            customItemData.name = "ExeOuts";
            customItemData.open = false;
            customItemData.width = 375;
            let customView = new ui.CustomSlotView(core.SlotType.ExecutionOut);
            this._customContent.addContent(customItemData, customView);
        }
        addInputs() {
            let customItemData = new model.ContentMenuItemData();
            customItemData.add = true;
            customItemData.name = "Inputs";
            customItemData.open = false;
            customItemData.width = 375;
            let customView = new ui.CustomSlotView(core.SlotType.DataIn);
            this._customContent.addContent(customItemData, customView);
        }
        addOutputs() {
            let customItemData = new model.ContentMenuItemData();
            customItemData.add = true;
            customItemData.name = "Outputs";
            customItemData.open = false;
            customItemData.width = 375;
            let customView = new ui.CustomSlotView(core.SlotType.DataOut);
            this._customContent.addContent(customItemData, customView);
        }
        updateCustomDetailHandler(data) {
            this.visible = true;
            this.onResizeHandler();
            this._variableContent.visible = false;
            this._customContent.visible = true;
            let descriptorView = this._customContent.getView("Custom");
            if (descriptorView) {
                descriptorView.setData(data);
            }
            let inputsView = this._customContent.getView("Inputs");
            if (inputsView) {
                inputsView.setData(data);
            }
            let outputsView = this._customContent.getView("Outputs");
            if (outputsView) {
                outputsView.setData(data);
            }
            let exeInsView = this._customContent.getView("ExeIns");
            if (exeInsView) {
                exeInsView.setData(data);
            }
            let exeOutsView = this._customContent.getView("ExeOuts");
            if (exeOutsView) {
                exeOutsView.setData(data);
            }
        }
        updateVariableDetailHandler(data) {
            this.onResizeHandler();
            this.visible = true;
            this._variableContent.visible = true;
            this._customContent.visible = false;
            let setView = this._variableContent.getView("Variable");
            if (setView) {
                setView.setData(data);
            }
            let defaultValueView = this._variableContent.getView("Default Value");
            if (defaultValueView) {
                defaultValueView.setData(data);
            }
        }
        addVariable() {
            let variableItemData = new model.ContentMenuItemData();
            variableItemData.add = false;
            variableItemData.name = "Variable";
            variableItemData.open = false;
            variableItemData.width = 375;
            let variableView = new ui.VariableSetView();
            this._variableContent.addContent(variableItemData, variableView);
        }
        addDefaultValue() {
            let defaultValueItemData = new model.ContentMenuItemData();
            defaultValueItemData.add = false;
            defaultValueItemData.name = "Default Value";
            defaultValueItemData.open = false;
            defaultValueItemData.width = 375;
            let variableView = new ui.VariableDefaultValueView();
            this._variableContent.addContent(defaultValueItemData, variableView);
        }
        changeCustonTypeHandler(data) {
            if (data.getType() == core.CustomType.SWITCH && this._customContent) {
                this._customContent.deleteContent("Outputs");
            }
            else if (data.getType() == core.CustomType.BRIDGE) {
                this.addOutputs();
            }
        }
    }
    ui.RightContentView = RightContentView;
})(ui || (ui = {}));
//# sourceMappingURL=RightContentView.js.map