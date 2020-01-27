import { Component, OnInit } from '@angular/core';
import { CallLogsService } from './call-logs.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-call-logs',
  templateUrl: './call-logs.component.html',
  styleUrls: ['./call-logs.component.css'],
  providers: [CallLogsService]
})
export class CallLogsComponent implements OnInit {

  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:string;
  callLogs;

  constructor(
    private callLogsService:CallLogsService,
    private loaderService:LoaderService
  ) { }

  ngOnInit() {
    
    this.role = localStorage.getItem('user');
    this.getCallLogs();
  }

  getCallLogs(){
    this.loaderService.display(true);
    this.callLogsService.getCallLogs().subscribe(
      res => {
        this.callLogs = res.inhouse_calls;
        this.loaderService.display(false);
      },
      err => {
        this.loaderService.display(false);
      }
    );
  }

}
