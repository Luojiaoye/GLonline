/**
* name 程序入口类
*/
var LoginView = ui.LoginView;
var WebGL = Laya.WebGL;
var Handler = Laya.Handler;
var ByteArray = Laya.Byte;
var Dictionary = Laya.Dictionary;
var Stage = Laya.Stage;
var Editor = ui.Editor;
var Socket = Laya.Socket;
var Byte = Laya.Byte;
var Sprite = Laya.Sprite;
var NodeTemplate = template.NodeTemplate;
const RED_FILTER = new Laya.ColorFilter([
    1, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 1, 0,
]);
window.onresize = function () {
    Laya.stage.width = window.innerWidth;
    Laya.stage.height = window.innerHeight;
};
//程序入口
Config.isAntialias = true;
Laya.init(window.innerWidth, window.innerHeight, WebGL);
Laya.stage.scaleMode = Stage.SCALE_NOSCALE;
//激活资源版本控制
Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);
function beginLoad() {
    Laya.stage.bgColor = "#242838";
    Laya.loader.load(["res/atlas/editor.atlas"], Handler.create(null, onLoaded));
}
function onLoaded() {
    // let arr:Array<Sprite> = new Array<Sprite>();
    // let endPoint:Sprite = null;
    // for(let i:number = 0; i < 3; ++i)
    // {
    // 	let ep:Sprite = new Sprite();
    // 	ep.name = i.toString();
    // 	arr.push(ep);
    // 	if(i == 2)
    // 		endPoint = ep;
    // }
    // let arr1:Array<Sprite> = new Array<Sprite>();
    // for(let i:number = 0; i < 2; ++i)
    // {
    // 	let ep:Sprite = new Sprite();
    // 	ep.name = (10 + i).toString();
    // 	arr1.push(ep);
    // }
    // let other:Array<Sprite> = arr.concat(arr1);
    // endPoint.name = "some";
    // console.log(other.length);
    // Laya.Stat.show(0,0);
    let loginView = new LoginView();
    Laya.stage.addChild(loginView);
    //EventManager.getInstance().Test();
    // let container:Laya.Sprite = new Laya.Sprite();
    // let sp:Laya.Sprite = new Laya.Sprite();
    // sp.x = 100;
    // sp.y = 100;
    // sp.width = 100;
    // sp.height = 200;
    // sp.graphics.drawRect(50, 50, sp.width, sp.height, "#ff0000");
    // sp.on(Laya.Event.CLICK, null, onClick);
    // container.addChild(sp);
    // Laya.stage.addChild(container);
    // drawInteractiveLine(container, 300, 800, 600, 800, "#00ff00", 3);
    //Laya.stage.on(Laya.Event.KEY_DOWN, null, onTraceShape);
}
function onTraceShape(evt) {
    if (evt.keyCode == 192) {
        for (let i = 0; i < Laya.stage.numChildren; ++i) {
            // let child:Laya.Node = Laya.stage.getChildAt(i);
            // if(typeof(child) == "Laya.Sprite")
            // {
            // }
            //if(child.numChildren)
        }
    }
}
function createFilters() {
    let colorMatrix = [
        1, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 1, 0,
    ];
    let red_filter = new Laya.ColorFilter(colorMatrix);
    return [red_filter];
}
function drawInteractiveLine(container, fromX, fromY, toX, toY, lineColor, lineWidth) {
    // container.graphics.drawLine(fromX, fromY, toX, toY, lineColor, lineWidth);
    // let sp:Sprite = new Sprite();
    // let length:number = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    // let angle:number = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;
    // sp.width = length;
    // sp.height = lineWidth * 2.2;
    // sp.graphics.drawRect(0, 0, sp.width, sp.height, "#ff0000");
    // sp.x = fromX;
    // sp.y = fromY - 5;
    // //sp.pivot(0, 0);
    // sp.rotation = angle;
    // sp.on(Laya.Event.CLICK, null, onClick);
    // container.addChild(sp);
    // container.on(Laya.Event.KEY_DOWN, null, onTestKeyDown);
}
//# sourceMappingURL=Main.js.map