/**
* model数据
* @author confiner 
*/
module model
{
	export class Model extends emitter.EventEmitter implements core.IDispose, core.IUpdate
	{
		public static readonly UPDATE:string = "update";

		protected invalid:boolean = false;

		constructor()
		{
			super();
			//this.on(Model.UPDATE, this, this.updateInvalidStatus);
		}

		public copy(other:any):void
		{
			
		}

		//延时刷新
		protected delayUpdate():void{
			Laya.timer.frameOnce(1, this, this.change);
		}

		private change():void{
			if(this.invalid)
				this.event(Model.UPDATE, this);
		}

		protected updateInvalidStatus(data?:any):void
		{
			this.invalid = true;
		}

		public clone():any
		{
			return null;
		}

		public equals(other:any):boolean
		{
			return false;
		}

		public dispose():void
		{
			//this.off(Model.UPDATE, this, this.updateInvalidStatus);
			this.offAll();
			this.invalid = false;
		}

		public update():void
		{
			
		}
	}
}