/**
* @desc 登陸界面
* @author confiner
*/
var ui;
(function (ui) {
    var ServerManager = managers.ServerManager;
    var Event = Laya.Event;
    var EventManager = managers.EventManager;
    class LoginView extends ui.Editor.LoginViewUI {
        constructor() {
            super();
            this.init();
        }
        init() {
            this.x = (Laya.stage.width - this.width) >> 1;
            this.y = (Laya.stage.height - this.height) >> 1;
            this.btn_login.on(Event.CLICK, this, this.onLoginHandler);
            EventManager.getInstance().on(ServerManager.CONNECT_SUCCESS, this, this.onConnectSuccess);
        }
        onConnectSuccess() {
            let mainWindow = new ui.MainWindow();
            Laya.stage.addChild(mainWindow);
            this.destroy();
        }
        onLoginHandler() {
            let url = this.inputIP.text.trim();
            //url = "172.16.1.100";
            ServerManager.getInstance().connect("ws://" + url + ":1788/Nodes");
        }
        destroy() {
            this.btn_login.off(Event.CLICK, this, this.onLoginHandler);
            super.destroy();
        }
    }
    ui.LoginView = LoginView;
})(ui || (ui = {}));
//# sourceMappingURL=LoginView.js.map