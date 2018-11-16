/**
* 流图类
* @author confiner
*/
module model {
	//import NodeType = core.NodeType;
	import Node = model.Node;
	import Association = model.Association;
	//import SlotType = core.SlotType;
	//import EventType = core.EventType;
	//import EventManager = managers.EventManager;

	export class Graph extends model.Model {
		public name: string;	// 流图名称
		public nodes: Map<string, Node>;	// 节点列表
		public associations: Array<Association>;	// 关联列表
		public subGraphTemplateBaks: Map<string, Node>; // 子流图备份列表

		public isChildGraph: boolean = false;	// 是否为子流图

		public childNodeCall: string;	// 子流图节点入口
		public childNodeReturn: string;	// 子流图节点出口
		public variables: Array<Variable>;	// 变量列表

		public customs: Array<Custom>;		// 自定义节点列表

		private _varGuid: number = 0;	// 变量命名需要
		private _customGuid: number = 0;	// 自定义节点id

		// 检测提交
		public checkCommit(): Array<string> {
			let ret: Array<string> = null;
			if (this.isChildGraph) {
				let graphs: Array<model.Graph> = managers.GraphManager.getInstance().getGraphs();
				for (let graph of graphs) {
					if(!graph.subGraphTemplateBaks)
						continue;

					let nodeBak: model.Node = graph.subGraphTemplateBaks.get(this.name);
					let curNode: model.Node = this.getSubGraphMegerNode();
					if (nodeBak && curNode && !curNode.same(nodeBak)) {
						if (graph.subGraphTemplateBaks && graph.subGraphTemplateBaks.has(this.name)) {
							if (!ret)
								ret = new Array<string>();

							ret.push(graph.name);
						}
					}
				}
			}
			return ret;
		}

		private getSubGraphMegerNode(): Node {
			if (this.isChildGraph && this.childNodeReturn && this.childNodeCall) {
				let childGraphNodeConfig: Object = {};
				childGraphNodeConfig["name"] = this.name;
				childGraphNodeConfig["type"] = core.NodeType.Graph.toString();
				let nodeTemplate: NodeTemplate = null;
				if (!this.nodes.has(this.childNodeCall)) {
					console.error("error: children_flow_graph_call id :" + this.childNodeCall + " not exist in the graph:" + this.name);
				}
				else {
					let startNode: Node = this.nodes.get(this.childNodeCall);
					if (startNode.type == core.NodeType.Variable || startNode.type == core.NodeType.Custom) {
						startNode.writeBefore(childGraphNodeConfig);
						startNode.writeInputs(childGraphNodeConfig);
					}
					else {
						nodeTemplate = managers.NodeManager.getInstance().getNodeTemplate(startNode.getName());
						if (!nodeTemplate) {
							console.error("error: the node template:" + startNode.getName() + " is not exist!");
						}
						else {
							childGraphNodeConfig["input"] = nodeTemplate.input;
							if (nodeTemplate.before)
								childGraphNodeConfig["before"] = nodeTemplate.before;
						}
					}


					if (!this.nodes.has(this.childNodeReturn)) {
						console.error("error: children_flow_graph_return id :" + this.childNodeReturn + " not exist in the graph:" + this.name);
					}
					let endNode: Node = this.nodes.get(this.childNodeReturn);
					if (endNode.type == core.NodeType.Variable || endNode.type == core.NodeType.Custom) {
						endNode.writeNexts(childGraphNodeConfig);
						endNode.writeOutputs(childGraphNodeConfig);
					}
					else {
						nodeTemplate = managers.NodeManager.getInstance().getNodeTemplate(endNode.getName());
						if (!nodeTemplate) {
							console.error("error: the node template:" + endNode.getName() + " is not exist!");
						}
						else {
							childGraphNodeConfig["output"] = nodeTemplate.output;
							childGraphNodeConfig["next"] = nodeTemplate.next;
						}
					}

					childGraphNodeConfig["category"] = "Graph";
				}

				// 创建子流图节点模板
				let graphNodeTemplate: NodeTemplate = managers.NodeManager.getInstance().createNodeTemplate(childGraphNodeConfig);
				graphNodeTemplate.isGraphNodeTemplate = true;
				return graphNodeTemplate.createNode();
			}

			return null;
		}

		constructor() {
			super();

			this.nodes = new Map<string, Node>();
			this.associations = new Array<Association>();
			//this.on(Model.UPDATE, this, this.updateInvalidStatus);
		}

		public deleteDebugNodeIds(): void {
			let nodeIds: Array<string> = new Array<string>();
			for (let node of this.nodes.values()) {
				if (node.getDebug()) {
					node.setDebug(false);
				}
			}
		}

