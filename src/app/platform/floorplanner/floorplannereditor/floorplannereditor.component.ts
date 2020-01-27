import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-floorplannereditor',
  templateUrl: './floorplannereditor.component.html',
  styleUrls: ['./floorplannereditor.component.css']
})
export class FloorplannereditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //download script, add to DOM
    this.loadScripts();
  }

  loadScripts(){
    // var script_src = [
    //                     "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.min.js",
    //                     "https://cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.min.js",
    //                     "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/3.0.11/pixi.min.js"
    //                   ]

    // for(var i = 0; i < script_src.length; i++){
    //   var script = document.createElement('script');
    //   document.body.appendChild(script);
    //   // script.onload = this.onMathJaxLoaded.bind(this);
    //   script.src = script_src[i];
    // }
  }

}
