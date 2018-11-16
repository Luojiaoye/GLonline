/**
* @author confiner
* @desc	插槽列表界面
*/
module ui{
	import Elements = ui.Editor.Elements;
	import Point = Laya.Point;

	export class SlotsView extends Laya.Sprite implements IData
	{
		data:model.Node; // 插槽数据
		private _slotIns:Array<SlotInItem>;	// 输入插槽列表
		private _slotInPool:Array<SlotInItem>;
		private _slotOuts:Array<SlotOutItem>;	// 输出插槽列表
		private _slotOutPool:Array<SlotOutItem>;
		private _leftWidth:number = 0;
		private _rightWidth:number = 0;
		private _hasIn:boolean = false;
		private _hasOut:boolean = false;
		private readonly _ItemHeight:number = 29;

		private _anchor:Sprite = null;
		public setAnchor(anchor:Sprite):void
		{
			this._anchor = anchor;
		}

		constructor()
		{
			super();
			this._slotInPool = new Array<SlotInItem>();
			this._slotOutPool = new Array<SlotOutItem>();
			this._slotIns = new Array<SlotInItem>();
			this._slotOuts = new Array<SlotOutItem>();
		}

		public getSlotInItem(id:string):core.ITransform
		{
			for(let i:number = 0, len = this._slotIns.length; i < len; ++i)
			{
				if(this._slotIns[i].data.getId() == id)
					return this._slotIns[i];
			}

			for(let i:number = 0, len = this._slotOuts.length; i < len; ++i)
			{
				if(this._slotOuts[i].data.getId() == id)
					return this._slotOuts[i];
			}

			return null;
		}

		destroy(destroyChild?:boolean):void
		{
			let slotIn:SlotInItem = null;
			while(this._slotIns.length > 0)
			{
				slotIn = this._slotIns.pop();
				if(slotIn.parent)
					slotIn.parent.removeChild(slotIn);
				slotIn.offAll();
				slotIn.destroy(true);
			}

			while(this._slotInPool.length > 0)
			{
				slotIn = this._slotInPool.pop();
				if(slotIn.parent)
					slotIn.parent.removeChild(slotIn);
				slotIn.offAll();
				slotIn.destroy(true);
			}

			let slotOut:SlotOutItem = null;
			while(this._slotOuts.length > 0)
			{
				slotOut = this._slotOuts.pop();
				if(slotOut.parent)
					slotOut.parent.removeChild(slotOut);
				slotOut.offAll();
				slotOut.destroy(true);
			}

			while(this._slotOutPool.length > 0)
			{
				slotOut = this._slotOutPool.pop();
				if(slotOut.parent)
					slotOut.parent.removeChild(slotOut);
				slotOut.offAll();
				slotOut.destroy(true);
			}
		}

		private update():void
		{
			this.clear();

			let slotsIn:Array<model.Slot> = this.data.getSlotIns();
			if(slotsIn.length > 0)
			{
				this.createSlotInList(slotsIn);
			}
			
			let slotsOut:Array<model.Slot> = this.data.getSlotOuts();
			if(slotsOut.length > 0)
			{
				this.createSlotOutList(slotsOut);
			}
			
			this.updateSlotItem();
		}

		private updateSlotItem():void
		{
			let startY:number = 0;
			if(this._hasIn || this._hasOut)
			{
				startY = 30;
			}

			let leftHeigh:number = 0;
			let rightHeigh:number = 0;
			let slotIn:SlotInItem = null;
			let index:number = 0;
			let graph:model.Graph = managers.GraphManager.getInstance().getCurrent();
			for(let i:number = 0, len = this._slotIns.length; i < len; ++i)
			{
				slotIn = this._slotIns[i];
				if(slotIn.data.getType() == core.SlotType.ExecutionIn)
				{
					slotIn.y = 5;
				}
				else
				{
					slotIn.y = startY + index * this._ItemHeight;
					index ++;
				}

				leftHeigh =  slotIn.y + this._ItemHeight;
				if(graph)
					slotIn.setStatus(graph.existAssociation(this.data.id, slotIn.data.getId()));
			}

			index = 0;
			let slotOut:SlotOutItem = null;
			for(let i:number = 0, len = this._slotOuts.length; i < len; ++i)
			{
				slotOut = this._slotOuts[i];
				if(slotOut.data.getType() == core.SlotType.ExecutionOut && i == 0)
					slotOut.y = 5;
				else
				{
					slotOut.y = startY + index * this._ItemHeight;
					index++;
				}
				
				rightHeigh = slotOut.y + this._ItemHeight;
				if(graph)
					slotOut.setStatus(graph.existAssociation(this.data.id, slotOut.data.getId()));
			}

			this.height = Math.max(leftHeigh, rightHeigh);

			this.event(core.EventType.RESIZE);
		}

