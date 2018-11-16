/**
* 事件管理器
*/
var managers;
(function (managers) {
    class EventManager extends Laya.EventDispatcher {
        constructor() {
            super();
        }
        // 获取单例接口
        static getInstance() {
            if (!EventManager._inst) {
                EventManager._inst = new EventManager();
            }
            return EventManager._inst;
        }
    }
    managers.EventManager = EventManager;
})(managers || (managers = {}));
//# sourceMappingURL=EventManager.js.map