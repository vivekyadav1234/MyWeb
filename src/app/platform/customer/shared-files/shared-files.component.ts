import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-shared-files',
  templateUrl: './shared-files.component.html',
  styleUrls: ['./shared-files.component.css']
})
export class SharedFilesComponent implements OnInit {
	@Input() sharedFiles:any = [];

  constructor() { }

  ngOnInit() {
  }

}
