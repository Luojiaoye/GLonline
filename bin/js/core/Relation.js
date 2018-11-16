/**
* @desc 關係數據
* @author confiner
*/
var core;
(function (core) {
    class Relation {
        constructor() {
            this.inputDataType = null;
            this.outputDataType = null;
        }
        equals(other) {
            if (this.inputName == other.inputName &&
                this.inputNodeId == other.inputNodeId &&
                this.inputType == other.inputType &&
                this.inputDataType == other.inputDataType &&
                this.outputDataType == other.outputDataType &&
                this.outputName == other.outputName &&
                this.outputNodeId == other.outputNodeId &&
                this.outputType == other.outputType) {
                return true;
            }
            return false;
        }
    }
    core.Relation = Relation;
})(core || (core = {}));
//# sourceMappingURL=Relation.js.map