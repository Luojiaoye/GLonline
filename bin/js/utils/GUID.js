/**
* 全局唯一id
* @author confiner
*/
var utils;
(function (utils) {
    class GUID {
        constructor() {
        }
        static guid() {
            return (++GUID.seed).toString();
        }
    }
    GUID.seed = 0;
    utils.GUID = GUID;
})(utils || (utils = {}));
//# sourceMappingURL=GUID.js.map