import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../project/project/project.service';
import { UserDetailsService } from '../../../services/user-details.service';
import { Observable } from 'rxjs';
import { Project } from '../../project/project/project';
declare var Layout:any;

@Component({
  selector: 'app-designhead',
  templateUrl: './designhead.component.html',
  styleUrls: ['./designhead.component.css'],
   providers: [ProjectService, UserDetailsService]
})
export class DesignheadComponent implements OnInit {

	observableProjects: Observable<Project[]>
 	projects: Project[];
	errorMessage: string;
	

  constructor() { }

  ngOnInit() {
  }

}
