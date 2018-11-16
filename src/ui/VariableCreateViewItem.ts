/**
* 创建变量的Item
* @author confiner
*/
module ui
{
	import IData = core.IData;
	import Variable = model.Variable;
	import Event = Laya.Event;
	import EventManager = managers.EventManager;
	import EventType = core.EventType;
	import Graph = model.Graph;
	import GraphManager = managers.GraphManager;

	export class VariableCreateViewItem extends Editor.Elements.VariableCreateViewItemUI implements core.IData
	{
		data:Variable;

		setData(data:Variable):void
		{
			if(data.equals(this.data))
				return;
				
			this.data = data;
			this.update();
			this.data.on(model.Model.UPDATE, this, this.update);
		}

		constructor()
		{
			super();
			this.init();
		}

		private init():void
		{
			this.btn_delete.visible = false;
			this.img_over.visible = false;
			this.btn_delete.on(Event.CLICK, this, this.onDeleteHandler);
			this.on(Event.MOUSE_OVER, this, this.onMouseHandler);
			this.on(Event.MOUSE_OUT, this, this.onMouseHandler);
			this.on(Event.CLICK, this, this.onMouseHandler);
		}

		private onMouseHandler(evt:Event):void
		{
			if(evt.currentTarget == this)
			{
				switch(evt.type)
				{
					case Event.MOUSE_OVER:
						this.img_over.visible = true;
						this.btn_delete.visible = true;
					break;

					case Event.MOUSE_OUT:
						this.img_over.visible = false;
						this.btn_delete.visible = false;
					break;

					case Event.CLICK:
						EventManager.getInstance().event(EventType.VARIABLE_DETAIL, [this.data]);
					break;
				}
			}
		}

		private onDeleteHandler(evt:Event):void
		{
			if(evt.currentTarget == this.btn_delete)
			{
				let graph:Graph = GraphManager.getInstance().getCurrent();
				if(!graph)
				{
					console.error("error: the current graph is null when delete variable");
				}
				else
				{
					graph.removeVariable(this.data);
					managers.EventManager.getInstance().event(core.EventType.HIDE_DETAIL);
				}

				evt.stopPropagation();
			}
		}

		private update():void
		{
			if(!this.data)
				return;

			this.txt_name.text = this.data.getName();
		}
	}
}