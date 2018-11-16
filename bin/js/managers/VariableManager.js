/**
* 变量管理器
* @author confiner
*/
var managers;
(function (managers) {
    class VariableManager {
        constructor() {
            this._variables = new Array();
        }
        // 解析注册的变量
        parseVariables(varTemplates) {
            for (let i = 0; i < varTemplates.length; ++i) {
                this.createVariable(varTemplates[i]);
            }
            managers.EventManager.getInstance().event(core.EventType.VARIABLES_READY);
        }
        getVariables() {
            return this._variables;
        }
        createVariable(cfg) {
            let variable = new model.Variable();
            variable.setName(cfg["name"]);
            variable.setType(cfg["type"]);
            variable.setValue(cfg["defaultValue"]);
            this._variables.push(variable);
        }
        static getInstance() {
            if (!VariableManager._inst) {
                VariableManager._inst = new VariableManager();
            }
            return VariableManager._inst;
        }
    }
    managers.VariableManager = VariableManager;
})(managers || (managers = {}));
//# sourceMappingURL=VariableManager.js.map