import {Routes, RouterModule , Router,ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PresentationService } from '../presentation.service';
import { environment } from 'environments/environment';
import { LoaderService } from '../../../services/loader.service';
import {QuotationService} from '../../quotation/quotation.service';
import {Location} from '@angular/common';

import 'fabric';
declare const fabric: any;
declare let $: any;
// var pptx = require("pptxgenjs");
declare let jsPDF:any
declare let PptxGenJS:any

@Component({
  selector: 'app-createpresentation',
  templateUrl: './createpresentation.component.html',
  styleUrls: ['./createpresentation.component.css'],
  providers: [PresentationService,QuotationService]
})
export class CreatepresentationComponent implements OnInit {

  public baseUrl: string = environment.uiBaseUrl;
  modalQuantityandProductSelectionForm: FormGroup;
  public project_id:any
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
  // Delete this block for production
  public tempData: any = ["./assets/img/ppt/image110.png", "./assets/img/ppt/image111.png", "./assets/img/ppt/image1.png", "./assets/img/ppt/image2.png", "./assets/img/ppt/image3.gif", "./assets/img/ppt/image4.jpg", "./assets/img/ppt/image5.jpg", "./assets/img/ppt/image6.jpg", "./assets/img/ppt/image7.jpg", "./assets/img/ppt/image8.jpg", "./assets/img/ppt/image9.jpg", "./assets/img/ppt/image10.jpg", "./assets/img/ppt/image11.jpg", "./assets/img/ppt/image12.png", "./assets/img/ppt/image13.jpg", "./assets/img/ppt/image14.jpg", "./assets/img/ppt/image15.png", "./assets/img/ppt/image16.svg", "./assets/img/ppt/image17.jpg", "./assets/img/ppt/image18.jpeg", "./assets/img/ppt/image19.jpg", "./assets/img/ppt/image20.png", "./assets/img/ppt/image21.png", "./assets/img/ppt/image22.jpg", "./assets/img/ppt/image23.png", "./assets/img/ppt/image24.jpg", "./assets/img/ppt/image25.png", "./assets/img/ppt/image26.jpg", "./assets/img/ppt/image27.jpg", "./assets/img/ppt/image29.png", "./assets/img/ppt/image30.jpg", "./assets/img/ppt/image31.jpg", "./assets/img/ppt/image32.jpg", "./assets/img/ppt/image33.jpg", "./assets/img/ppt/image34.jpg", "./assets/img/ppt/image35.jpg", "./assets/img/ppt/image36.jpg", "./assets/img/ppt/image37.jpg", "./assets/img/ppt/image38.jpg", "./assets/img/ppt/image39.jpg", "./assets/img/ppt/image40.jpg", "./assets/img/ppt/image41.jpg", "./assets/img/ppt/image42.jpg", "./assets/img/ppt/image43.jpg", "./assets/img/ppt/image44.jpg", "./assets/img/ppt/image45.jpg", "./assets/img/ppt/image46.jpg", "./assets/img/ppt/image47.jpg", "./assets/img/ppt/image48.jpg", "./assets/img/ppt/image49.jpg", "./assets/img/ppt/image50.jpg", "./assets/img/ppt/image51.jpg", "./assets/img/ppt/image52.jpg", "./assets/img/ppt/image53.jpg", "./assets/img/ppt/image54.jpg", "./assets/img/ppt/image55.jpg", "./assets/img/ppt/image56.png", "./assets/img/ppt/image57.jpg", "./assets/img/ppt/image58.jpg", "./assets/img/ppt/image59.jpg", "./assets/img/ppt/image60.jpg", "./assets/img/ppt/image61.jpg", "./assets/img/ppt/image62.jpg", "./assets/img/ppt/image63.jpg", "./assets/img/ppt/image64.jpg", "./assets/img/ppt/image65.jpg", "./assets/img/ppt/image66.jpg", "./assets/img/ppt/image67.jpg", "./assets/img/ppt/image68.jpg", "./assets/img/ppt/image69.jpg", "./assets/img/ppt/image70.jpg", "./assets/img/ppt/image71.jpg", "./assets/img/ppt/image72.jpg", "./assets/img/ppt/image73.jpg", "./assets/img/ppt/image74.jpg", "./assets/img/ppt/image75.jpg", "./assets/img/ppt/image76.jpg", "./assets/img/ppt/image77.jpg", "./assets/img/ppt/image78.jpg", "./assets/img/ppt/image79.jpg", "./assets/img/ppt/image80.jpg", "./assets/img/ppt/image81.jpg", "./assets/img/ppt/image82.jpg", "./assets/img/ppt/image83.jpg", "./assets/img/ppt/image84.jpg", "./assets/img/ppt/image85.jpg", "./assets/img/ppt/image86.jpg", "./assets/img/ppt/image87.jpg", "./assets/img/ppt/image88.jpg", "./assets/img/ppt/image89.jpg", "./assets/img/ppt/image90.jpg", "./assets/img/ppt/image91.jpg", "./assets/img/ppt/image92.jpg", "./assets/img/ppt/image93.jpg", "./assets/img/ppt/image94.png", "./assets/img/ppt/image95.jpg", "./assets/img/ppt/image96.jpg", "./assets/img/ppt/image97.jpg", "./assets/img/ppt/image98.jpg", "./assets/img/ppt/image99.jpg", "./assets/img/ppt/image100.jpg", "./assets/img/ppt/image101.jpg", "./assets/img/ppt/image102.jpg", "./assets/img/ppt/image103.jpg", "./assets/img/ppt/image104.jpg", "./assets/img/ppt/image105.jpg", "./assets/img/ppt/image106.jpg", "./assets/img/ppt/image107.jpeg", "./assets/img/ppt/image108.png", "./assets/img/ppt/image109.png"];
  // Delete this block for production
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
  lead_status;

