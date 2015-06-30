///<reference path="../.d.ts"/>
"use strict";

import path = require("path");

export class AndroidProjectPropertiesManager implements IAndroidProjectPropertiesManager {
	private static LIBRARY_REFERENCE_KEY_PREFIX = "android.library.reference.";
	
	private _editor: IPropertiesParserEditor = null;
	private filePath: string = null;
	private projectReferences: ILibRef[];
	private dirty = false;
	
	constructor(private $propertiesParser: IPropertiesParser,
		private $fs: IFileSystem,
		directoryPath: string) {
			this.filePath = path.join(directoryPath, "project.properties");
	}
	
	public addToPropertyList(key: string, value: string): IFuture<void> {
		return (() => {
			let editor = this.createEditor().wait();
			let i = 1;
    		while (editor.get(this.buildKeyName(key, i))) {
        		i++;
			}
			
			editor.set(this.buildKeyName(key, i), value);
			this.$propertiesParser.saveEditor().wait();
			this.dirty = true;
		}).future<void>()();
	}
	
	public removeFromPropertyList(key: string, value: string): IFuture<void> {
		return (() => {
			let editor = this.createEditor().wait();
			let valueLowerCase = value.toLowerCase();
			let i = 1;
		    let currentValue: any;
		    while (currentValue = editor.get(this.buildKeyName(key, i))) {
		        if (currentValue.toLowerCase() === valueLowerCase) {
		            while (currentValue = editor.get(this.buildKeyName(key, i+1))) {
		                editor.set(this.buildKeyName(key, i), currentValue); 
		                i++;
		            }
		            editor.set(this.buildKeyName(key, i));
		            break;
		        }
		        i++;
		    }
			this.$propertiesParser.saveEditor().wait();
			this.dirty = true;
		}).future<void>()();		
	}
	
	public getProjectReferences(): IFuture<ILibRef[]> {
		return (() => {
			if(!this.projectReferences || this.dirty) {
				let allProjectProperties = this.getAllProjectProperties().wait();
				this.projectReferences = _(_.keys(allProjectProperties))
					.filter(key => _.startsWith(key, "android.library.reference."))
					.map(key => this.createLibraryReference(key, allProjectProperties[key]))
					.value();
			}
			
			return this.projectReferences;
		}).future<ILibRef[]>()();
	}
	
	public addProjectReference(referencePath: string): IFuture<void> {
		return (() => {
			let references = this.getProjectReferences().wait();
			let libRefExists = _.any(references, r => path.normalize(r.path) === path.normalize(referencePath));
			if(!libRefExists) {
				this.addToPropertyList("android.library.reference", referencePath).wait();
			}
		}).future<void>()();
	}
	
	public removeProjectReference(referencePath: string): IFuture<void> {
		return (() => {
			let references = this.getProjectReferences().wait();
			let libRefExists = _.any(references, r => path.normalize(r.path) === path.normalize(referencePath));
			if(libRefExists) {
				this.removeFromPropertyList("android.library.reference", referencePath).wait();
			}
		}).future<void>()();
	}
	
	private createEditor(): IFuture<any> {
		return (() => {
			if(!this._editor) {
				this._editor = this.$propertiesParser.createEditor(this.filePath).wait();
			}
			
			return this._editor;
		}).future<any>()();
	}
	
	private buildKeyName(key: string, index: number): string {
		return `${key}.${index}`;
	}
	
	private getAllProjectProperties(): IFuture<IStringDictionary> {
		return this.$propertiesParser.read(this.filePath);
	}
	
	private createLibraryReference(referenceName: string, referencePath: string): ILibRef {
		return {
			idx: parseInt(referenceName.split("android.library.reference.")[1]),
			key: referenceName,
			path: referencePath,
			adjustedPath: path.join(path.dirname(this.filePath), referencePath)
		}
	}
}