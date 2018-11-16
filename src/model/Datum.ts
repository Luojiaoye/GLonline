/**
* 数据类型
* @author config
*/
module model
{
	//import DatumType = core.DatumType;
	export class Datum extends Model
	{
		public static readonly LOCK:string = "lock";

		private _type:core.DatumType;	// 数据类型
		private _value:any;		// 数据值

		constructor()
		{
			super();
		}

		public getType():core.DatumType
		{
			return this._type;
		}

		public getValue():Object
		{
			return this._value;
		}

		public dispose():void
		{
			super.dispose();
			this.offAll();
			this._type = null;
			this._value = null;
		}

		public clone():Datum
		{
			let other:Datum = new Datum();
			other._type = this._type;
			other._value = this.getClone();
			return other;
		}

		private getClone():any
		{
			let other:any = null;
			switch(this._type)
			{
				case core.DatumType.Int:
				case core.DatumType.Boolean:
				case core.DatumType.Number:
				case core.DatumType.String:
					other = this._value;
				break;
				case core.DatumType.Vector3:
					other = new Array<number>();
					let arr:Array<number> = this._value as Array<number>
					for(let i:number = 0; i < arr.length; ++i)
					{
						other.push(arr[i]);
					}
				break;
				case core.DatumType.UserId:
					other = this._value;
				break;
			}

			return other;
		}

		public copy(other:Datum):void
		{
			let cloneObj:Datum = other.clone();
			this._type = other._type;
			this._value = cloneObj._value;
			// this.setValue(other.value);
		}

		public equals(other:Datum):boolean
		{
			if(!other)
				return false;

			if(this._type == other._type && this._value == other._value)
				return true;
			
			return false;
		}

		public update():void
		{
			if(this.invalid)
				this.event(Model.UPDATE, [this]);
			
			this.invalid = false;
		}

		public setType(type:core.DatumType):void
		{
			if(this._type == type)
				return;

			this._type = type;
			this.invalid = true;
			//this.delayUpdate();
		}

		public writeTo(obj:Object):void
		{
			obj[this._type.toString()] = this._value;
		}

		public setDefaultValue():void
		{
			switch(this._type)
			{
				case core.DatumType.Boolean:
					this._value = false;
				break;
				case core.DatumType.Int:
				case core.DatumType.Number:
					this._value = 0;
				break;
				case core.DatumType.String:
					this._value = "";
				break;
				case core.DatumType.Vector3:
					this._value = [0, 0, 0];
				break;
				case core.DatumType.UserId:
					this._value = 0;
				break;
			}
		}

		public setValue(value:any):void
		{
			switch(this._type)
			{
				case core.DatumType.Boolean:
					this._value = this.toBoolean(value);
				break;
				case core.DatumType.Int:
				case core.DatumType.Number:
					this._value = this.toNumber(value);
				break;
				case core.DatumType.String:
					this._value = String(value);
				break;
				case core.DatumType.Vector3:
					this._value = this.toVector3(value);
				break;
				case core.DatumType.UserId:
					this._value = 0;
				break;
			}

			this.invalid = true;
		}

		private toBoolean(value:any):boolean
		{
			if(value == "false")
				return false;
			else if(value == "true")
				return true;
			return Boolean(value);
		}

		private toNumber(value:any):number
		{
			return Number(value);
		}

		private toEntityId(value:any):number
		{
			return 0.0;
		}

		private toVector3(value:any):Array<number>
		{
			let vec3:Array<number> = [Number(value[0]), Number(value[1]), Number(value[2])];
			return value as Array<number>;
		}

		// 是否为锁定值
		public isLock():boolean
		{
			return this._value == Datum.LOCK;
		}

		// 解析字符串
		public parseString(str:string):void
		{
			switch(this._type)
			{
				case core.DatumType.Boolean:
					this.setValue(this.toBoolean(str));
				break;
				case core.DatumType.Int:
				case core.DatumType.Number:
					this.setValue(this.toNumber(str));
				break;
				case core.DatumType.String:
					this.setValue(String(str));
				break;
				case core.DatumType.Vector3:
					let strArray:Array<string> = str.split(",");
					let numArray:number[] = [Number(strArray[0]), Number(strArray[1]), Number(strArray[2])];
					this.setValue(numArray);
				break;
				case core.DatumType.UserId:
					this.setValue(0);
				break;
			}
		}

		// 输出字符串型值
		public toString():string
		{
			if(this._type == core.DatumType.Int)
				return (Number(this._value)).toString();

			let str:string = this._value.toString();
			if(this._type == core.DatumType.Vector3)
			{
				str = (this._value as Array<number>).join(",");
			}
			else if(this._type == core.DatumType.UserId)
			{
				str = "Self";
			}

			return str;
		}
	}
}