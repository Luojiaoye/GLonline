/**
* 文件信息
* @author confiner
*/
var model;
(function (model) {
    var GUID = utils.GUID;
    class FileInfo {
        constructor() {
            this.id = GUID.guid();
        }
        // 是否为目录
        isDir() {
            if (this.files)
                return true;
            return false;
        }
        // 创建文件
        createFile() {
            if (!this.isDir())
                return null;
            let file = new FileInfo();
            file.owner = this.id;
            this.files.push(file);
            return file;
        }
        // 创建目录
        createDir() {
            if (!this.isDir())
                return null;
            let dir = this.createFile();
            dir.files = new Array();
            return dir;
        }
        getFile(id) {
            if (this.id == id)
                return this;
            if (!this.files)
                return null;
            let target = null;
            for (let file of this.files) {
                target = file.getFile(id);
                if (target)
                    return target;
            }
            return null;
        }
        getMatchFiles(fileName) {
            let files = new Array();
            if (this.isDir()) {
                for (let file of this.files) {
                    files = files.concat(file.getMatchFiles(fileName));
                }
            }
            else {
                if (this.name.toUpperCase().indexOf(fileName.toUpperCase()) > -1) {
                    files.push(this);
                    return files;
                }
            }
            this.matchFiles = files;
            return files;
        }
    }
    model.FileInfo = FileInfo;
})(model || (model = {}));
//# sourceMappingURL=FileInfo.js.map