/**
* 关联类
* @author confiner
*/
module model
{
	export class Association extends model.Model
	{
		private _start:EndPoint;	// 关联开始端点
		private _end:EndPoint;	// 关联结束端点
		constructor()
		{
			super();
		}

		public getEnd():EndPoint
		{
			return this._end;
		}

		public isExecution():boolean
		{
			let graph:model.Graph = managers.GraphManager.getInstance().getCurrent();
			let node:Node = graph.getNodeById(this._start.getNodeId());
			let slot:Slot = node.getSlotById(this._start.getSlotId());
			return slot.getType() == core.SlotType.ExecutionOut;
		}

		public setEnd(end:EndPoint):void
		{
			if(end.equals(this._end))
				return;
			
			this._end = end;
			this._end.on(Model.UPDATE, this, this.updateInvalidStatus);
			this.invalid = true;
		}

		public getStart():EndPoint
		{
			return this._start;
		}

		public setStart(start:EndPoint):void
		{
			if(start.equals(this._start))
				return;

			this._start = start;
			this._start.on(Model.UPDATE, this, this.updateInvalidStatus);
			this.invalid = true;
		}

		public dispose():void
		{
			super.dispose();
			this.offAll();
			if(this._start)
				this._start.dispose();
			if(this._end)
				this._end.dispose();
			this.invalid = false;
		}

		public update():void
		{
			if(this._start)
				this._start.update();
			
			if(this._end)
				this._end.update();

			if(this.invalid)
				this.event(Model.UPDATE, [this]);

			this.invalid = false;
		}

		// 是否和节点相关
		public relateToNode(nodeId:string):boolean
		{
			if(this._start && this._start.getNodeId() == nodeId)
				return true;

			if(this._end && this._end.getNodeId() == nodeId)
				return true;

			return false;
		}

		// 相等
		public equals(other:Association):boolean
		{
			if(!other)
				return false;
				
			let sEqual:boolean = false;
			if(!this._start && !other.getStart())
				sEqual = true;
			else if(this._start && other.getStart())
				sEqual = this._start.equals(other.getStart());

			let eEqual:boolean = false;
			if(!this._end && !other._end)
				eEqual = true;
			else if(this._end && other._end)
				eEqual = this._end.equals(other._end);

			return sEqual && eEqual;
		}
	}
}