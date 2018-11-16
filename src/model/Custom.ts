/**
* 自定义节点
* @author confienr
*/
module model
{
	import Slot = model.Slot;
	//import DatumType = core.DatumType;
	//import SlotType = core.SlotType;

	export class Custom extends model.Model
	{
		private _name:string;	// 自定义节点名称
		private _node:Node;	// 节点数据
		private _id:string;
		private _bind:boolean;	// 是否绑定输入输出
		private _type:core.CustomType = core.CustomType.BRIDGE;

		public static readonly CATEGORY:string = "customs";

		constructor()
		{
			super();
			this._node = new Node();
			this._node.type = core.NodeType.Custom;
			this._node.category = Custom.CATEGORY;
			this._node.on(Model.UPDATE, this, this.updateInvalidStatus);
			this.init();
		}

		private init():void
		{
			this._node.createSlot(core.SlotType.ExecutionIn, core.SlotNames.In.toString());
		}

		public getType():core.CustomType
		{
			return this._type;
		}

		public setType(type:core.CustomType):void
		{
			this._type = type;
		}

		public getNode():Node
		{
			return this._node;
		}

		public createCustomNode():Node
		{
			return this._node.clone();
		}

		public setBind(bind:boolean):void
		{
			this._bind = bind;
		}

		public getId():string
		{
			return this._id;
		}

		public setId(id:string):void
		{
			this._id = id;
			this._node.setOwnerId(this._id);
		}

		public getBind():boolean
		{
			return this._bind;
		}

		public equals(other:Custom):boolean
		{
			if(!other)
				return false;

			return this._id == other._id;
		}

		public getName():string
		{
			return this._name;
		}

		public setName(name:string):void
		{
			if(this._name == name)
				return;

			this._name = name;
			this._node.setName(name);
			this.invalid = true;
		}

		public changeSlotName(slot:Slot, name:string):void
		{
			let realName:string = "";
			if(this._bind)
			{
				let other:Slot = this.getRelativeSlot(slot);
				if(other)
				{
					if(other.getType() == core.SlotType.DataIn)
						realName = "Input" + name;
					else if(other.getType() == core.SlotType.DataOut)
						realName = "Output" + name;
					this._node.changeSlotName(other, realName);
				}	
			}

			if(slot.getType() == core.SlotType.DataIn)
				realName = "Input" + name;
			else if(slot.getType() == core.SlotType.DataOut)
				realName = "Output" + name;
			else
				realName = name;
			this._node.changeSlotName(slot, realName);
		}

		public changeSlotDatumType(slot:Slot, type:core.DatumType):void
		{
			if(this._bind)
			{
				let other:Slot = this.getRelativeSlot(slot);
				if(other)
					other.setDataType(type);
			}
			slot.setDataType(type);
		}

		public createInputSlot():Slot
		{
			let name:string = "Input" + this._node.getDataInputsCount();
			let slot:Slot = this._node.createSlot(core.SlotType.DataIn, name);
			slot.setData(new Datum());
			slot.setDataType(core.DatumType.Boolean);
			slot.setDefaultData();
			return slot;
		}

		public createOutputSlot():Slot
		{
			let name:string = "Output" + this._node.getDataOutputsCount();
			let slot:Slot = this._node.createSlot(core.SlotType.DataOut, name);
			slot.setData(new Datum());
			slot.setDataType(core.DatumType.Boolean);
			slot.setDefaultData();
			return slot;
		}

		public createExecutionInSlot():Slot
		{
			if(this._node.executionIn)
				return this._node.executionIn;

			let slot:Slot = this._node.createSlot(core.SlotType.ExecutionIn, core.SlotNames.In.toString());
			return slot;
		}

		public createExecutionOutSlot():Slot
		{
			let name:string = core.SlotNames.Out + this._node.getExecutionOutCount();
			let slot:Slot = this._node.createSlot(core.SlotType.ExecutionOut, name);
			return slot;
		}

		public deleteSlot(slot:Slot):void
		{
			if(this._bind)
			{
				let other:Slot = this.getRelativeSlot(slot);
				if(other)
					this._node.deleteSlot(other);
			}
			this._node.deleteSlot(slot);
		}

		private getRelativeSlot(slot:Slot):Slot
		{
			let type:core.SlotType = core.SlotType.DataOut;
			if(slot.getType() == core.SlotType.DataOut)
				type = core.SlotType.DataIn;
			if(slot.getType() == core.SlotType.ExecutionOut)
				type = core.SlotType.ExecutionIn;

			let index:number = this._node.getIndexBySlot(slot);
			if(index > -1)
			{
				let other:Slot = this._node.getSlotByIndex(type, index);
				return other;
			}

			return null;
		}

		public readFrom(customObj:Object):void
		{
			this._node.readFrom(customObj);
			this._name = this._node.getName();
			let typeStr:string = customObj["subType"];
			switch(typeStr)
			{
				case core.CustomType.BRIDGE.toString():
					this.setType(core.CustomType.BRIDGE);
				break;
				case core.CustomType.SWITCH.toString():
					this.setType(core.CustomType.SWITCH);
				break;
			}
		}

		public writeTo(customObj:Object):void
		{
			this._node.writeTo(customObj);
		}

		public copyToNode(node:Node):void
		{
			let nodeId:string = node.id;
			node.copy(this._node);
			node.setId(nodeId);	// id不能被覆盖
			//node.setOwnerId(this._id);
		}

		public resortSlot(slot:Slot, isUp:boolean):void
		{
			if(this._bind)
			{
				let other:Slot = this.getRelativeSlot(slot);
				if(other)
					this._node.resortSlot(other, isUp);
			}
			this._node.resortSlot(slot, isUp);
		}

		public dispose():void
		{
			super.dispose();
			this.offAll();

			this._name = null;
			this._node.dispose();
			this._node = null;
		}

		public update():void
		{
			this._node.update();

			if(this.invalid)
				this.event(Model.UPDATE, [this]);
			
			this.invalid = false;
		}
	}
}