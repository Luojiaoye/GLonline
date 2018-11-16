/**
* 数据描述
* @author confiner
*/
var template;
(function (template) {
    var Datum = model.Datum;
    var DatumType = core.DatumType;
    class DatumTemplate {
        constructor(config) {
            this.config = config;
            this.parse();
        }
        parse() {
            for (let prop in this.config) {
                this.type = String(prop);
                this.value = this.config[prop];
                break;
            }
        }
        // 创建datum数据
        createDatum() {
            let datum = new Datum();
            switch (this.type) {
                case "boolean":
                    datum.setType(DatumType.Boolean);
                    break;
                case "int":
                    datum.setType(DatumType.Int);
                    break;
                case "number":
                    datum.setType(DatumType.Number);
                    break;
                case "vector3":
                    datum.setType(DatumType.Vector3);
                    break;
                case "string":
                    datum.setType(DatumType.String);
                    break;
                case "userid":
                    datum.setType(DatumType.UserId);
                    break;
            }
            let isLock = String(this.value) == Datum.LOCK;
            if (isLock)
                datum.setValue(Datum.LOCK);
            else
                datum.setValue(this.value);
            return datum;
        }
    }
    template.DatumTemplate = DatumTemplate;
})(template || (template = {}));
//# sourceMappingURL=DatumTemplate.js.map