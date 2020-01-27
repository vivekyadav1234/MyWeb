import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class ShareDataService {

	// sections$:Observable<any>;
	// private sectionsSubject =  new Subject<any>();
	// public project : any;
	// public boq:any;
	sectionMethod: Observable<any>;
	projectMethod : Observable<any>;
	boqMethod : Observable<any>;
    private sectionMethodSubject = new BehaviorSubject([]);
    private projectMethodSubject = new BehaviorSubject("");
    private boqMethodSubject = new BehaviorSubject("");
	
	constructor(
	) {
		this.sectionMethod = this.sectionMethodSubject.asObservable();
		this.boqMethod = this.boqMethodSubject.asObservable();
		this.projectMethod= this.boqMethodSubject.asObservable();
	}

	secMethod(data) {
		for(var i=0;i<data.length;i++){
		this.sectionMethodSubject.getValue().push(data[i]);
		}
        this.sectionMethodSubject.next(this.sectionMethodSubject.getValue());

    }

    projMethod(data){
    	this.projectMethodSubject.next(data.project);
    	this.boqMethodSubject.next(data.boq);
    }

	// public getSection(): Array<any>  {
 //        return this.sections;
 //    }

 //    public setSection(sec):void {
 //    	this.sections = sec;
 //    }

 //    public getProject(): Array<any>  {
 //        return this.project;
 //    }

 //    public setProject(proj):void {
 //    	this.project = proj;
 //    }

 //    public getBoq(): Array<any>  {
 //        return this.boq;
 //    }

 //    public setBoq(boq):void {
 //    	this.boq = boq;
 //    }

     

}