  constructor(
    public activatedRoute: ActivatedRoute,
    public presentationService : PresentationService,
    private loaderService : LoaderService,
    private _location: Location,
    private quotationService:QuotationService,
    private router:Router
  ) { }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
    //setup front side canvas
    this.activatedRoute.params.subscribe((params: Params) => {
        this.project_id = params['projectId'];
      });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
        if(params['theme'] == "theme1"){
          this.populatePresentationFromTheme(params['theme'])

        }
        else if(params['theme'] == "theme2"){
          this.populatePresentationFromTheme(params['theme'])
        }
        else{
          this.setCanvas();
        }
      });
    this.modalQuantityandProductSelectionForm = new FormGroup({
      productQty: new FormControl(1, Validators.required),
      productSpace: new FormControl("Master Bedroom", Validators.required),
      // productSku: new FormControl(null, Validators.required),
    });

    localStorage.removeItem("used_product");
  }

  ngAfterViewInit(){
    this.getSections();
  }
  headers_res;
  per_page;
  total_page;
  current_page;
  getProducts(){
      $(".product-list").toggle();
      this.loaderService.display(true);
    // $(".product-list").css("display", "block");
    this.presentationService.getProductList().subscribe(
      res => {
        Object.keys(res).map((key)=>{ this.productList= res[key];})
        this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );

  }

  populatePresentationFromTheme(theme = "theme2"){
    this.loaderService.display(true);
    this.presentationService.loadFromTheme(theme).subscribe(
      res => {
        this.selectedTheme = res;
        $(".canvas-slides").html("");
        for(var key in this.selectedTheme)
         {
            
            var newCanvas = document.createElement('canvas');
            newCanvas.setAttribute("id", key);
            newCanvas.setAttribute("class", "canvas");
            $(".canvas-slides").append(newCanvas);
            this.setCanvas(key)

            this.selectedCanvas.loadFromJSON(this.selectedTheme[key], () => {
            
            this.selectedCanvas.renderAll();
            this.selectCanvas();
            // and checking if object's "name" is preserved
            this.loaderService.display(false);
          });

            
         }
      },
      err => {
        
        this.loaderService.display(false);
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

      'object:moving': (e) => { },
      'object:modified': (e) => { },
      'object:selected': (e) => {

        let selectedObject = e.target;
        this.selected = selectedObject
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              
              break;
          }
        }
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
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

  addCanvas() {
    if(Object.keys(this.canvasMap).length > 0){
      var newCanvas = document.createElement('canvas');
      newCanvas.setAttribute("id", "canvas-"+Object.keys(this.canvasMap).length);
      newCanvas.setAttribute("class", "canvas");
      $(".canvas-slides").append(newCanvas);
      this.setCanvas("canvas-"+Object.keys(this.canvasMap).length);
      this.selectCanvas();
    }
  }

  addBeforeCanvas(template = null) {
    var selected_id =null
    for(var key in this.canvasMap){
      if(this.canvasMap[key] == this.selectedCanvas){
        selected_id = key;
      }
    }

    if(Object.keys(this.canvasMap).length > 0){
      var newCanvas = document.createElement('canvas');
      newCanvas.setAttribute("id", "canvas-"+Object.keys(this.canvasMap).length);
      newCanvas.setAttribute("class", "canvas");
      $("#"+selected_id).parent().before(newCanvas);
      this.setCanvas("canvas-"+Object.keys(this.canvasMap).length);
      this.selectCanvas();
      if(template != "" || template != null){
        this.presentationService.loadFromTemplate(template).subscribe(
          res => {
            this.selectedCanvas.loadFromJSON(res, () => {
              this.selectedCanvas.renderAll();
            });
          },
          err => {
            
          }
        );
      }
    }
  }

  addAfterCanvas(template = null) {
    var selected_id =null
    for(var key in this.canvasMap){
      if(this.canvasMap[key] == this.selectedCanvas){
        selected_id = key;
      }
    }
    if(Object.keys(this.canvasMap).length > 0){
      var newCanvas = document.createElement('canvas');
      newCanvas.setAttribute("id", "canvas-"+Object.keys(this.canvasMap).length);
      newCanvas.setAttribute("class", "canvas");
      $("#"+selected_id).parent().after(newCanvas);
      this.setCanvas("canvas-"+Object.keys(this.canvasMap).length);
      this.selectCanvas();
      if(template != "" || template != null){
        this.presentationService.loadFromTemplate(template).subscribe(
          res => {
            this.selectedCanvas.loadFromJSON(res, () => {
              this.selectedCanvas.renderAll();
            });
          },
          err => {
            
          }
        );
      }
    }
  }

  deleteCanvas(){
    var selected_id =null
    for(var key in this.canvasMap){
      if(this.canvasMap[key] == this.selectedCanvas){
        selected_id = key;
      }
    }
    $("#"+selected_id).parent().remove();
  }

  selectCanvas(){
    var parentThis = this
    $(".canvas").click(function(){
      $(".canvas").removeClass("active");
      $("#"+$(this).prev().attr("id")).addClass("active")
      parentThis.selectedCanvas = parentThis.canvasMap[$(this).prev().attr("id")]
    })
  }

  /*------------------------Block elements------------------------*/

  //Block "Size"

  changeSize(event: any) {
    this.selectedCanvas.setWidth(this.size.width);
    this.selectedCanvas.setHeight(this.size.height);
  }

  //Block "Add text"

  addText() {
    this.storeOldSlide(this.selectedCanvas);
    let textString = this.textString;
    let text = new fabric.IText(textString, {
      left: 10,
      top: 10,
      fontFamily: 'helvetica',
      angle: 0,
      fill: '#000000',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.selectedCanvas.add(text);
    this.selectItemAfterAdded(text);
    this.textString = '';
  }

  //Block "Add product"

  getImgPolaroidProduct(event: any, sku: any) {
    if(event==''||event==null){
      var str = 'variation_'+sku;
      let el = document.getElementById(str);
      this.usedProductList.push(sku);
      fabric.Image.fromURL(el.getAttribute('src'), (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true,
          peloas: 12
        });
        image.scaleToWidth(200);
        this.extend(image, this.randomId());
        this.selectedCanvas.add(image);
        this.selectItemAfterAdded(image);
      });
    } else {
      let el = event.target;
      this.usedProductList.push(sku);
      fabric.Image.fromURL(el.src, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true,
          peloas: 12
        });
        image.scaleToWidth(200);
        this.extend(image, this.randomId());
        this.selectedCanvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }  
    
   
  }

  //Block "Add images"

  getImgPolaroid(event: any) {
    let el = event.target;
    fabric.Image.fromURL(el.src, (image) => {
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
        peloas: 12
      });
      image.scaleToWidth(200);
      this.extend(image, this.randomId());
      this.selectedCanvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  //Block "Upload Image"

  addImageOnCanvas(url) {
    this.storeOldSlide(this.selectedCanvas);
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true
        });
        image.scaleToWidth(200);
        this.extend(image, this.randomId());
        this.selectedCanvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target['result'];
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  };

  //Block "Add figure"

  addFigure(figure) {
    this.storeOldSlide(this.selectedCanvas);
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.selectedCanvas.add(add);
    this.selectItemAfterAdded(add);
  }

  /*Canvas*/

  cleanSelect() {
    this.selectedCanvas.deactivateAllWithDispatch().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.selectedCanvas.deactivateAllWithDispatch().renderAll();
    this.selectedCanvas.setActiveObject(obj);
  }

  setCanvasFill() {
    this.storeOldSlide(this.selectedCanvas);
    if (!this.props.canvasImage) {
      this.selectedCanvas.backgroundColor = this.props.canvasFill;
      this.selectedCanvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    this.storeOldSlide(this.selectedCanvas);
    let self = this;
    if (this.props.canvasImage) {
      this.selectedCanvas.setBackgroundColor({ source: this.props.canvasImage, repeat: 'repeat' }, function () {
        // self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName, object) {
    object = object || this.selectedCanvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  }


  setActiveStyle(styleName, value, object) {
    this.storeOldSlide(this.selectedCanvas);
    object = object || this.selectedCanvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    }
    else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.selectedCanvas.renderAll();
  }


  getActiveProp(name) {
    var object = this.selectedCanvas.getActiveObject();
    if (!object) return '';

    return object[name] || '';
  }

  setActiveProp(name, value) {
    this.storeOldSlide(this.selectedCanvas);
    var object = this.selectedCanvas.getActiveObject();
    if (!object) return;
    object.set(name, value).setCoords();
    this.selectedCanvas.renderAll();
  }

  clone() {
    this.storeOldSlide(this.selectedCanvas);
    let activeObject = this.selectedCanvas.getActiveObject(),
      activeGroup = this.selectedCanvas.getActiveGroup();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }

      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.selectedCanvas.add(clone);
        this.selectItemAfterAdded(clone);
        alert("File Successfully Cloned");
      }
    }
  }

  onKeyup(event) {
      if (event.key === "c") {
        this.copy();
      }
      else if(event.key === "v"){
        this.paste();
      }
  }

  undoSlide:any;
  storeOldSlide(slide){
    let json = JSON.stringify(slide);
    localStorage.setItem('oldSlide', json);
    this.undoSlide = this.selectedCanvas;
    // localStorage.setItem('targetSlide', this.selectedCanvas);
  }

  copiedElement:any;
  copy(){
    this.copiedElement = this.selectedCanvas.getActiveObject();
  }

  cut(){
    this.storeOldSlide(this.selectedCanvas);
    this.copiedElement = this.selectedCanvas.getActiveObject();
    this.removeSelected();
  }

  paste(){
    this.storeOldSlide(this.selectedCanvas);
    if (this.copiedElement) {
      let clone;
      switch (this.copiedElement.type) {
        case 'rect':
          clone = new fabric.Rect(this.copiedElement.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(this.copiedElement.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(this.copiedElement.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', this.copiedElement.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(this.copiedElement);
          break;
      }

      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.selectedCanvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  copySlide(){
    this.saveCanvasToJSON()
  }

  pasteSlide(){
    this.storeOldSlide(this.selectedCanvas);
    this.loadCanvasFromJSON()
  }

  undoAction(){
    // let targetSlide = localStorage.getItem('targetSlide');
    // localStorage.setItem('targetSlide', this.selectedCanvas);
    if(this.undoSlide){
      let CANVAS = localStorage.getItem('oldSlide');
      // and load everything from the same json
      this.undoSlide.loadFromJSON(CANVAS, () => {
        this.undoSlide.renderAll();
      });
    }
    
  }
  
  slideToMove:any;
  targetSlideMove(){
    let json = JSON.stringify(this.selectedCanvas);
    localStorage.setItem('moveSlide', json);
    this.slideToMove = this.selectedCanvas;
    this.deleteCanvas();
  }

  positionTop(){
    if(this.slideToMove){
      var selected_id =null
      for(var key in this.canvasMap){
        if(this.canvasMap[key] == this.selectedCanvas){
          selected_id = key;
        }
      }

      if(Object.keys(this.canvasMap).length > 0){
        var newCanvas = document.createElement('canvas');
        newCanvas.setAttribute("id", "canvas-"+Object.keys(this.canvasMap).length);
        newCanvas.setAttribute("class", "canvas");
        $("#"+selected_id).parent().before(newCanvas);
        this.setCanvas("canvas-"+Object.keys(this.canvasMap).length);
        this.selectCanvas();
        var newCanvasJson = localStorage.getItem('moveSlide');
        this.selectedCanvas.loadFromJSON(newCanvasJson, () => {
          this.selectedCanvas.renderAll();
        })
        this.slideToMove = "";
      }
    }

    else{
      alert("Please lock the file to move");
    }
    
  }

  positionBelow(){
    if(this.slideToMove){
      var selected_id =null
      for(var key in this.canvasMap){
        if(this.canvasMap[key] == this.selectedCanvas){
          selected_id = key;
        }
      }

      if(Object.keys(this.canvasMap).length > 0){
        var newCanvas = document.createElement('canvas');
        newCanvas.setAttribute("id", "canvas-"+Object.keys(this.canvasMap).length);
        newCanvas.setAttribute("class", "canvas");
        $("#"+selected_id).parent().after(newCanvas);
        this.setCanvas("canvas-"+Object.keys(this.canvasMap).length);
        this.selectCanvas();
        var newCanvasJson = localStorage.getItem('moveSlide');
        this.selectedCanvas.loadFromJSON(newCanvasJson, () => {
          this.selectedCanvas.renderAll();
        })
        this.slideToMove = "";
      }
    }
    else{
      alert("Please lock the file to move");
    }
    
  }

  getId() {
    this.props.id = this.selectedCanvas.getActiveObject().toObject().id;
  }

  setId() {
    let val = this.props.id;
    let complete = this.selectedCanvas.getActiveObject().toObject();
    this.selectedCanvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.storeOldSlide(this.selectedCanvas);
    this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.storeOldSlide(this.selectedCanvas);
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.storeOldSlide(this.selectedCanvas);
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.storeOldSlide(this.selectedCanvas);
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.storeOldSlide(this.selectedCanvas);
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.storeOldSlide(this.selectedCanvas);
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  getFontStyle() {
    this.props.fontStyle = this.getActiveStyle('fontStyle', null);
  }

  setFontStyle() {
    this.storeOldSlide(this.selectedCanvas);
    this.props.fontStyle = !this.props.fontStyle;
    this.setActiveStyle('fontStyle', this.props.fontStyle ? 'italic' : '', null);
  }


  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    this.storeOldSlide(this.selectedCanvas);
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, "g"), "");
    } else {
      iclass += ` ${value}`
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }


  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.storeOldSlide(this.selectedCanvas);
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.storeOldSlide(this.selectedCanvas);
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {
    this.storeOldSlide(this.selectedCanvas);
    let activeObject = this.selectedCanvas.getActiveObject(),
      activeGroup = this.selectedCanvas.getActiveGroup();

    if (activeObject) {
      this.selectedCanvas.remove(activeObject);
      // this.textString = '';
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.selectedCanvas.discardActiveGroup();
      let self = this;
      objectsInGroup.forEach(function (object) {
        self.canvas.remove(object);
      });
    }
  }

  bringToFront() {
    this.storeOldSlide(this.selectedCanvas);
    let activeObject = this.selectedCanvas.getActiveObject(),
      activeGroup = this.selectedCanvas.getActiveGroup();

    if (activeObject) {
      activeObject.bringToFront();
      // activeObject.opacity = 1;
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.selectedCanvas.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    this.storeOldSlide(this.selectedCanvas);
    let activeObject = this.selectedCanvas.getActiveObject(),
      activeGroup = this.selectedCanvas.getActiveGroup();

    if (activeObject) {
      activeObject.sendToBack();
      // activeObject.opacity = 1;
    }
    else if (activeGroup) {
      let objectsInGroup = activeGroup.getObjects();
      this.selectedCanvas.discardActiveGroup();
      objectsInGroup.forEach((object) => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    if (confirm('Are you sure?')) {
      this.selectedCanvas.clear();
      alert("Canvas cleared Successfully");
    }
  }

  rasterize() {
    if (!fabric.Canvas.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      //window.open(this.selectedCanvas.toDataURL('png'));
      var image = new Image();
      image.src = this.selectedCanvas.toDataURL('png')
      var w = window.open("");
      w.document.write(image.outerHTML);
    }
  }

  exportPPT(){
    var pptx = new PptxGenJS();
    pptx.setAuthor('Arrivae');
    pptx.setCompany('Arrivae');
    pptx.setRevision('15');
    pptx.setSubject('Arrivae');
    pptx.setTitle('Arrivae Presentation');

    pptx.setLayout({ name:'Arrivae', width:10, height:7.5 });

    // pptx.setLayout('LAYOUT_WIDE');
    // LAYOUT_16x9  Yes  10 x 5.625 inches
    // LAYOUT_16x10  No  10 x 6.25 inches
    // LAYOUT_4x3  No  10 x 7.5 inches
    // LAYOUT_WIDE  No  13.3 x 7.5 inches
    // LAYOUT_USER  No  user defined - see below (inches)

    for(var key in this.canvasMap)
     {
        var slide = pptx.addNewSlide();
        slide.addImage(
          { 
            x:'0%', 
            y:'0%',
            w:'100%',
            h:'100%',
            data:this.canvasMap[key].toDataURL('png')
          });
     }
     pptx.save();
  }

  rasterizeSVG() {
    // window.open(
    //   'data:image/svg+xml;utf8,' +
    //   encodeURIComponent(this.selectedCanvas.toSVG()));
    // 
    // var image = new Image();
    // image.src = this.selectedCanvas.toSVG()
    var w = window.open("");
    w.document.write(this.selectedCanvas.toSVG());
  };


  saveCanvasToJSON() {
    let json = JSON.stringify(this.selectedCanvas);
    localStorage.setItem('Kanvas', json);
   

  }

  loadCanvasFromJSON() {
    let CANVAS = localStorage.getItem('Kanvas');
    

    // and load everything from the same json
    this.selectedCanvas.loadFromJSON(CANVAS, () => {

      // making sure to render canvas at the end
      this.selectedCanvas.renderAll();
    });

  };

  rasterizeJSON() {
    this.json = JSON.stringify(this.selectedCanvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

  sortCanvas(){
    var data = {}
    var ids = $(".canvas").map(function () {
      return this.id;
    }).get();


    var sorted_arr = $.grep(ids, function(n, i){
      return (n !== "" && n != null);
    });

    for(var i=0; i<= sorted_arr.length; i++){
      data[sorted_arr[i]] = this.canvasMap[sorted_arr[i]];
    }
    return data
  }

  createBOQ(){
    this.loaderService.display(true);
    var products_used = this.added_products;
    this.presentationService.saveBoq(products_used,this.project_id, this.presentation, this.boq)
    .subscribe(
        boq => {
          boq = boq;
          Object.keys(boq).map((key)=>{ this.boq= boq[key];});
          this.loaderService.display(false);
        },
        error => {
          
          this.loaderService.display(false);
        }
    );
  }

  saveFile(){
    this.loaderService.display(true);
    var data = this.sortCanvas();
    var products_used = this.added_products;
    var title = $("#p-title").val();
    this.presentationService.savePresentation(data,products_used,this.project_id, this.presentation, title)
    .subscribe(
        presentation => {
          presentation = presentation;
          Object.keys(presentation).map((key)=>{ this.presentation= presentation[key];});
          this.resetQuantitySpaceForm();
          // this.loaderService.display(false);
         //  this.successalert = true;
         //  this.successMessage = "Project Created Successfully !!";
         // setTimeout(function() {
         //     this.successalert = false;
         //  }.bind(this), 2000);
          this.router.navigateByUrl('/projects/'+this.project_id+'/presentation/'+this.presentation.id+'/edit');
          // return presentation;
          alert("File Saved Successfully");
          this.loaderService.display(false);
        },
        error => {
          // this.errorMessage = error;
          // this.loaderService.display(false);
          // $.notify('error',JSON.parse(this.errorMessage['_body']).message);
          // setTimeout(function() {
          //     this.erroralert = false;
          //  }.bind(this), 2000);
          // return Observable.throw(error);
          
          this.loaderService.display(false);
        }
    );
  }

  closeSidePanel(){
    $('.product-list').css("display", "none");
  }

  // Delete this block for production

  getImage(){
    $(".image-list").css("display", "block");
  }

  closeImagePanel(){
    $('.image-list').css("display", "none");
  }

  getImgPolaroidImage(event: any) {
    let el = event.target;
    fabric.Image.fromURL(el.src, (image) => {
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
        peloas: 12
      });
      image.scaleToWidth(200);
      this.extend(image, this.randomId());
      this.selectedCanvas.add(image);
      this.selectItemAfterAdded(image);
    });
    $('.image-list').css("display", "none");
  }

  ViewJson(){
    var mysdata = JSON.stringify(this.canvasMap)
    var x = window.open();
    x.document.open();
    x.document.write(mysdata);
    x.document.close();

  }

  // Delete this block for production
  products_catalogue;
  products_arr;
  product_configurations;
  product_source = 'catalogue';
  product_details;
  subsections;
  product_variations;
  getCatalogueProducts(sectionName, sectionID, page?){
    this.loaderService.display(true);
    this.product_configurations = [];
    page = (page || 1);
    this.quotationService.getProductListForPPt(sectionID, sectionName, page).subscribe(
      res => {
        this.headers_res= res.headers._headers;
        this.per_page = this.headers_res.get('x-per-page');
        this.total_page = this.headers_res.get('x-total');
        this.current_page = this.headers_res.get('x-page');

        res= res.json();
        this.products_catalogue = res;
        this.products_arr = res['section']['products'];
        this.subsections=this.products_catalogue.section.sub_sections;
         this.loaderService.display(false);
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }
  getCatalogueSubsectionProducts(subsecId,subsecName){
    this.loaderService.display(true);
    this.product_configurations=[];
    this.quotationService.getProductListForPPt(subsecId,subsecName).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr = res['section']['products'];
        this.product_configurations = res['section']['product_configurations'];
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  sectionsList;
  totalProductCountForAll =0;
  pname;
  getSections(){
    this.quotationService.getSections().subscribe(
      res=>{
        this.sectionsList = res.sections;
        for(var p=0;p<this.sectionsList.length; p++){
          this.totalProductCountForAll = this.totalProductCountForAll+this.sectionsList[p].count;
        }
        for(var k=0; k<res.projects.length;k++){
          if(res.projects[k].id==this.project_id){
            this.pname = res.projects[k].name;
            break;
          }
        }
      },
      err=>{
        
      }
    );
  }
  getCatalogueConfigurationProducts(configId,configName,sectionId){
    this.loaderService.display(true);
    this.quotationService.getProductForConfiguration(sectionId,configId).subscribe(
      res => {
        this.loaderService.display(false);
        this.products_catalogue = res;
        this.products_arr= res['product_configuration']['products'];
        //this.product_configurations = res['section']['product_configurations'];
      },
      err => {
        
        this.loaderService.display(false);
      }
    );
  }

  setProductSource(val){
    this.product_source = val;
    if(val=='catalogue'){
      this.getCatalogueProducts('all','all');
    }
    if(val=='project'){
      this.loaderService.display(true);
      this.quotationService.getProductForThisProject(this.project_id).subscribe(
        res=>{
          this.products_catalogue = res;
          this.loaderService.display(false);
        },
        err => {
          
          this.loaderService.display(false);
        }
       );
    }
  }

  viewmoreProductDetails(productId,secId){
    document.getElementById('viewproductRow').style.display = 'block';
    document.getElementById('allproductsRow').style.display = 'none';
    this.quotationService.viewProduct(productId,secId).subscribe(
      res =>{
        this.product_details = res.product;
        this.product_variations = this.product_details.variations;
      },
      err => {
        
      }
    );
  }
  showVariationDetails(val){
    this.product_details = val;
  }
  backToProducts(){
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    this.product_details = undefined;
    this.product_variations = undefined
  }

  closeModal(){
    document.getElementById('viewproductRow').style.display = 'none';
    document.getElementById('allproductsRow').style.display = 'block';
    this.product_configurations = undefined;
    this.product_details = undefined;
    this.product_variations = undefined;
    this.product_source = 'catalogue';
    this.subsections = undefined;
    this.resetQuantitySpaceForm();
    // $('#addProductModal').modal('hide');
  }
  product_notify_message;
  notificationAlert= false;
  added_products:any = [];
  addProductToBoqs(product,form_val){
    var obj = {
      "product_id" : product.id, 
      "quantity" : form_val.productQty, 
      "space" : form_val.productSpace
    }
    this.added_products.push(obj);
    this.storeOldSlide(this.selectedCanvas);
    this.product_notify_message = product.name + ' has been added';
    this.notificationAlert = true;
    setTimeout(function() {
      this.notificationAlert = false;    
    }.bind(this), 10000);
    this.backToProducts();
    this.resetQuantitySpaceForm();
  }

  resetQuantitySpaceForm(){
    this.modalQuantityandProductSelectionForm.reset();
    this.modalQuantityandProductSelectionForm.controls['productQty'].setValue(1);
    this.modalQuantityandProductSelectionForm.controls['productSpace'].setValue("Master Bedroom");
  }

}
