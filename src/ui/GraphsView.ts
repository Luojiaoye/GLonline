/**
* @desc 所有流图界面
* @author confiner
*/
module ui{
	import GraphManager = managers.GraphManager;
	import EventType = core.EventType;
	import IData = core.IData;
	import Graph = model.Graph;
	import EventManager = managers.EventManager;

	export class GraphsView extends Editor.GraphsViewUI implements IData
	{
		data:Array<string>;

		setData(data:Array<string>):void
		{
			this.data = data;
			this.update();
		}

		private update():void
		{
			this.list_graphs.array = this.data;
			this.list_graphs.repeatY = this.data.length;
			this.list_graphs.renderHandler = new Laya.Handler(this, this.onListRender);
		}
		constructor()
		{
			super();

			this.init();
		}

		private init(): void
		{
			let names:Array<string> = new Array<string>();
			let graphs:Array<Graph> = GraphManager.getInstance().getGraphs();
			for(let graph of graphs)
			{
				names.push(graph.name);
			}

			this.setData(names);
		}

		private onListRender(cell:Laya.Box, index: number):void
		{
			let labl:Laya.Label = cell.getChildByName("graphName") as Laya.Label;
			labl.text = this.list_graphs.array[index];
			labl.on(Laya.Event.CLICK, this, this.onClickHandler, [this.list_graphs.array[index]]);
		}

		private onClickHandler(graphName:string, evt:Laya.Event):void
		{
			EventManager.getInstance().event(EventType.RELOAD_GRAPH, [graphName]);
			evt.target.off(Laya.Event.CLICK, this, this.onClickHandler);
			this.destroy();
		}
	}
}