/**
* 端点类
* @author confiner 
*/
module model
{
	export class EndPoint extends model.Model
	{
		private _nodeId:string;	//节点id
		private _slotName:string;	// 插槽名字[只用于配置]
		private _slotId:string;	// 插槽id
		public transform:core.ITransform;	// transform组件

		public getNodeId():string
		{
			return this._nodeId;
		}

		public setNodeId(nodeId:string):void
		{
			this._nodeId = nodeId;
			this.invalid = true;
		}

		public setSlotName(name:string):void
		{
			this._slotName = name;
		}

		public getSlotName():string
		{
			return this._slotName;
		}

		public getSlotId():string
		{
			return this._slotId;
		}

		public setSlotId(slotId:string):void
		{
			this._slotId = slotId;
			this.invalid = true;
		}

		constructor()
		{
			super();
		}

		public dispose():void
		{
			this.offAll();
			super.dispose();
			this._slotId = null;
			this._nodeId = null;
			this.transform = null;
		}

		public update():void
		{
			super.update();
			if(this.invalid)
				this.event(Model.UPDATE, [this]);

			this.invalid = false;
		}

		// 等于
		public equals(other:EndPoint):boolean
		{
			if(!other)
				return false;
				
			return this._nodeId == other.getNodeId() && this._slotId == other.getSlotId();
		}
	}
}