		public getDebugNodeIds(): Array<string> {
			let nodeIds: Array<string> = new Array<string>();
			for (let node of this.nodes.values()) {
				if (node.getDebug()) {
					nodeIds.push(node.id);
				}
			}

			return nodeIds;
		}

		public hasAssociation(nodeId: string, slotId: string): boolean {
			if (!this.associations)
				return false;

			let endpoint: model.EndPoint = null;
			for (let asso of this.associations) {
				endpoint = asso.getEnd();
				if (endpoint.getNodeId() == nodeId && endpoint.getSlotId() == slotId)
					return true;
			}

			return false;
		}

		protected updateInvalidStatus(data?: any): void {
			super.updateInvalidStatus(data);
			managers.EventManager.getInstance().event(core.EventType.UPDATE_VIEW);
		}

		public equals(other: Graph): boolean {
			return false;
		}

		private preProcess(): void {
			for (let asso of this.associations) {
				this.preProcessEndPoint(asso.getStart());
				this.preProcessEndPoint(asso.getEnd());
			}
		}

		private preProcessEndPoint(endPoint: EndPoint): void {
			let node: Node = this.getNodeById(endPoint.getNodeId());
			if (node) {
				let slot: Slot = node.getSlotById(endPoint.getSlotId());
				if (slot) {
					endPoint.setSlotName(slot.getName());
				}
			}
		}

		public postProcess(): void {
			let badAsso: Array<Association> = new Array<Association>();
			for (let asso of this.associations) {
				if (!this.postProcessEndPoint(asso.getStart())) {
					badAsso.push(asso);
					continue;
				}
				if (!this.postProcessEndPoint(asso.getEnd())) {
					badAsso.push(asso);
				}
			}

			for (let i: number = 0, len: number = badAsso.length; i < len; ++i) {
				this.deleteBadAsso(badAsso[i])
			}
		}

		private deleteBadAsso(asso: Association): void {
			for (let i: number = 0, len: number = this.associations.length; i < len; ++i) {
				if (asso.equals(this.associations[i])) {
					this.associations.splice(i, 1);
					asso.dispose();
					break;
				}
			}
		}

		private postProcessEndPoint(endPoint: EndPoint): boolean {
			let ret: boolean = true;
			let node: Node = this.getNodeById(endPoint.getNodeId());
			if (node) {
				let slot: Slot = node.getSlotByName(endPoint.getSlotName());
				if (slot) {
					endPoint.setSlotId(slot.getId());
				}
				else {
					console.error("error: slot is null when post process endpoint");
					ret = false;
				}
			}
			else {
				console.error("error: node is null when post process endpoint");
				ret = false;
			}

			return ret;
		}

		public getNodeById(id: string): Node {
			return this.nodes.get(id);
		}

		public createCustom(): Custom {
			let custom: Custom = new Custom();
			let id: string = "CustomNode" + (this._customGuid++).toString();
			custom.setId(id);
			custom.setName(id);
			if (!this.customs)
				this.customs = new Array<Custom>()
			this.customs.push(custom);
			custom.on(Model.UPDATE, this, this.onUpdateCustomHandler);
			return custom;
		}

		public removeCustom(custom: Custom): void {
			if (!this.customs)
				return;

			for (let i: number = 0; i < this.customs.length; ++i) {
				if (this.customs[i].equals(custom)) {
					this.customs.splice(i, 1);
					this.deleteNodesByCustom(custom);
					custom.dispose();
					this.invalid = true;
					break;
				}
			}
		}

		private deleteNodesByCustom(custom: Custom): void {
			for (let node of this.nodes.values()) {
				if (node.type == core.NodeType.Custom) {
					if (custom.getName() == node.getName()) {
						this.deleteNode(node);
					}
				}
			}
		}

		private onUpdateCustomHandler(custom: Custom): void {
			for (let node of this.nodes.values()) {
				if (node.type == core.NodeType.Custom) {
					if (node.getOwnerId() == custom.getId()) {
						custom.copyToNode(node);

						this.verifyAssociationsByNode(node);
					}
				}
			}

			this.updateInvalidStatus();
		}


		private onUpdateVairableHandler(variable: Variable): void {
			for (let node of this.nodes.values()) {
				if (node.type == core.NodeType.Variable) {
					if (node.getOwnerId() == variable.getId()) {
						variable.copyToNode(node);

						this.verifyAssociationsByNode(node);
					}
				}
			}

			this.updateInvalidStatus();
		}

