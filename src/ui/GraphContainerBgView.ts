/**
* 流图编辑窗口拖动滚动背景
* @author confiner
*/
module ui
{
	import Sprite = Laya.Sprite;
	import Texture = Laya.Texture;
	import Event = Laya.Event;

	export class GraphContainerBgView extends Sprite
	{
		private _bg:Sprite;
		private _texture:Texture;

		private static readonly _CNT:number = 3;

		constructor()
		{
			super();
		}

		private initialize():void
		{
			this.name = "EditorBg";
			this._texture = Laya.loader.getRes("editor/nodeViewBg.png");
			this._bg = new Sprite();
			this.addChild(this._bg);
			this.drawBg();
		}

		public drawBg():void
		{
			if(!this._texture)
			{
				console.error("error: background texture is null!");
				return;
			}

			this._bg.graphics.clear();
			let wCnt:number = GraphContainerBgView._CNT;
			let hCnt:number = GraphContainerBgView._CNT;
			for(let w:number = 0; w < wCnt; ++w)
			{
				for(let h:number = 0; h < hCnt; ++h)
				{
					this._bg.graphics.drawTexture(this._texture, w * this._texture.width, h * this._texture.height);
				}
			}

			this.size(GraphContainerBgView._CNT * this._texture.width, GraphContainerBgView._CNT * this._texture.height);
			this._bg.pivot(this.width >> 1, this.height >> 1).pos(this.width >> 1, this.height >> 1);
		}
	}
}