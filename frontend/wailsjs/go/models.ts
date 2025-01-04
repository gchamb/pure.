export namespace main {
	
	export class FileDetails {
	    name: string;
	    size: number;
	    isDir: boolean;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new FileDetails(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.size = source["size"];
	        this.isDir = source["isDir"];
	        this.path = source["path"];
	    }
	}
	export class LoadDirs {
	    Dirs: string[];
	    currentPath: string;
	
	    static createFrom(source: any = {}) {
	        return new LoadDirs(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Dirs = source["Dirs"];
	        this.currentPath = source["currentPath"];
	    }
	}

}