		private verifyAssociationsByNode(node: Node): void {
			let badAssos: Array<Association> = new Array<Association>();
			for (let asso of this.associations) {
				if (asso.getEnd().getNodeId() == node.id) {
					let endSlot: Slot = node.getSlotById(asso.getEnd().getSlotId());
					if (!endSlot) {
						// 插槽丢失
						badAssos.push(asso);
					}

					// 数据输入插槽类型检查
					let startNode: Node = this.nodes.get(asso.getStart().getNodeId());
					if (startNode) {
						let startSlot: Slot = startNode.getSlotById(asso.getStart().getSlotId());
						if (startSlot && startSlot.getType() == core.SlotType.DataOut) {
							if (startSlot.getDataType() != endSlot.getDataType()) {
								badAssos.push(asso);
							}
						}
					}
				}
				else if (asso.getStart().getNodeId() == node.id) {
					let startSlot: Slot = node.getSlotById(asso.getStart().getSlotId());
					if (!startSlot) {
						// 插槽丢失
						badAssos.push(asso);
					}

					// 数据输出类型检查
					let endNode: Node = this.nodes.get(asso.getEnd().getNodeId());
					if (endNode) {
						let endSlot: Slot = endNode.getSlotById(asso.getEnd().getSlotId());
						if (endSlot && endSlot.getType() == core.SlotType.DataIn) {
							if (startSlot.getDataType() != endSlot.getDataType()) {
								badAssos.push(asso);
							}
						}
					}
				}
			}

			let badAsso: Association = null;
			while (badAssos.length > 0) {
				badAsso = badAssos.pop();
				for (let i: number = 0; i < this.associations.length; ++i) {
					if (badAsso.equals(this.associations[i])) {
						this.associations.splice(i, 1);
						break;
					}
				}
			}
		}

		public createVariable(): Variable {
			let variable: Variable = new Variable();
			let id: string = this.name + "|variable" + (this._varGuid++).toString();
			variable.setId(id);
			variable.setName("variable" + (this._varGuid++).toString());
			if (!this.variables)
				this.variables = new Array<Variable>()
			this.variables.push(variable);
			variable.on(Model.UPDATE, this, this.onUpdateVairableHandler);
			return variable;
		}

		public removeVariable(variable: Variable): void {
			if (!this.variables)
				return;

			for (let i: number = 0; i < this.variables.length; ++i) {
				if (this.variables[i].equals(variable)) {
					this.variables.splice(i, 1);
					this.deleteNodesByVariable(variable);
					variable.dispose();
					this.invalid = true;
					break;
				}
			}
		}

		private deleteNodesByVariable(variable: Variable): void {
			for (let node of this.nodes.values()) {
				if (node.type == core.NodeType.Variable) {
					if (variable.getName() == node.getName()) {
						this.deleteNode(node);
					}
				}
			}
		}

		// 创建关联
		public createAssociation(one: EndPoint, other: EndPoint): Association {
			let oneNode: Node = this.nodes.get(one.getNodeId());
			if (!oneNode) {
				console.error("error: node id: " + one.getNodeId() + "not exist in the graph:" + this.name);
			}
			else {
				let otherNode: Node = this.nodes.get(other.getNodeId());
				if (!otherNode) {
					console.error("error: node id: " + other.getNodeId() + "not exist in the graph:" + this.name);
				}
				else {
					let oneSlot: Slot = oneNode.getSlotById(one.getSlotId());
					if (!oneSlot) {
						console.error("error: slot id: " + one.getSlotId() + "not exist in the node:" + oneNode.getName());
					}
					else {
						let otherSlot: Slot = otherNode.getSlotById(other.getSlotId());
						if (!otherSlot) {
							console.error("error: slot id: " + other.getSlotId() + "not exist in the node:" + otherNode.getName());
						}
						else {
							if (!oneSlot.match(otherSlot)) {
								return null;
							}
							else {
								let assocaition: Association = new model.Association();
								let isOneStart: boolean = (oneSlot.getType() == core.SlotType.ExecutionOut || oneSlot.getType() == core.SlotType.DataOut);
								assocaition.setStart(isOneStart ? one : other);
								assocaition.setEnd(isOneStart ? other : one);
								this.associations.push(assocaition);
								assocaition.on(Model.UPDATE, this, this.updateInvalidStatus);
								return assocaition;
							}
						}
					}
				}
			}
			return null;
		}

		// 向流图添加节点
		public addNode(node: Node): void {
			node.ownerGraphName = this.name;
			if (!node.id)
				node.setId(this.createNodeId());
			if (node.hasListener(Model.UPDATE))
				node.off(Model.UPDATE, this, this.updateInvalidStatus);

			this.nodes.set(node.id, node);
			node.on(Model.UPDATE, this, this.updateInvalidStatus);
			this.invalid = true;
		}

