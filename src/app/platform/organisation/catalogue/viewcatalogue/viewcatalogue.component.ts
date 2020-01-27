import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Catalogue } from '../catalogue';
import { CatalogueService } from '../catalogue.service';
import { Routes, RouterModule , ActivatedRoute} from '@angular/router';
declare var Layout:any;

@Component({
  selector: 'app-viewcatalogue',
  templateUrl: './viewcatalogue.component.html',
  styleUrls: ['./viewcatalogue.component.css'],
  providers: [CatalogueService]
})
export class ViewcatalogueComponent implements OnInit {

  observableCatalogue: Observable<Catalogue[]>
  id: Number;
  catalogue: Catalogue[];
  errorMessage: string;
  attachment_file: any;
  attachment_name: string;
  basefile: any;

  constructor(
    private catalogueService :CatalogueService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
              this.id = +params['id'];
      });
      this.observableCatalogue = this.catalogueService.viewCatalogue(this.id);
      this.observableCatalogue.subscribe(
        catalogue => {
          this.catalogue = catalogue;
          Object.keys(catalogue).map((key)=>{ this.catalogue= catalogue[key];});
        },
        error => { 
          this.errorMessage = <any>error;
          Layout.notify('danger',JSON.parse(this.errorMessage['_body']).message);
          //alert(this.errorMessage['_body']);
        }
      );
  }
  submitted = false;
  onChange(event) {
       this.attachment_file = event.srcElement.files[0];
        var fileReader = new FileReader();
           var base64;
            fileReader.onload = (fileLoadedEvent) => {
             base64 = fileLoadedEvent.target;
             this.basefile = base64.result;
             //document.getElementById('floorplanImg').setAttribute('src',event.srcElement.files[0].name);
           };
        fileReader.readAsDataURL(this.attachment_file);
  }

  onSubmit(data) {

    this.submitted = true;
    this.catalogueService.uploadCatalogueExcel(this.id,this.basefile)
    .subscribe(
        product => {
        },
        error => {
          this.errorMessage = error;
          //$.notify('error',JSON.parse(this.errorMessage['_body']).message);
        }
    );
 }

}
