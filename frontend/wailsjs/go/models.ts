export namespace main {
	
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

