import { Component, EventEmitter, Input, OnInit, Output, NgZone, AfterViewInit} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../authentication/auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from '../../../services/loader.service';
import { SchedulerService } from '../scheduler.service';
import { DatePipe } from '@angular/common';
import { Project, IGanttOptions, Zooming, Task } from '../../../shared/gantt-chart/interfaces';
declare var $:any;
declare var gantt : any;
//declare var anychart:any

@Component({
  selector: 'app-createscheduler',
  templateUrl: './createscheduler.component.html',
  styleUrls: ['./createscheduler.component.css'],
  providers: [SchedulerService]
})
export class CreateschedulerComponent implements OnInit {

	project_id:number;
	project: Project;
	attachment_file: any;
	attachment_name: string;
	basefile: any;
	submitted = false;
	project_tasks : any[];
	task_id:number;
	erroralert = false;
  	successalert = false;
  	successMessage : string;
  	errorMessage: string;
	formattedProjectTasksObj : Project;
	startDateForGanttChart : Date;
	endDateForGanttChart : Date;
	options: IGanttOptions;
	constructor(
		private route:ActivatedRoute,
		private formbuilder: FormBuilder,
		private schedulerService:SchedulerService,
		private loaderService: LoaderService
	) {	 }

	
	addTaskForm = this.formbuilder.group({
		internal_name :new FormControl('',Validators.required),
		name: new FormControl('',Validators.required),
		percent_completion: new FormControl('',Validators.required),
		start_date: new FormControl(),
		end_date: new FormControl(),
		resource:new FormControl(),
		upstream_dependencies:new FormControl(),
		duration : new FormControl(),
		status: new FormControl()
	});

