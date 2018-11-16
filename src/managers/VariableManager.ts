/**
* 变量管理器
* @author confiner
*/
module managers
{
	export class VariableManager
	{
		private static _inst:VariableManager; //单例对象

		private _variables:Array<model.Variable>;

		// 解析注册的变量
		public parseVariables(varTemplates:Array<Object>):void
		{
			for(let i:number = 0; i < varTemplates.length; ++i)
			{
				this.createVariable(varTemplates[i]);
			}
			EventManager.getInstance().event(core.EventType.VARIABLES_READY);
		}

		public getVariables():Array<model.Variable>
		{
			return this._variables;
		}

		private createVariable(cfg:Object):void
		{
			let variable:model.Variable = new model.Variable();
			variable.setName(cfg["name"]);
			variable.setType(cfg["type"]);
			variable.setValue(cfg["defaultValue"]);
			this._variables.push(variable);
		}

		constructor()
		{
			this._variables = new Array<model.Variable>();
		}

		public static getInstance():VariableManager
		{
			if(!VariableManager._inst)
			{
				VariableManager._inst = new VariableManager();
			}

			return VariableManager._inst;
		}
	}
}