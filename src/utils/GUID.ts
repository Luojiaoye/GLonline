/**
* 全局唯一id
* @author confiner
*/
module utils
{

	export class GUID
	{
		private static seed:number = 0;

		public static guid():string
		{
			return (++GUID.seed).toString();
		}

		private constructor()
		{
		}
	}
}