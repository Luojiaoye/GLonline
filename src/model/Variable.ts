/**
* 变量
* @author confiner
*/
module model {
	import Node = model.Node;

	export class Variable extends model.Model {
		public static readonly GET: string = "Get";
		public static readonly SET: string = "Set";
		public static readonly CATEGORY: string = "variables";

		private _name: string;	// 变量名称
		private _data: Datum;	// 数据
		private _id: string;	// id

		constructor() {
			super();
			this._data = new Datum();
			this._data.setType(core.DatumType.Boolean);
			this._data.setDefaultValue();
			this._data.on(Model.UPDATE, this, this.updateInvalidStatus);
		}

		public getId(): string {
			return this._id;
		}

		public setId(id: string): void {
			this._id = id;
		}

		public copyToNode(node: Node): void {
			let nodeId: string = node.id;
			let ownerId: string = node.getOwnerId();
			let nodeData: Node = null;
			if (node.isGetNode()) {
				nodeData = this.createGetNode();
			}
			else if (node.isSetNode()) {
				nodeData = this.createSetNode();
			}

			let change: boolean = false;
			let dos: Slot = nodeData.getGetSlot();
			if (dos && dos.getDataType() != this._data.getType()) {
				dos.setData(this._data.clone());
				change = true;
			}


			let dis: Slot = nodeData.getSetSlot();
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

		public setName(name: string): void {
			this._name = name;
			this.invalid = true;
		}

		public getName(): string {
			return this._name;
		}

		public setType(type: core.DatumType): void {
			if (!this._data) {
				console.error("error: the datum is null when set the variable type!!");
			}
			else {
				this._data.setType(type);
			}
		}

		public setDefaultValue(): void {
			if (!this._data) {
				console.error("error: the datum is null when set the variable default value!!");
			}
			else {
				this._data.setDefaultValue();
			}
		}

		public getType(): core.DatumType {
			return this._data.getType();
		}

		public getData(): Datum {
			return this._data;
		}

		public getValue(): any {
			return this._data.getValue();
		}

		public setValue(value: any): void {
			if (!this._data) {
				console.error("error: the datum is null when set the variable value!!");
			}
			else {
				this._data.setValue(value);
				this.invalid = true;
			}
		}

		public equals(other: Variable): boolean {
			if (!other)
				return false;

			return this._id == other._id;
		}

		// 创建Get节点
		public createGetNode(): Node {
			let node: Node = managers.NodeManager.getInstance().createNode(Variable.GET);
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

		private setDataInput(node: Node): void {
			let slot: Slot = node.getGetSlot();
			if (slot) {
				slot.setName(this._name);
				slot.setData(this._data.clone());
			}
		}

		// 创建Set节点
		public createSetNode(): Node {
			let node: Node = managers.NodeManager.getInstance().createNode(Variable.SET);
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

		private setDataOutput(node: Node): void {
			let slot: Slot = node.getSetSlot();
			if (slot) {
				slot.setName(this._name);
				slot.setData(this._data.clone());
			}
		}

		public dispose(): void {
			super.dispose();
			this.offAll();

			this.invalid = false;
			this._name = null;
			this._data.offAll();
			this._data.dispose();
			this._data = null;
		}

		public update(): void {
			this._data.update();

			if (this.invalid)
				this.event(Model.UPDATE, [this]);

			this.invalid = false;
		}
	}
}