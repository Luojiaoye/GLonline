/**
* 流图输入关联模板类
* @author confiner 
*/
module template
{
	import Assocaition = model.Association;
	import EndPoint = model.EndPoint;
	import Node = model.Node;

	export class GraphInputTemplate implements core.ITemplate
	{
		config:Object;

		public inputs:Map<string, Object>;	// 数据输入关联列表

		public node:Node;	// 节点id

		constructor(config:Object)
		{
			this.config = config;
			this.inputs = new Map<string, Object>();
			this.parse();
		}

		parse():void
		{
			for(let slotName in this.config)
			{
				this.inputs.set(slotName, this.config[slotName]);
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
			for(let key of this.inputs.keys())
			{
				if(String(key) == "flow_graph")
					continue;
					
				assoObj = this.inputs.get(key);
				let defaultValue:any = assoObj["defaultValue"];
				if(defaultValue != undefined && defaultValue != null)
				{
					// 无连线设置默认值优先
					if(!this.node)
						console.error("error: the default value for the slot :" + key + " not exist in node");
					else if(defaultValue != "")
						this.node.setInputValue(String(key), assoObj["defaultValue"]);
				}
				else
				{
					assocaition = new Assocaition();
					startEP = new EndPoint();
					startEP.setNodeId(assoObj["node_id"]);
					startEP.setSlotName(assoObj["pin"]);
					assocaition.setStart(startEP);
					endEP = new EndPoint();
					endEP.setNodeId(this.node.id);
					endEP.setSlotName(String(key));
					assocaition.setEnd(endEP);
					assocaitions.push(assocaition);
				}
			}

			return assocaitions;
		}
	}
}