	editTaskForm = this.formbuilder.group({
		internal_name :new FormControl('',Validators.required),
		name: new FormControl('',Validators.required),
		percent_completion: new FormControl('',Validators.required),
		start_date: new FormControl(),
		end_date: new FormControl(),
		resource:new FormControl(),
		upstream_dependencies:new FormControl(),
		duration : new FormControl(),
		status: new FormControl()
	});

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
		this.project_id = params['project_id'];
		         
		});
		this.getTaskList();
	}

  	onChange(event) {
       this.attachment_file = event.srcElement.files[0];
        var fileReader = new FileReader();
          //
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.basefile = base64.result;
             //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
           };
        fileReader.readAsDataURL(this.attachment_file);
  	}

  	onSubmit(data) {
  		this.loaderService.display(true);
	    this.submitted = true;
	    this.schedulerService.uploadCatalogueExcel(this.project_id,this.basefile)
	    .subscribe(
	        result => {
	        	this.getTaskList();
	        	this.loaderService.display(false);
	        	this.successalert = true;
         		this.successMessage = 'Uploaded successfully! ';
		        setTimeout(function() {
		              this.successalert = false;
		          }.bind(this), 15000);
	        },
	        error => {
	        	this.loaderService.display(false);
	        	this.erroralert = true;
         		this.errorMessage = JSON.parse(error['_body']).message;
		        setTimeout(function() {
		              this.erroralert = false;
		          }.bind(this), 15000);
	          //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
	          
	        }
	    );
 	}

 	deletTask(taskid){
 		this.loaderService.display(true);
 		this.schedulerService.deleteTask(this.project_id,taskid).subscribe(
 			res => {
 				this.project_tasks = [];
 				this.getTaskList();
 				this.loaderService.display(false);
 				this.successalert = true;
         		this.successMessage = 'Deleted successfully! ';
		        setTimeout(function() {
		              this.successalert = false;
		          }.bind(this), 15000);
 				//$.notify('Deleted Successfully');
 			},
 			err => {
 				
 				this.loaderService.display(false);
 				this.erroralert = true;
         		this.errorMessage = JSON.parse(err['_body']).message;
		        setTimeout(function() {
		              this.erroralert = false;
		          }.bind(this), 15000);
 			}
 		);
 	}

 	getTaskList() {
	 	this.schedulerService.getProjectTasksForExcel(this.project_id).subscribe(
	  		res => {
	  			Object.keys(res).map((key)=>{ this.project_tasks = res[key]; })
  				this.project = {
			        'id': <string>this.project_tasks[0]['project'].id,
			        'name': <string>this.project_tasks[0]['project'].name,
			        'startDate': this.project_tasks[0]['project'].created_at,
			        'tasks' : []
  			    }
  			    this.startDateForGanttChart = new Date(this.project_tasks[0].actual_start);
  			    this.endDateForGanttChart = new Date(this.project_tasks[0].actual_end);
  			    for(var index = 0; index < this.project_tasks.length; index++){
  			    	if(this.startDateForGanttChart >= new Date(this.project_tasks[index].actual_start)) {
  			    		this.startDateForGanttChart = new Date(this.project_tasks[index].actual_start);  			    	}
  			    	if(this.endDateForGanttChart < new Date(this.project_tasks[index].actual_end)) {
  			    		this.endDateForGanttChart = new Date(this.project_tasks[index].actual_end);
  			    	}
	  				var obj = {
	  					'id' : <string>this.project_tasks[index].id,
	  					'treePath' : <string>this.project_tasks[index].name,
	  					'parentId' : this.project_tasks[index].parentId,
	  					'name' : <string>this.project_tasks[index].internal_name,
	  					'resource' : <string>this.project_tasks[index].resource,
	  					'percentComplete' : this.project_tasks[index].percentComplete,
	  					'start' : new Date(this.project_tasks[index].actual_start),
	  					'end' : new Date(this.project_tasks[index].actual_end),
	  					'status' : this.project_tasks[index].status
	  				}
	  				this.project.tasks.push(obj);
	  			}
	  			this.options = {
       				 scale: {
           				start: new Date(this.startDateForGanttChart.getFullYear(),this.startDateForGanttChart.getMonth(),this.startDateForGanttChart.getDate()),
            			end: new Date(this.endDateForGanttChart.getFullYear(), this.endDateForGanttChart.getMonth(), this.endDateForGanttChart.getDate())
        			},
        			zooming: Zooming[Zooming.days]
   				};
	  			//project: Project = this.formattedProjectTasksObj;
	  			//this.ganttChart();
	  		},
	  		err =>{
	  			
	  		}
	  	);
 	}

 	numberCheck(e) {
	    if(!((e.keyCode > 95 && e.keyCode < 106)
	      || (e.keyCode > 47 && e.keyCode < 58) 
	      || e.keyCode == 8 || e.keyCode == 39 || e.keyCode == 37|| e.keyCode == 38 || e.keyCode == 40
	      || e.keyCode == 17 || e.keyCode == 91 || e.keyCode == 86 || e.keyCode == 67)) {
	        return false;
	    }
	}

	addTaskDetails(data) {
		$('#addTaskModal').modal('hide');
		this.loaderService.display(true);
		this.schedulerService.addTask(this.project_id,data).subscribe(
			res => {
				this.getTaskList();
				this.loaderService.display(false);
				this.successalert = true;
         		this.successMessage = 'Task added successfully! ';
		        setTimeout(function() {
		              this.successalert = false;
		          }.bind(this), 15000);
				//$.notify('Added Successfully');
			},
			err => {
				this.loaderService.display(false);
				this.erroralert = true;
         		this.errorMessage = JSON.parse(err['_body']).message;
		        setTimeout(function() {
		              this.erroralert = false;
		          }.bind(this), 15000);
			}
		);
	}

	editTaskDetails(data) {
		$('#editTaskModal').modal('hide');
		this.loaderService.display(true);
		this.schedulerService.editTask(this.project_id,this.task_id,data).subscribe(
			res => {
				this.getTaskList();
				this.loaderService.display(false);
				this.successalert = true;
         		this.successMessage = 'Task updated successfully! ';
		        setTimeout(function() {
		              this.successalert = false;
		          }.bind(this), 15000);
				//$.notify(' Updated Successfully');
			},
			err => {
				this.loaderService.display(false);
				
				this.erroralert = true;
         		this.errorMessage = JSON.parse(err['_body']).message;
		        setTimeout(function() {
		              this.erroralert = false;
		          }.bind(this), 15000);
			}
		);
	}

	getTaskDetailWithId(taskid) {
		this.schedulerService.getTaskDetail(this.project_id,taskid).subscribe(
			res => {
				this.task_id = res.project_task.id;
				this.editTaskForm.controls['internal_name'].setValue(res.project_task.internal_name);
				this.editTaskForm.controls['name'].setValue(res.project_task.name);
				res.project_task.end = new Date(res.project_task.end);
				res.project_task.end = res.project_task.end.getFullYear()+'-'+(res.project_task.end.getMonth()+1)+'-'+res.project_task.end.getDate();
				res.project_task.start = new Date(res.project_task.start);
				res.project_task.start = res.project_task.start.getFullYear()+'-'+(res.project_task.start.getMonth()+1)+'-'+res.project_task.start.getDate();
				var arr = res.project_task.end.split("-");
			    if(arr[2] < 10) {
			        arr[2] = '0'+arr[2];
			    }
			    if(arr[1] < 10) {
			        arr[1] = '0'+arr[1];
			    }
			    res.project_task.end = arr[0]+'-'+arr[1]+'-'+arr[2];
			    arr = res.project_task.start.split("-");
			    if(arr[2] < 10) {
			        arr[2] = '0'+arr[2];
			    }
			    if(arr[1] < 10) {
			        arr[1] = '0'+arr[1];
			    }
			    res.project_task.start = arr[0]+'-'+arr[1]+'-'+arr[2];
				this.editTaskForm.controls['end_date'].setValue(res.project_task.end);
				this.editTaskForm.controls['percent_completion'].setValue(res.project_task.percentComplete);
				this.editTaskForm.controls['start_date'].setValue(res.project_task.start);
				this.editTaskForm.controls['resource'].setValue(res.project_task.resource);
				this.editTaskForm.controls['duration'].setValue(res.project_task.duration);
				var upstream_dependencies_str = '' ;
				for(var i=0;i<res.project_task.upstream_dependencies.length;i++) {
					upstream_dependencies_str = upstream_dependencies_str+res.project_task.upstream_dependencies[i].internal_name+',';
				}
				this.editTaskForm.controls['upstream_dependencies'].setValue(upstream_dependencies_str);
			},
			err => {
				
			}
		);
	}

	// options: IGanttOptions = {
 //        scale: {
 //            start: new Date(this.startDateForGanttChart.getFullYear(),this.startDateForGanttChart.getMonth()+1,this.startDateForGanttChart.getDate()),
 //            end: new Date(this.endDateForGanttChart.getFullYear(), this.endDateForGanttChart.getMonth()+1, this.endDateForGanttChart.getDate())
 //        },
 //        zooming: Zooming[Zooming.days]
 //    };

	// project: Project = {
 //        'id': this.project_tasks[0]['project'].id,
 //        'name': this.project_tasks[0]['project'].name,
 //        'startDate': new Date("2017-02-27T08:32:09.6972999Z"),
 //        'tasks': [
 //            {
 //                'id': 'ea2a8d86-1d4b-4807-844d-d5417fcf618d',
 //                'treePath': 'parent 1',
 //                'parentId': 'ea2a8d86-1d4b-4807-844d-d5417fcf618d',
 //                'name': 'parent 1',
 //                'resource': 'res1',
 //                'start': new Date('2017-01-01T00:00:00.0Z'),
 //                'end': new Date('2017-01-03T00:00:00.0Z'),
 //                'percentComplete': 100,
 //                'status': 'Completed'
 //            },
 //            {
 //                'id': 'dd755f20-360a-451f-b200-b83b89a35ad1',
 //                'treePath': 'Cras sollicitudin egestas velit sit amet aliquam',
 //                'parentId': 'dd755f20-360a-451f-b200-b83b89a35ad1',
 //                'name': 'Cras sollicitudin egestas velit sit amet aliquam',
 //                'resource': 'res2',
 //                'start': new Date('2017-01-05T00:00:00.0Z'),
 //                'end': new Date('2017-01-06T00:00:00.0Z'),
 //                'percentComplete': 0
 //            }]
 //    };

    groupData(array: any[], f: any): any[] {
        var groups = {};
        array.forEach((o: any) => {
            var group = JSON.stringify(f(o));

            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map((group: any) => {
            return groups[group];
        });
    }

    createTask(element: any) {
        var selectedStatus = element.options[element.selectedIndex].value;

        var parentTask = {
            'id': 'parent_task_' + Math.random(),
            'parentId': 'parent_task',
            'treePath': 'parent_task',
            'name': 'parent_task',
            'percentComplete': 0,
            'start': new Date('2017-01-01T03:30:00.0Z'),
            'end': new Date('2017-01-01T12:45:00.0Z'),
            'status': selectedStatus
        }
        this.project.tasks.push(parentTask);

        var childTask = {
            'id': 'child_task_' + Math.random(),
            'parentId': 'ea2a8d86-1d4b-4807-844d-d5417fcf618d',
            'treePath': 'parent 1/child3',
            'name': 'child3',
            'percentComplete': 0,
            'start': new Date('2017-01-01T03:30:00.0Z'),
            'end': new Date('2017-01-01T12:45:00.0Z'),
            'status': selectedStatus
        }
        this.project.tasks.push(childTask);

    }

    updateTasks() {
        for (var i = 0; i < this.project.tasks.length; i++) {
            let task = this.project.tasks[i];

            let progress = setInterval(function () {
                if (task.percentComplete === 100) {
                    task.status = "Completed";
                    clearInterval(progress);
                } else {
                    if (task.percentComplete === 25) {
                        task.status = "Warning";
                    } else if (task.percentComplete === 50) {
                        task.status = "Error";
                    } else if (task.percentComplete === 75) {
                        task.status = "Information";
                    }

                    task.percentComplete += 1;
                }
            }, 200);
        }
    }

    loadBigDataSet() {
        var tasks = [];

        for (var i = 11; i < 1000; i++) {
            var task = {
                id: `parent${i}`,
                name: 'task testing',
                percentComplete: 0,
                start: new Date(),
                end: new Date(),
                status: ''
            }

            tasks.push(task);
        }

        this.project.tasks.push(...tasks);
    }

    gridRowClicked(event) {
        
    }

}
