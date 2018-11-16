/**
* 插槽描述
* @author confiner
*/
var template;
(function (template_1) {
    var Slot = model.Slot;
    class SlotTemplate {
        constructor(config) {
            this.config = config;
            this.parse();
        }
        parse() {
            for (let prop in this.config) {
                this.name = String(prop);
                this.datumConfig = this.config[prop];
                break;
            }
        }
        // 创建插槽
        createSlot() {
            let slot = new Slot();
            slot.setName(this.name);
            let template = new template_1.DatumTemplate(this.datumConfig);
            slot.setData(template.createDatum());
            return slot;
        }
    }
    template_1.SlotTemplate = SlotTemplate;
})(template || (template = {}));
//# sourceMappingURL=SlotTemplate.js.map