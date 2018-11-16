/**
* 插槽类
* @author confiner
*/
module model
{
	//import SlotType = core.SlotType;

	export class Slot extends Model
	{
		constructor()
		{
			super();
		}

		private _id:string;	// 插槽id
		private _nodeId:string;	// 所在节点id
		private _name:string;	// 插槽名字
		private _type:core.SlotType;	// 插槽类型
		private _data:Datum;	// 插槽数据

		public isLock():boolean
		{
			if(this._data)
				return this._data.isLock();
				
			return false;
		}

		public setId(id:string):void
		{
			if(this._id == id)
				return;

			this._id = id;
			//this.invalid = true;
		}

		public getType():core.SlotType
		{
			return this._type;
		}

		public setDefaultData():void
		{
			if(this._data)
				this._data.setDefaultValue();
		}

		public setType(type:core.SlotType):void
		{
			if(this._type == type)
				return;

			this._type = type;
			this.invalid = true;
		}

		public getId():string
		{
			return this._id;
		}

		public getNodeId():string
		{
			return this._nodeId;
		}

		public setNodeId(nodeId:string):void
		{
			if(this._nodeId == nodeId)
				return;

			this._nodeId = nodeId;
			this.invalid = true;
		}

		public getName():string
		{
			return this._name;
		}

		public setName(name:string):void
		{
			if(name == this._name)
				return;

			this._name = name;
			this.invalid = true;
		}

		public setData(data:Datum):void
		{
			if(data.equals(this._data))
				return;

			if(this._data && this._data.hasListener(Model.UPDATE))
				this._data.off(Model.UPDATE, this, this.updateInvalidStatus);
				
			this._data = data;
			this._data.on(Model.UPDATE, this, this.updateInvalidStatus);
			this.invalid = true;
		}

		public setDataType(type:core.DatumType):void
		{
			if(!this._data || this._data.getType() == type)
				return;

			this._data.setType(type);
			this._data.setDefaultValue();
		}

		public getDataType():core.DatumType
		{
			if(this._data)
				return this._data.getType();
			
			return null;
		}

		

		public writeTo(slotObj:Object):void
		{
			if(this._type == core.SlotType.ExecutionOut || this._type == core.SlotType.ExecutionIn)
			{
				//slotObj = this._name;
				// 字符串类型不是引用类型无法传出
			}
			else if(this._type == core.SlotType.DataIn || this._type == core.SlotType.DataOut)
			{	
				slotObj[this._name] = {};
				this._data.writeTo(slotObj[this._name]);
			}
		}

		public setValue(value:Object):void
		{
			if(!this._data)
			{
				console.error("error: the slot :" + this._name +" is not initialized, can not to be setValue");
				return;
			}

			this._data.setValue(value);
		}

		public getValue():any
		{
			if(this._data)
				return this._data.getValue();

			return null;
		}

		public getData():Datum
		{
			return this._data;
		}

		// 是否匹配
		public match(other:Slot):boolean
		{
			if(this._type == core.SlotType.ExecutionIn && other._type == core.SlotType.ExecutionOut
				|| this._type == core.SlotType.ExecutionOut && other._type == core.SlotType.ExecutionIn)
			{
				return true;
			}

			if((!this._data && other._data) || (this._data && !other._data))
			{
				return false;
			}
			
			if(((!this._data && !other._data ) || this._data.getType() == other._data.getType())
			&& (this._type == core.SlotType.DataIn && other._type == core.SlotType.DataOut
				|| this._type == core.SlotType.DataOut && other._type == core.SlotType.DataIn))
			{
				return true;
			}

			return false;
		}

		public update():void
		{
			if(this._data)
				this._data.update();

			if(this.invalid)
				this.event(Model.UPDATE, [this]);
			
			this.invalid = false;
		}

		public dispose():void
		{
			this.offAll();
			super.dispose();
			this._name = null;
			this._type = null;
			this._nodeId = null;
			if(this._data)
				this._data.dispose();
		}

		public equals(other:Slot):boolean
		{
			if(!other)
				return false;

			// 如果名字相同则认为是同一个插槽
			if(this._name == other._name)
				return true;

			return false;
		}

		public clone():Slot
		{
			let slot:Slot = new Slot();
			slot._id = this._id;
			slot._name = this._name;
			if(this._data)
				slot._data = this._data.clone();
			slot._type = this._type;
			slot._nodeId = this._nodeId;
			return slot;
		}

		public copy(other:Slot):void
		{
			this._id = other._id;
			this._name = other._name;
			if(other._data)
			{
				if(!this._data)
				{
					this.setData(other._data.clone());
				}
				else
				{
					this._data.copy(other._data);
				}
			}
			this._type = other._type;
			this._nodeId = other._nodeId;
		}
	}
}