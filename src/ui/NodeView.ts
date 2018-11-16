/**
* @author confiner
* @desc 节点视图 
*/
module ui {

	import Elements = ui.Editor.Elements;
	import GraphManager = managers.GraphManager;
	import Event = Laya.Event;
	import Point = Laya.Point;
	import Graph = model.Graph;

	export class NodeView extends Elements.NodeViewUI implements IData {
		private _box_slots: SlotsView = null; // 插槽界面
		data: model.Node;	// 节点数据

		constructor() {
			super();
			this.clearStatus();
			this.addEvents();

			//Laya.timer.frameLoop(100, this, this.postUpdate);
		}

		private postUpdate(): void {
			this.debugSprite(this);
			this.graphics
		}

		private debugSprite(sp: Laya.Node): void {
			let num: number = sp.numChildren;
			let child: Laya.Node = null;
			if (num == 0) {
				if (sp["graphics"]) {
					//sp["graphics"].clear();
					sp["graphics"].drawRect(0, 0, sp["width"], sp["height"], null, "#ff0000", 1);
				}
			}
			else {
				while (num > 0) {
					num--;
					child = sp.getChildAt(num);
					this.debugSprite(child);
				}
			}
		}

		// 销毁对象
		destroy(destroyChild?: boolean): void {
			super.destroy(destroyChild);
			managers.EventManager.getInstance().off(core.EventType.DEBUG_RESULT, this, this.debugResultHandler);
			managers.EventManager.getInstance().off(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			this.offAll();
		}

		// 添加事件
		private addEvents(): void {
			this.check_entry.clickHandler = new Handler(this, this.clickHandler, [this.check_entry]);
			this.check_exit.clickHandler = new Handler(this, this.clickHandler, [this.check_exit]);
			this.cbx_debug.clickHandler = new Handler(this, this.debugHandler);
			managers.EventManager.getInstance().on(core.EventType.DEBUG_OPERATION, this, this.onDebugOperationHandler);
			managers.EventManager.getInstance().on(core.EventType.DEBUG_RESULT, this, this.debugResultHandler);
		}

		private onDebugOperationHandler(operationType: string): void {
			if (operationType == core.DebugType.DebugExit.toString()) {
				this.img_old.visible = this.img_status.visible = false;
				this.cbx_debug.selected = false;
			}
		}

		private debugResultHandler(operationType: string): void {
			this.img_old.visible = false;
			this.img_status.visible = false;
			let graphDebugInfo: model.GraphDebugInfo = managers.DebugManager.getInstance().getCurrent();
			if (graphDebugInfo) {
				if (graphDebugInfo.getHitNodeId() == this.data.id) {
					this.img_status.visible = true;
					this.img_status.width = this.img_select.width;
					this.img_status.height = this.img_select.height;
					if (this.img_select.visible)
						this.img_select.visible = false;
				}
				// else if(graphDebugInfo.isInDebugStack(this.data.id))
				// {
				// 	this.img_old.visible = true;
				// 	this.img_old.width = this.img_select.width;
				// 	this.img_old.height = this.img_select.height;
				// }
			}
		}

		private debugHandler(): void {
			let isDebug: boolean = this.cbx_debug.selected;
			this.data.setDebug(isDebug);
			if (isDebug)
				managers.DebugManager.getInstance().debugAdd(this.data.id);
			else
				managers.DebugManager.getInstance().debugDelete(this.data.id);
		}


		private clickHandler(check: Laya.CheckBox): void {
			let graph: Graph = GraphManager.getInstance().getGraph(this.data.ownerGraphName);
			if (!graph) {
				console.error("error: node name:" + this.data.getName() + " belong to graph name + " + this.data.ownerGraphName + " is null");
			}
			else {
				if (check == this.check_entry)
					graph.childNodeCall = this.data.id;
				else if (check == this.check_exit)
					graph.childNodeReturn = this.data.id;
			}
		}

		// 获取插槽
		public getItem(slotId: string): core.ITransform {
			return this._box_slots.getSlotInItem(slotId);
		}

		// 更新
		private update(): void {
			this.box_right.visible = !this.data.isBak;
			this.box_error.visible = this.data.isBak;
			this.box_error.mouseEnabled = this.data.isBak;
			this.cbx_debug.visible = this.data.type != core.NodeType.Data;

			this.img_title.skin = "editor/" + (managers.NodeManager.getInstance().GetColorId(this.data.category) % 11) + ".png";
			this.txt_nodeName.text = this.data.getName();
			let w: number = 2 * this.txt_nodeName.x + this.txt_nodeName.width + 20 + this.cbx_debug.width + 20;
			this.cbx_debug.x = this.txt_nodeName.x + this.txt_nodeName.width + 20;
			w = Math.max(w, 180);
			this.txt_category.text = this.data.category.toString();
			let graph: model.Graph = GraphManager.getInstance().getGraph(this.data.ownerGraphName);
			if (graph) {
				this.check_entry.selected = graph.childNodeCall == this.data.id;
				this.check_exit.selected = graph.childNodeReturn == this.data.id;
			}

			if (!this._box_slots) {
				this._box_slots = new SlotsView();
				this._box_slots.setAnchor(this._anchor);
				this._box_slots.width = w;
				this._box_slots.y = this.img_title.height;
				this.addChild(this._box_slots);
				this._box_slots.on(core.EventType.RESIZE, this, this.onResizeHandler);
			}

			this._box_slots.setData(this.data);

			this.bg.height = this._box_slots.y + this._box_slots.height + 45;
			if (!this.data.isBak) {
				this.box_right.height = this.bg.height;
				this.box_right.width = this.bg.width;
			}

			this.cbx_debug.selected = this.data.getDebug();
			this._box_slots.visible = !this.data.isBak;
		}

		private _anchor: Sprite = null;
		public setAnchor(anchor: Sprite): void {
			this._anchor = anchor;
		}


		private onResizeHandler(): void {
			if (this._box_slots) {
				this.bg.width = this._box_slots.width + 14;
				this.img_title.width = this._box_slots.width;
				this.img_select.width = this._box_slots.width + 28;
				this.width = this.bg.width;
				this.cbx_debug.right = 20;

				this.bg.height = this.img_title.height + this._box_slots.height + 45;
				this.img_select.height = this.bg.height + 22;
				this.height = this.bg.height;
				this._box_slots.updateLayout();

				this.check_entry.left = 13;
				this.check_entry.bottom = 20;
				this.check_exit.right = 21;
				this.check_exit.bottom = 20;
				if (!this.data.isBak) {
					this.box_right.height = this.bg.height;
					this.box_right.width = this.bg.width;
				}
			}
		}

		public setSelect(slect: boolean): void {
			this.clearStatus();
			let graphDebugInfo: model.GraphDebugInfo = managers.DebugManager.getInstance().getCurrent();
			if (!graphDebugInfo) {
				this.img_select.visible = slect;
			}
			else {
				if (graphDebugInfo.getHitNodeId() == this.data.id) {
					this.img_status.visible = true;
				}
			}
		}

		private clearStatus(): void {
			this.img_select.visible = false;
			this.img_old.visible = false;
			this.img_status.visible = false;
		}

		// 设置数据
		setData(data: model.Node): void {
			this.data = data;
			this.update();

			// 测试边框
			// this.graphics.drawLine(0, 0, this.width, 0, "#ff0000", 1);
			// this.graphics.drawLine(this.width, 0, this.width, this.height, "#ff0000", 1);
			// this.graphics.drawLine(this.width, this.height, 0, this.height, "#ff0000", 1);
			// this.graphics.drawLine(0, this.height, 0, 0, "#ff0000", 1);
		}
	}
}