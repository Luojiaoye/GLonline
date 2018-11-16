/**
* 节点描述类 
* @author confiner 
*/
module template
{
	import Node = model.Node;
	import NodeType = core.NodeType;
	import Slot = model.Slot;
	import SlotType = core.SlotType;
	import SlotNames = core.SlotNames;

	export class NodeTemplate implements core.ITemplate
	{
		config:Object;
		constructor(config:Object)
		{
			this.config = config;
			this.parse();
		}

		public nodeTips:string;	// 节点tips
		public type:string;	// 节点类型
		public name:string; 	// 节点名字
		public category:string;	// 节点所属类别
		public subCategory:string;	// 节点所属的二级节点
		public next:Array<string>;	// 执行输出插槽列表
		public input:Object;	// 数据输入对象
		public output:Object;	// 数据输出对象
		public isGraphNodeTemplate;	// 是否为流图节点模板
		public before:Object;	// 变量模板执行输入对象
		
		parse():void
		{
			this.nodeTips = this.config["nodeTips"];
			this.category = this.config["category"];
			this.type = this.config["type"];
			this.name = this.config["name"];
			this.next = this.config["next"];
			this.input = this.config["input"];
			this.output = this.config["output"];
			this.subCategory = this.config["subCategory"];
			this.before = this.config["before"];
		}

		public createNode(id?:string):Node
		{
			let node:Node = new Node();
			node.setName(this.name);
			node.category = this.category;
			node.subCategory = this.subCategory;
			node.nodeTips = this.nodeTips;
			if(id)
				node.setId(id);
			if(this.isGraphNodeTemplate)
				node.isGraphNode = Boolean(this.isGraphNodeTemplate);

			node.setType(this.type);

			if(this.before)
			{
				node.createSlot(SlotType.ExecutionIn, String(this.before));
			}

			if(node.type == NodeType.Variable)
			{
				if(this.next)
				{
					// 创建执行输出
					node.createSlot(SlotType.ExecutionOut, SlotNames.Out);
				}

				if(this.output)
				{
					// 创建数据输出
					node.createSlot(SlotType.DataOut);
				}
				
				if(this.input)
				{
					// 创建数据输入
					node.createSlot(SlotType.DataIn);
				}
			}
			else
			{
				if(this.next)
				{
					for(let i:number = 0; i < this.next.length; ++i)
					{
						node.createSlot(SlotType.ExecutionOut, String(this.next[i]));
					}
				}
				
				if(this.output)
				{
					let dot:DataOutTemplate = new DataOutTemplate(this.output);
					let dosList:Array<Slot> = dot.createDataOutSlots();
					for(let i:number = 0; i < dosList.length; ++i)
					{
						node.addSlot(dosList[i]);
					}
				}
				
				if(this.input)
				{
					let dit:DataInTemplate = new DataInTemplate(this.input);
					let disList:Array<Slot> = dit.createDataInSlots();
					for(let i:number = 0; i < disList.length; ++i)
					{
						node.addSlot(disList[i]);
					}
				}
			}

			return node;
		}
	}
}