		private createNodeId(): string {
			let seed: number = 0;
			for (let nodeId of this.nodes.keys()) {
				if (Number(nodeId) > seed)
					seed = Number(nodeId);
			}

			return (++seed).toString();
		}

		public existAssociation(nodeId: string, slotId: string): boolean {
			let endpoint: EndPoint = null;
			for (let asso of this.associations) {
				endpoint = asso.getEnd();
				if (endpoint.getNodeId() == nodeId && endpoint.getSlotId() == slotId)
					return true;

				endpoint = asso.getStart();
				if (endpoint.getNodeId() == nodeId && endpoint.getSlotId() == slotId)
					return true;
			}

			return false;
		}

		// 从流图中删除流图
		public deleteNode(node: Node): void {
			if (this.nodes.has(node.id)) {
				this.nodes.delete(node.id);
				if (node.id == this.childNodeCall)
					this.childNodeCall = null;
				if (node.id == this.childNodeReturn)
					this.childNodeReturn = null;

				this.deleteAssociations(node);

				node.dispose();
				this.invalid = true;
			}
		}

		// 删除关联
		public deleteAssociation(asso: Association): void {
			let ass: Association = null;
			for (let i: number = 0; i < this.associations.length; ++i) {
				ass = this.associations[i];
				if (asso.equals(ass)) {
					this.associations.splice(i, 1);
					asso.dispose();
					this.invalid = true;
					break;
				}
			}
		}

		// 删除节点关联的关系
		public deleteAssociations(node: Node): void {
			let badArr: Array<Association> = new Array<Association>();
			for (let asso of this.associations) {
				if (asso.getStart() && asso.getStart().getNodeId() == node.id) {
					badArr.push(asso);
					continue;
				}

				if (asso.getEnd() && asso.getEnd().getNodeId() == node.id)
					badArr.push(asso);
			}

			let badAsso: Association = null;
			while (badArr.length > 0) {
				badAsso = badArr.pop();
				for (let i: number = 0; i < this.associations.length; ++i) {
					if (this.associations[i].equals(badAsso)) {
						this.associations.splice(i, 1);
						badAsso.dispose();
						this.invalid = true;
						break;
					}
				}
			}
		}

		// 获取event对象
		private getEventObj(): Object {
			let element: Object = null;
			for (let node of this.nodes.values()) {
				if (node.type == core.NodeType.Event) {
					if (!element)
						element = {};
					element[node.getName()] = node.id;
				}
			}

			return element;
		}

		// 获取节点对象
		public getNodeObj(node: Node): Object {
			let nodeObj: Object = { "name": node.getName(), "category": node.category };
			let inputObj: Object = this.getNodeInput(node);
			if (inputObj)
				nodeObj["input"] = inputObj;

			let nextObj: Object = this.getNodeNext(node);
			if (nextObj)
				nodeObj["next"] = nextObj;

			//node.writeOutputs(nodeObj);

			if (node.isGraphNode) {
				nodeObj["children_flow_graph_name"] = node.getName();
				nodeObj["name"] = "flow_graph_node";

				if (!this.subGraphTemplateBaks)
					this.subGraphTemplateBaks = new Map<string, Node>();
				this.subGraphTemplateBaks.set(node.getName(), node);
			}

			if (node.category == Variable.CATEGORY) {
				// 服务器数据要求
				if (node.getName().toUpperCase().indexOf(Variable.GET.toUpperCase()) != -1) {
					nodeObj["name"] = "get";
				}
				else if (node.getName().toUpperCase().indexOf(Variable.SET.toUpperCase()) != -1) {
					nodeObj["name"] = "set";
				}
				nodeObj["varName"] = node.getName().substring(3);
			}

			nodeObj["type"] = node.type.toString();

			nodeObj["ui_position"] = [node.x, node.y];
			return nodeObj;
		}

		// 获取执行输出
		private getNodeNext(node: Node): Object {
			let nextObj: Object = null;
			if (node.executionOuts && node.executionOuts.length > 0) {
				let asso: Association = null;
				let slot: Slot = null;

				for (let i: number = 0; i < this.associations.length; ++i) {
					asso = this.associations[i];
					if (asso.getStart().getNodeId() == node.id) {
						// 关联的入口为此节点
						slot = node.getSlotById(asso.getStart().getSlotId());
						if (slot && slot.getType() == core.SlotType.ExecutionOut) {
							if (!nextObj)
								nextObj = {};
							if (!nextObj[slot.getName()]) {
								nextObj[slot.getName()] = new Array<string>();
							}
							nextObj[slot.getName()].push(asso.getEnd().getNodeId());
						}
					}
				}
			}

			return nextObj;
		}

