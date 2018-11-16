/**
* 变量界面
* @author confiner
*/
module ui
{
	import IData = core.IData;
	import Variable = model.Variable;
	import Event = Laya.Event;
	import EventManager = managers.EventManager;
	import EventType = core.EventType;

	export class VariableView extends Editor.Elements.VariableViewUI implements IData
	{
		data:Variable;

		setData(data:Variable):void
		{
			this.data = data;
			this.update();
			this.data.on(model.Model.UPDATE, this, this.update);
		}

		private update():void
		{
			if(!this.data)
				return;

			this.txt_varName.text = this.data.getName();
			this.btn_get.label = Variable.GET + this.data.getName();
			this.btn_set.label = Variable.SET + this.data.getName();
		}

		constructor()
		{
			super();

			this.initialize();
		}

		protected initialize():void
		{
			super.initialize();

			this.btn_get.on(Event.CLICK, this, this.onClickHandler);
			this.btn_set.on(Event.CLICK, this, this.onClickHandler);
		}

		public destroy(destroyChild?:boolean):void
		{
			super.destroy(destroyChild);
			this.btn_get.off(Event.CLICK, this, this.onClickHandler);
			this.btn_set.off(Event.CLICK, this, this.onClickHandler);
			if(this.parent)
			{
				this.parent.removeChild(this);
			}
		}

		private onClickHandler(evt:Event):void
		{
			if(evt.currentTarget == this.btn_get)
			{
				EventManager.getInstance().event(EventType.ADD_VARIABLE_GET, [this.data, this.x + this.width, this.y + this.height]);
			}
			else if(evt.currentTarget == this.btn_set)
			{
				EventManager.getInstance().event(EventType.ADD_VARIABLE_SET, [this.data, this.x + this.width, this.y + this.height]);
			}
			
			EventManager.getInstance().event(EventType.DELETE_VARIABLE_VIEW, [this.data]);
		}
	}
}