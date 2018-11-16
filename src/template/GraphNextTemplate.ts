/**
* 流图执行输出关联类
* @author confiner
*/
module template
{
	import Assocaition = model.Association;
	import SlotNames = core.SlotNames;
	import EndPoint = model.EndPoint;

	export class GraphNextTemplate implements core.ITemplate
	{
		config:Object;

		public nexts:Map<string, Object>;	// 执行输出关联列表

		public nodeId:string;	// 节点id

		constructor(config:Object)
		{
			this.config = config;
			this.nexts = new Map<string, Object>();
			this.parse();
		}

		parse():void
		{
			for(let slotName in this.config)
			{
				this.nexts.set(slotName, this.config[slotName]);
			}
		}

		// 创建数据输入关联列表
		public createAssociations():Array<Assocaition>
		{
			let assocaitions:Array<Assocaition> = new Array<Assocaition>();
			let assoObj:Object = null;
			let assocaition:Assocaition = null;
			let startEP:EndPoint = null;
			let endEP:EndPoint = null;
			let nextNodeIds:Array<string> = null;
			let nodeId:string = null;
			for(let key of this.nexts.keys())
			{
				assoObj = this.nexts.get(key);
				if(assoObj)
				{
					nextNodeIds = assoObj as Array<string>;
					if(nextNodeIds)
					{
						for(let i:number = 0; i < nextNodeIds.length; ++i)
						{
							nodeId = nextNodeIds[i];
							assocaition = new Assocaition();
							startEP = new EndPoint();
							startEP.setNodeId(this.nodeId);
							startEP.setSlotName(String(key));
							assocaition.setStart(startEP);
							endEP = new EndPoint();
							endEP.setNodeId(nodeId);
							endEP.setSlotName(SlotNames.In.toString());
							assocaition.setEnd(endEP);
							assocaitions.push(assocaition);
						}
					}
				}
			}

			return assocaitions;
		}
	}
}