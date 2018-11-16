/**
* 序列化接口
* @author confiner
*/
module core
{
	export interface ISerializeable
	{
		// 反序列化
		deserialize(obj:Object):void;

		// 序列化
		serialize():Object;
	}
}