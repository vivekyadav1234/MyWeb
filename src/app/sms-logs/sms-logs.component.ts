import { Component, OnInit } from '@angular/core';
import { CallLogsService } from '../call-logs/call-logs.service';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-sms-logs',
  templateUrl: './sms-logs.component.html',
  styleUrls: ['./sms-logs.component.css'],
  providers: [CallLogsService]
})
export class SmsLogsComponent implements OnInit {

  errorMessage : string;
  erroralert = false;
  successalert = false;
  successMessage : string;
  role:string;
  smsLogs;

  constructor(
    private callLogsService:CallLogsService,
    private loaderService:LoaderService
  ) { }

  ngOnInit() {

    this.role = localStorage.getItem('user');
    this.getSmsLogs();
  }

  getSmsLogs(){
    this.loaderService.display(true);
    this.callLogsService.getSmsLogs().subscribe(
      res => {
        this.smsLogs = res.inhouse_calls;
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }


}