		public updateLayout():void
		{
			for(let i:number = 0, len = this._slotOuts.length; i < len; ++i)
			{
				this._slotOuts[i].right = 0;
			}
		}

		private clear():void
		{
			this._hasIn = false;
			this._hasOut = false;

			let slotIn:SlotInItem = null;
			while(this._slotIns.length > 0)
			{
				slotIn = this._slotIns.pop();
				if(slotIn.parent)
					slotIn.parent.removeChild(slotIn);
				this._slotInPool.push(slotIn);
			}

			let slotOut:SlotOutItem = null;
			while(this._slotOuts.length > 0)
			{
				slotOut = this._slotOuts.pop();
				if(slotOut.parent)
					slotOut.parent.removeChild(slotOut);
				this._slotOutPool.push(slotOut);
			}
		}

		private createSlotInList(arr:Array<model.Slot>):void
		{
			let slotIn:SlotInItem = null;
			let graph:model.Graph = managers.GraphManager.getInstance().getCurrent();
			for(let i:number = 0, len = arr.length; i < len; ++i)
			{
				slotIn = this.createSlotInItem();
				if(arr[i].getType() == core.SlotType.ExecutionIn)
					this._hasIn = true;

				slotIn.setData(arr[i]);
				slotIn.input_slotValue.editable = true;
				if(graph && graph.hasAssociation(this.data.id, arr[i].getId()))
				{
					slotIn.input_slotValue.editable = false;
				}
				this._slotIns.push(slotIn);
			}
		}

		private createSlotInItem():SlotInItem
		{
			let slotIn:SlotInItem = null;
			if(this._slotInPool.length> 0)
			{
				slotIn = this._slotInPool.pop();
				slotIn.clear();
			}

			if(!slotIn)
			{
				slotIn = new SlotInItem();
				//slotIn.setAnchor(this.parent as Sprite);
				slotIn.setAnchor(this._anchor);
				this.addChild(slotIn);
				slotIn.on(core.EventType.RESIZE, this, this.onResizeHandler);
			}

			return slotIn;
		}

		private onResizeHandler(isIn:boolean, w:number):void
		{
			if(isIn)
			{
				this._leftWidth = this._leftWidth > w ? this._leftWidth : w;
			}
			else
			{
				this._rightWidth = this._rightWidth > w ? this._rightWidth : w;
			}

			let width:number = this._leftWidth + this._rightWidth + 10;
			this.width = this.width < width ? width : this.width;
			this.event(core.EventType.RESIZE);
		}

		private createSlotOutList(arr:Array<model.Slot>):void
		{
			let slotOut:SlotOutItem = null;
			for(let i:number = 0, len = arr.length; i < len; ++i)
			{
				slotOut = this.createSlotOutItem();
				if(arr[i].getType() == core.SlotType.ExecutionOut)
					this._hasOut = true;

				slotOut.setData(arr[i]);
				this._slotOuts.push(slotOut);
			}
		}

		private createSlotOutItem():SlotOutItem
		{
			let slotOut:SlotOutItem = null;
			if(this._slotOutPool.length> 0)
			{
				slotOut = this._slotOutPool.pop();
				slotOut.clear();
			}

			if(!slotOut)
			{
				slotOut = new SlotOutItem();
				this.addChild(slotOut);
				slotOut.on(core.EventType.RESIZE, this, this.onResizeHandler);
				//slotOut.setAnchor(this.parent as Sprite);
				slotOut.setAnchor(this._anchor);
			}
			slotOut.right = 0;

			return slotOut;
		}

		setData(data:model.Node):void
		{
			this.data = data;
			this.update();
		}
	}
}