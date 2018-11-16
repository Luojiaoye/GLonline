/**
* 右边内容区域
* @author confiner
*/
module ui {
	export class RightContentView extends Editor.RightContentViewUI {
		private _variableContent: ContentMenuView;
		private _customContent: ContentMenuView;

		constructor() {
			super();
			this.init();
		}

		private init(): void {
			this._variableContent = new ContentMenuView();
			this._variableContent.space = 10;
			this._variableContent.y = 121;
			this.addChild(this._variableContent);

			this._customContent = new ContentMenuView();
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

		public destroy(destroyChild: boolean): void {
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

		private onResizeHandler(): void {
			this.bg.height = window.innerHeight - this.localToGlobal(new Laya.Point(this.bg.x, this.bg.y)).y;
			this.height = this.bg.height;
			if(this.parent)
				this.x = window.innerWidth - this.width;
		}

		private hideView(): void {
			this.visible = false;
		}

		private updateNodesDetailHandler(): void {
			this.visible = false;
		}

		// 自定义节点
		private addCustom(): void {
			let customItemData: model.ContentMenuItemData = new model.ContentMenuItemData();
			customItemData.add = false;
			customItemData.name = "Custom";
			customItemData.open = false;
			customItemData.width = 375;
			let customView: CustomDescriptorView = new CustomDescriptorView();
			this._customContent.addContent(customItemData, customView);
		}

		private addExeIns(): void {
			let customItemData: model.ContentMenuItemData = new model.ContentMenuItemData();
			customItemData.add = true;
			customItemData.name = "ExeIns";
			customItemData.open = false;
			customItemData.width = 375;
			let customView: CustomSlotView = new CustomSlotView(core.SlotType.ExecutionIn);
			this._customContent.addContent(customItemData, customView);
		}

		private addExeOuts(): void {
			let customItemData: model.ContentMenuItemData = new model.ContentMenuItemData();
			customItemData.add = true;
			customItemData.name = "ExeOuts";
			customItemData.open = false;
			customItemData.width = 375;
			let customView: CustomSlotView = new CustomSlotView(core.SlotType.ExecutionOut);
			this._customContent.addContent(customItemData, customView);
		}

		private addInputs(): void {
			let customItemData: model.ContentMenuItemData = new model.ContentMenuItemData();
			customItemData.add = true;
			customItemData.name = "Inputs";
			customItemData.open = false;
			customItemData.width = 375;
			let customView: CustomSlotView = new CustomSlotView(core.SlotType.DataIn);
			this._customContent.addContent(customItemData, customView);
		}

		private addOutputs(): void {
			let customItemData: model.ContentMenuItemData = new model.ContentMenuItemData();
			customItemData.add = true;
			customItemData.name = "Outputs";
			customItemData.open = false;
			customItemData.width = 375;
			let customView: CustomSlotView = new CustomSlotView(core.SlotType.DataOut);
			this._customContent.addContent(customItemData, customView);
		}

		private updateCustomDetailHandler(data: model.Custom): void {
			this.visible = true;
			this.onResizeHandler();
			this._variableContent.visible = false;
			this._customContent.visible = true;
			let descriptorView: core.IContent = this._customContent.getView("Custom");

			if (descriptorView) {
				descriptorView.setData(data);
			}

			let inputsView: core.IContent = this._customContent.getView("Inputs");
			if (inputsView) {
				inputsView.setData(data);
			}

			let outputsView: core.IContent = this._customContent.getView("Outputs");
			if (outputsView) {
				outputsView.setData(data);
			}

			let exeInsView: core.IContent = this._customContent.getView("ExeIns");
			if (exeInsView) {
				exeInsView.setData(data);
			}

			let exeOutsView: core.IContent = this._customContent.getView("ExeOuts");
			if (exeOutsView) {
				exeOutsView.setData(data);
			}
		}

		private updateVariableDetailHandler(data: model.Variable): void {
			this.onResizeHandler();
			this.visible = true;
			this._variableContent.visible = true;
			this._customContent.visible = false;
			let setView: core.IContent = this._variableContent.getView("Variable");

			if (setView) {
				setView.setData(data);
			}

			let defaultValueView: core.IContent = this._variableContent.getView("Default Value");
			if (defaultValueView) {
				defaultValueView.setData(data);
			}
		}



		private addVariable(): void {
			let variableItemData: model.ContentMenuItemData = new model.ContentMenuItemData();
			variableItemData.add = false;
			variableItemData.name = "Variable";
			variableItemData.open = false;
			variableItemData.width = 375;
			let variableView: VariableSetView = new VariableSetView();
			this._variableContent.addContent(variableItemData, variableView);
		}

		private addDefaultValue(): void {
			let defaultValueItemData: model.ContentMenuItemData = new model.ContentMenuItemData();
			defaultValueItemData.add = false;
			defaultValueItemData.name = "Default Value";
			defaultValueItemData.open = false;
			defaultValueItemData.width = 375;
			let variableView: VariableDefaultValueView = new VariableDefaultValueView();
			this._variableContent.addContent(defaultValueItemData, variableView);
		}

		private changeCustonTypeHandler(data: model.Custom): void {
			if (data.getType() == core.CustomType.SWITCH && this._customContent) {
				this._customContent.deleteContent("Outputs");
			}
			else if (data.getType() == core.CustomType.BRIDGE) {
				this.addOutputs();
			}
		}
	}
}