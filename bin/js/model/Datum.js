/**
* 数据类型
* @author config
*/
var model;
(function (model) {
    //import DatumType = core.DatumType;
    class Datum extends model.Model {
        constructor() {
            super();
        }
        getType() {
            return this._type;
        }
        getValue() {
            return this._value;
        }
        dispose() {
            super.dispose();
            this.offAll();
            this._type = null;
            this._value = null;
        }
        clone() {
            let other = new Datum();
            other._type = this._type;
            other._value = this.getClone();
            return other;
        }
        getClone() {
            let other = null;
            switch (this._type) {
                case core.DatumType.Int:
                case core.DatumType.Boolean:
                case core.DatumType.Number:
                case core.DatumType.String:
                    other = this._value;
                    break;
                case core.DatumType.Vector3:
                    other = new Array();
                    let arr = this._value;
                    for (let i = 0; i < arr.length; ++i) {
                        other.push(arr[i]);
                    }
                    break;
                case core.DatumType.UserId:
                    other = this._value;
                    break;
            }
            return other;
        }
        copy(other) {
            let cloneObj = other.clone();
            this._type = other._type;
            this._value = cloneObj._value;
            // this.setValue(other.value);
        }
        equals(other) {
            if (!other)
                return false;
            if (this._type == other._type && this._value == other._value)
                return true;
            return false;
        }
        update() {
            if (this.invalid)
                this.event(model.Model.UPDATE, [this]);
            this.invalid = false;
        }
        setType(type) {
            if (this._type == type)
                return;
            this._type = type;
            this.invalid = true;
            //this.delayUpdate();
        }
        writeTo(obj) {
            obj[this._type.toString()] = this._value;
        }
        setDefaultValue() {
            switch (this._type) {
                case core.DatumType.Boolean:
                    this._value = false;
                    break;
                case core.DatumType.Int:
                case core.DatumType.Number:
                    this._value = 0;
                    break;
                case core.DatumType.String:
                    this._value = "";
                    break;
                case core.DatumType.Vector3:
                    this._value = [0, 0, 0];
                    break;
                case core.DatumType.UserId:
                    this._value = 0;
                    break;
            }
        }
        setValue(value) {
            switch (this._type) {
                case core.DatumType.Boolean:
                    this._value = this.toBoolean(value);
                    break;
                case core.DatumType.Int:
                case core.DatumType.Number:
                    this._value = this.toNumber(value);
                    break;
                case core.DatumType.String:
                    this._value = String(value);
                    break;
                case core.DatumType.Vector3:
                    this._value = this.toVector3(value);
                    break;
                case core.DatumType.UserId:
                    this._value = 0;
                    break;
            }
            this.invalid = true;
        }
        toBoolean(value) {
            if (value == "false")
                return false;
            else if (value == "true")
                return true;
            return Boolean(value);
        }
        toNumber(value) {
            return Number(value);
        }
        toEntityId(value) {
            return 0.0;
        }
        toVector3(value) {
            let vec3 = [Number(value[0]), Number(value[1]), Number(value[2])];
            return value;
        }
        // 是否为锁定值
        isLock() {
            return this._value == Datum.LOCK;
        }
        // 解析字符串
        parseString(str) {
            switch (this._type) {
                case core.DatumType.Boolean:
                    this.setValue(this.toBoolean(str));
                    break;
                case core.DatumType.Int:
                case core.DatumType.Number:
                    this.setValue(this.toNumber(str));
                    break;
                case core.DatumType.String:
                    this.setValue(String(str));
                    break;
                case core.DatumType.Vector3:
                    let strArray = str.split(",");
                    let numArray = [Number(strArray[0]), Number(strArray[1]), Number(strArray[2])];
                    this.setValue(numArray);
                    break;
                case core.DatumType.UserId:
                    this.setValue(0);
                    break;
            }
        }
        // 输出字符串型值
        toString() {
            if (this._type == core.DatumType.Int)
                return (Number(this._value)).toString();
            let str = this._value.toString();
            if (this._type == core.DatumType.Vector3) {
                str = this._value.join(",");
            }
            else if (this._type == core.DatumType.UserId) {
                str = "Self";
            }
            return str;
        }
    }
    Datum.LOCK = "lock";
    model.Datum = Datum;
})(model || (model = {}));
//# sourceMappingURL=Datum.js.map