		// 获取数据输入
		private getNodeInput(node: Node): Object {
			let inputObj: Object = null;
			let asso: Association = null;
			let slot: Slot = null;
			let assoSlots: Set<string> = new Set<string>();
			if (node.getDataInputsCount() == 0)
				return null;

			for (let i: number = 0; i < this.associations.length; ++i) {
				asso = this.associations[i];
				if (asso.getEnd().getNodeId() == node.id) {
					// 关联的出口为此节点
					slot = node.getSlotById(asso.getEnd().getSlotId());
					if (slot && slot.getType() == core.SlotType.DataIn) {
						if (!inputObj)
							inputObj = {};

						inputObj[slot.getName()] = { "node_id": asso.getStart().getNodeId(), "pin": asso.getStart().getSlotName() };
						assoSlots.add(slot.getId());
						if (node.isGraphNode) {
							if (this.nodes.has(asso.getStart().getNodeId())) {
								let sNode: Node = this.nodes.get(asso.getStart().getNodeId());
								inputObj["flow_graph"] = sNode.getName();
							}
							else {
								console.error("error: grahp:" + this.name + "not cantains the flow_graph nodeId:" + asso.getStart().getNodeId());
							}
						}
					}
				}
			}

			inputObj = node.writeDefaultDataInputsTo(inputObj, assoSlots);

			return inputObj;
		}

		// 转为json字符串
		public toJson(): string {
			this.preProcess();

			let graph: Object = {};
			graph["name"] = this.name;

			let event: Object = this.getEventObj();
			if (event)
				graph["event"] = event;

			if (this.childNodeCall && this.childNodeReturn) {
				// 如果是子流图则写入call, return
				graph["children_flow_graph_call"] = this.childNodeCall;
				graph["children_flow_graph_return"] = this.childNodeReturn;
			}

			let node: Node = null;
			for (let nodeId of this.nodes.keys()) {
				node = this.nodes.get(nodeId);
				graph[nodeId] = this.getNodeObj(node);
			}

			if (this.variables) {
				let variablesObj: Object = {};
				let dataObj: Object = null;
				for (let variable of this.variables) {
					dataObj = {};
					variablesObj[variable.getName()] = dataObj;
					dataObj[variable.getType().toString()] = variable.getValue();
				}

				graph["variables"] = variablesObj;
			}

			if (this.customs) {
				let csmNodes: Array<Object> = new Array<Object>();
				let cmsNodeObj: Object = null;
				for (let custom of this.customs) {
					cmsNodeObj = { "subType": custom.getType().toString() };
					custom.writeTo(cmsNodeObj);
					csmNodes.push(cmsNodeObj);
				}

				graph["custom_nodes"] = csmNodes;
			}

			if (this.subGraphTemplateBaks) {
				let subGraphNodes: Array<Object> = new Array<Object>();
				let subGraphNodeObj: Object = null;
				for (let subGraphNode of this.subGraphTemplateBaks.values()) {
					subGraphNodeObj = {};
					subGraphNode.writeTo(subGraphNodeObj);
					subGraphNodes.push(subGraphNodeObj);
				}

				graph["sub_graphs"] = subGraphNodes;
			}

			let json: string = JSON.stringify(graph);
			return json;
		}

		public dispose(): void {
			super.dispose();

			this.offAll();
			for (let node of this.nodes.values()) {
				node.dispose();
			}
			this.nodes.clear();

			let asso: Association = null;
			while (this.associations.length > 0) {
				asso = this.associations.pop();
				asso.dispose();
			}

			if (this.variables) {
				let variable: Variable = null;
				while (this.variables.length > 0) {
					variable = this.variables.pop();
					variable.dispose();
				}

				this.variables = null;
			}

			if (this.customs) {
				let custom: Custom = null;
				while (this.customs.length > 0) {
					custom = this.customs.pop();
					custom.dispose();
				}

				this.customs = null;
			}
		}

		public update(): void {
			for (let node of this.nodes.values()) {
				node.update();
			}

			for (let asso of this.associations) {
				asso.update();
			}

			if (this.variables) {
				for (let variable of this.variables) {
					variable.update();
				}
			}

			if (this.customs) {
				for (let custom of this.customs) {
					custom.update();
				}
			}

			if (this.invalid)
				this.event(Model.UPDATE, [this]);

			this.invalid = false;
		}
	}
}