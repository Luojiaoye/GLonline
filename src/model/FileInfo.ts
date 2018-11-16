/**
* 文件信息
* @author confiner
*/
module model
{
	import GUID = utils.GUID;

	export class FileInfo
	{
		public name:string;	// 文件名称
		public files:Array<FileInfo>;	// 文件列表
		public matchFiles:Array<FileInfo>;	// 匹配列表
		public id:string;	// 文件id
		public owner:string;	// 所属目录id

		constructor()
		{
			this.id = GUID.guid();
		}

		// 是否为目录
		public isDir():boolean
		{
			if(this.files)
				return true;

			return false;
		}

		// 创建文件
		public createFile():FileInfo
		{
			if(!this.isDir())
				return null;

			let file:FileInfo = new FileInfo();
			file.owner = this.id;
			this.files.push(file);
			return file;
		}

		// 创建目录
		public createDir():FileInfo
		{
			if(!this.isDir())
				return null;

			let dir:FileInfo = this.createFile();
			dir.files = new Array<FileInfo>();
			return dir;
		}

		public getFile(id:string):FileInfo
		{
			if(this.id == id)
				return this;
			
			if(!this.files)
				return null;
			
			let target:FileInfo = null;
			for(let file of this.files)
			{
				target = file.getFile(id);
				if(target)
					return target;
			}

			return null;
		}

		public getMatchFiles(fileName:string):Array<FileInfo>
		{
			let files:Array<FileInfo> = new Array<FileInfo>();
			if(this.isDir())
			{
				for(let file of this.files)
				{
					files = files.concat(file.getMatchFiles(fileName));
				}
			}
			else
			{
				if(this.name.toUpperCase().indexOf(fileName.toUpperCase()) > -1)
				{
					files.push(this);
					return files;
				}
			}

			this.matchFiles = files;
			return files;
		}
	}
}