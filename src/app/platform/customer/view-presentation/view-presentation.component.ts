import {Router, ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {QuotationService} from '../../quotation/quotation.service';
import { PresentationService } from '../../presentation/presentation.service';
import { environment } from 'environments/environment';
import { LoaderService } from '../../../services/loader.service';

import 'fabric';
declare const fabric: any;
declare let $: any;
// var pptx = require("pptxgenjs");
declare let jsPDF:any
declare let PptxGenJS:any



@Component({
  selector: 'app-view-presentation',
  templateUrl: './view-presentation.component.html',
  styleUrls: ['./view-presentation.component.css'],
  providers: [PresentationService,QuotationService]
})
export class ViewPresentationComponent implements OnInit {

	public baseUrl: string = environment.uiBaseUrl;
  public project_id:any
  public presentation_id:any
  public presentation:any
  public boq:any
  public canvas: any;
  public props: any = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: 14,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: 'arial',
    TextDecoration: ''
  };

  public textString: string;
  public url: string = '';
  public size: any = {
    width: 750,
    height: 563
  };

  public json: any;
  public globalEditor: boolean = false;
  public textEditor: boolean = false;
  public imageEditor: boolean = false;
  public figureEditor: boolean = false;
  public selected: any;
  public canvasMap: Object = {};
  public selectedCanvas: any;
  public productList : any[];
  public usedProductList : any = [];
  public selectedTheme: any;
  public font_size_numbers: Array<Number> = Array(120).fill(0).map((x,i)=>i+1);

  constructor(
  	public activatedRoute: ActivatedRoute,
    public presentationService : PresentationService,
    private loaderService : LoaderService,
    private quotationService:QuotationService

  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
        this.project_id = params['projectId'];
        this.presentation_id = params['presentationId'];
      });

    this.fetchPresentation();
  }

  ngAfterViewInit(){
    $(document).bind("contextmenu", function (e) {
        e.preventDefault();
        
    });

    // this.getSections();
  }

  fetchPresentation(){
    this.loaderService.display(true);
    this.presentationService.fetchPresentation(this.project_id,this.presentation_id).subscribe(
      presentation => {
        this.presentation = presentation;
        this.populatePresentation();
        // this.selectCanvas();
        $("#p-title").val(this.presentation.presentation.title);
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  populatePresentation(){
    for(var key in this.presentation.presentation.slides)
     {
        var newCanvas = document.createElement('canvas');
        newCanvas.setAttribute("id", this.presentation.presentation.slides[key].title);
        newCanvas.setAttribute("class", "canvas");
        $(".canvas-slides").append(newCanvas);
        this.setCanvas(this.presentation.presentation.slides[key].title)

        this.selectedCanvas.loadFromJSON(this.presentation.presentation.slides[key].data, () => {
        this.selectedCanvas.renderAll();

        // and checking if object's "name" is preserved
      });

        
     }
  }

  getProducts(){
     $(".product-list").toggle();
    // $(".product-list").css("display", "block");
    this.presentationService.getProductList().subscribe(
      res => {
        Object.keys(res).map((key)=>{ this.productList = res[key];})
      },
      err => {
        
      }
    );
  }

  setCanvas(id = 'canvas-0'){
    this.canvas = new fabric.Canvas(id, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      backgroundColor : "#fff"
    });


    this.canvas.on({

      'object:moving': (e) => {
      	return false;
      },
      'object:modified': (e) => {
      	return false;
      },
      'object:selected': (e) => {
      	return false;
      },
      'selection:cleared': (e) => {
        this.selected = null;
        // this.resetPanels();
      }
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    this.selectedCanvas = this.canvas;
    this.canvasMap[id]=this.canvas;

    // get references to the html canvas element & its context
    // this.canvas.on('mouse:down', (e) => {
    // let canvasElement: any = document.getElementById('canvas');
    // 
    // });
  }

 

}
