import { Component, OnInit } from '@angular/core';
import { BusinessHeadService } from '../business-head.service';
import { LoaderService } from '../../../services/loader.service';
import { Chart } from 'chart.js';
declare var $:any;

@Component({
  selector: 'app-aws-dashboard',
  templateUrl: './aws-dashboard.component.html',
  styleUrls: ['./aws-dashboard.component.css'],
  providers:[BusinessHeadService]
})
export class AwsDashboardComponent implements OnInit {
  erroralert: boolean;
  errorMessage: any;
  successalert: boolean;
  successMessage: any;
  public doughChartOptions:any = {
    tooltips: {
            // Disable the on-canvas tooltip
            enabled: false
          },
    legend: {
            display: false,
            
        },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    cutoutPercentage: 65,

  };
  public barChartOptions:any = {
    legend: {
            display: false,
            labels: {
                fontColor: 'rgb(255, 99, 132)'
            }
        },
    scaleShowVerticalLines: false,
    responsive: true,
    plugins: {
         datalabels: {
            display: true,
            align: 'center',
            anchor: 'center'
         }
      },
    scales: {
        scaleShowValues: true,
        xAxes: [{
            ticks: {
                autoSkip: false
            },

            gridLines: {
                display:false
            },
            barPercentage: .9, 
            categoryPercentage: 0.55 
        }],
        yAxes: [{
            ticks: {
                  max: 150,
                  min: 0,
                  stepSize: 25,
                  beginAtZero: true
              },
            gridLines: {
                display:false
            } ,
            stacked: true,  
        }]
    }
    };
    public barChartLabels=[];
    public circleClosureColors:Array<any> = [{
      backgroundColor: [
        '#5ECD72',
        'rgba(148,159,177,0.2)']
    }
    ];
    public circleColors:Array<any> = [{
      backgroundColor: [
        '#4C4AF6',
        'rgba(148,159,177,0.2)']
    }
    ];
    public circleMeetingColors:Array<any> = [{
      backgroundColor: [
        '#3096F7',
        'rgba(148,159,177,0.2)']
    }
    ];
    public circleBOQColors:Array<any> = [{
      backgroundColor: [
        '#F3C369',
        'rgba(148,159,177,0.2)']
    }
    ];
    public lineChartColors:Array<any> = [
    { 
      backgroundColor: '#4C4AF6',
      
    },
    { 
       backgroundColor: 'rgba(148,159,177,0.2)',
      
    },
    { 
      backgroundColor: '#3096F7',
      
    },
    { 
       backgroundColor: 'rgba(148,159,177,0.2)',
      
    },
    { 
      backgroundColor: '#F3C369',
      
    },
    { 
       backgroundColor: 'rgba(148,159,177,0.2)',
      
    },
    { 
      backgroundColor: '#5ECD72',
      
    },
    { 
       backgroundColor: 'rgba(148,159,177,0.2)',
      
    },

    ]
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
   
    public barChartData:any[];
    //for circle data------
    public doughnutChartData:number[];
    public doughnutChartDataMeeting:number[];
    public doughnutChartDataBOQ:number[];
    public doughnutChartDataClosure:number[];
    public doughnutChartType:string = 'doughnut';
   
    // events
    public chartClicked(e:any):void {
      
    }
   
    public chartHovered(e:any):void {
      
    }
   

  constructor(
    public businessHeadService : BusinessHeadService,
    private loaderService : LoaderService) { }

  ngOnInit() {
    
    this.getDataForBarChart();
    this.getFilterValues();
    this.getCMsAndDesForCity(null);
  }
  getFilterValues(){
    this.businessHeadService.getFilterValues().
      subscribe(
        res =>{
          this.city_dropdownList = res.cities;
          
        },
        error =>{
          
          this.errorMessageShow(JSON.parse(error._body).message);
         
        }
      );

  }
  weekly_data;
  card_data;
  getDataForBarChart(){
    this.loaderService.display(true);
    this.businessHeadService.getDetailsForChart(this.filter_by_data,this.filter_by_type,this.designers,this.cms,this.city,this.from_date,this.to_date, this.date_filter_type,this.number_of_weeks).
      subscribe(
        res =>{
          this.weekly_data = res.weekly_data;
          this.card_data = res.card_data;
          this.emptyArrayValue();
          this.setChartValue();
          this.setDoughNutChartValue();
          this.barChartLabels = [];
          setTimeout(function() {
              for(let obj of this.weekly_data){
                var temp_arr =['week '+obj.week_number,'('+obj.week_start_date+' - '+obj.week_end_date+')'];
                
                this.barChartLabels.push(temp_arr);
                

              }
            }.bind(this));
          
          
        },
        error =>{
          
          this.errorMessageShow(JSON.parse(error._body).message);
          this.loaderService.display(false);
        }
      );

  }
  ngAfterViewInit(){
    // this.loaderService.display(false);

  }
  emptyArrayValue(){
    this.qualifiled_leads_count = [];
    this.target_qualified_leads_count = [];
    this.closure_lead_count = [];
    this.target_closure_lead_count = [];
    this.first_meeting_actual=[];
    this.target_first_meeting_actual = [];
    this.boq_shared_count = [];
    this.target_boq_shared_count = [];
    this.barChartLabels = [];

  }

  selectedCityItems = [];
  selectedCmItems=[];
  selectedDesignerItems = [];
  label_arr=[];
  qualifiled_leads_count = [];
  target_qualified_leads_count = [];
  closure_lead_count = [];
  target_closure_lead_count = [];
  first_meeting_actual=[];
  target_first_meeting_actual = [];
  boq_shared_count = [];
  target_boq_shared_count = [];
  city_dropdownList = [];
  cm_dropdownList=[];
  designer_dropdownList=[];
  city_dropdownSettings = {
    singleSelection: true,
    text: "Select City",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class-dropdown",
  };
  cm_dropdownSettings = {
    singleSelection: true,
    text: "Community Managers",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class-dropdown",
  };
  designer_dropdownSettings = {
    singleSelection: true,
    text: "Designers",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class-dropdown",
  };
  onItemSelect(items,textVal?,index?){


    if(textVal=='cm' && index==1){
      this.cms = [];
      this.cms.push(items.id);

      this.getDataForBarChart();
    } else if(textVal=='designer' && index == 2){      
      this.designers = [];
      this.designers.push(items.id);

      this.getDataForBarChart();
    } 

    if(textVal=='city'){
      this.getCMsAndDesForCity(items.id);
      for(var k=0;k<this.selectedCityItems.length;k++){
        this.city =this.selectedCityItems[k].id;
      }
      this.getDataForBarChart();
    }
  }

  OnItemDeSelect(items,textVal?,index?){
    if(textVal=='cm' && index==1){
      this.cms = [];
      this.getDataForBarChart();
        
    }
   
    if(textVal=='designer' && index==2){
      this.designers = [];
      this.getDataForBarChart();
        
    }
    
    if(textVal=='city'){
      this.city = '';
      this.getDataForBarChart();
      this.getCMsAndDesForCity(null);
    }
  }
  onSelectAll(items){}
  onDeSelectAll(items){}
  getCMsAndDesForCity(cityId?){
    // this.loaderService.display(true);
    this.businessHeadService.getCMsAndDesForCityForOther(this.filter_by_data,cityId).subscribe(
      res => {
        this.cm_dropdownList = res.cms;
        this.designer_dropdownList=res.designers;
        // this.loaderService.display(false);
      },
      err => {
        
        // this.loaderService.display(false);
      });
  }
  from_date;
  to_date;
  cms=[];
  designers=[];
  city;

  //Method Foe Setting Chart Values
  setChartValue(){
    
    for(let obj of this.weekly_data){
      var temp_arr =['week '+obj.week_number,'('+obj.week_start_date+' - '+obj.week_end_date+')'];
      
      this.barChartLabels.push(temp_arr);
      

    }
    for(let obj of this.weekly_data){
      this.qualifiled_leads_count.push(obj.data_hash.qualified_leads_actual);
      this.target_qualified_leads_count.push(obj.data_hash.qualified_leads_target - obj.data_hash.qualified_leads_actual);
      this.first_meeting_actual.push(obj.data_hash.first_meeting_actual);
      this.target_first_meeting_actual.push(obj.data_hash.first_meeting_target - obj.data_hash.first_meeting_actual);
      this.boq_shared_count.push(obj.data_hash.boq_shared_actual);
      this.target_boq_shared_count.push(obj.data_hash.boq_shared_target - obj.data_hash.boq_shared_actual);      
      this.closure_lead_count.push(obj.data_hash.closure_actual);
      this.target_closure_lead_count.push(obj.data_hash.closure_target - obj.data_hash.closure_actual);

      
    } 
    
    this.barChartData = [
      {

        data: this.qualifiled_leads_count,
        stack: 1
      },
      {

        data: this.target_qualified_leads_count,
        stack: 1
      },
      {

        data: this.first_meeting_actual,
        stack: 2
      },
      {

        data: this.target_first_meeting_actual,
        stack: 2
      },
      {

        data: this.boq_shared_count,
        stack: 3
      },
      {

        data: this.target_boq_shared_count,
        stack: 3
      },
      {


        data: this.closure_lead_count,
        stack: 4
      },
      {


        data: this.target_closure_lead_count,
        stack: 4
      },

    ]

  }
  closer_t;
  shared_t;
  meeting_t;
  quali_t;
  public doughnutChartLabels:any = [];
  public doughnutChartLabelsOne:any = [];
  public doughnutChartLabelsTwo:any = [];
  public doughnutChartLabelsThree:any = [];
  setDoughNutChartValue(){
    this.doughnutChartLabels = ['Qualified Leads','Qualified Leads Target']
    this.doughnutChartLabelsOne = ['FirstMeeting Leads','FirstMeeting  Target']
    this.doughnutChartLabelsTwo = ['BOQ Shared','BOQ Shared  Target']
    this.doughnutChartLabelsThree = ['Closure','Closure  Target']
    this.closer_t = this.card_data.closure_target;
    this.shared_t = this.card_data.boq_shared_target;
    this.meeting_t = this.card_data.first_meeting_target;
    this.quali_t = this.card_data.qualified_leads_target;
    if(this.card_data.qualified_leads_target == 0 && this.card_data.qualified_leads_actual ==0){
      this.card_data.qualified_leads_target = 1;

    }
    if(this.card_data.first_meeting_target == 0 && this.card_data.first_meeting_actual ==0){
      this.card_data.first_meeting_target = 1;

    }
    if(this.card_data.boq_shared_target == 0  && this.card_data.boq_shared_actual ==0){
      this.card_data.boq_shared_target =1;

    }
    if(this.card_data.closure_target == 0  && this.card_data.closure_actual ==0){
      this.card_data.closure_target =1;

    }
    let targetVal = this.card_data.closure_target
    //for qualified shared
    if((this.card_data.qualified_leads_target - this.card_data.qualified_leads_actual) > 0){
      this.doughnutChartData = [this.card_data.qualified_leads_actual,(this.card_data.qualified_leads_target-this.card_data.qualified_leads_actual)];


    }
    else{
      this.doughnutChartData = [this.card_data.qualified_leads_actual , 0];
    }
    //for meeting shared
    if((this.card_data.first_meeting_target - this.card_data.first_meeting_actual) > 0){
      this.doughnutChartDataMeeting = [this.card_data.first_meeting_actual , (this.card_data.first_meeting_target-this.card_data.first_meeting_actual)];


    }
    else{
      this.doughnutChartDataMeeting = [this.card_data.first_meeting_actual , 0];
    }
    //for boq shared
    if((this.card_data.boq_shared_target - this.card_data.boq_shared_actual) > 0){
       this.doughnutChartDataBOQ = [this.card_data.boq_shared_actual,(this.card_data.boq_shared_target-this.card_data.boq_shared_actual)];


    }
    else{
      this.doughnutChartDataBOQ = [this.card_data.boq_shared_actual,0];
    }
    ///For Closure
    if((this.card_data.closure_target - this.card_data.closure_actual) > 0){
        this.doughnutChartDataClosure = [this.card_data.closure_actual,(this.card_data.closure_target - this.card_data.closure_actual)];


    }
    else{
        this.doughnutChartDataClosure = [this.card_data.closure_actual,0];
    }

    

    Chart.pluginService.register({


    beforeDraw: function(chart) {

      if(chart.canvas.id == 'firstChart'){
        var  type = chart.config.type;
        var canvas : any = document.getElementById("firstChart");
        var ctx = canvas.getContext("2d");
        var width = chart.chart.width,
            height = chart.chart.height
           
        ctx.restore();
        if (type == 'doughnut')
        {
         var percent = chart.config.data.datasets[0].data[0] 
        }

        var fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";

        var text = percent,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = height / 1.9;

        ctx.fillText(text, textX, textY);
        ctx.save();

       }
      }
    });


    // For Second Chart
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if(chart.canvas.id == 'secondChart'){
          var  type = chart.config.type;
          var canvas : any = document.getElementById("secondChart");
          var ctx = canvas.getContext("2d");
          var width = chart.chart.width,
              height = chart.chart.height
             
          ctx.restore();
          if (type == 'doughnut')
          {
           var percent = chart.config.data.datasets[0].data[0] 
          }

          var fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";

          var text = percent+'%',
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 1.9;

          ctx.fillText(text, textX, textY);
          ctx.save();

        }

        
        }
    });

    //For Third Chart
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if(chart.canvas.id == 'thirdChart'){
          var  type = chart.config.type;
          var canvas : any = document.getElementById("thirdChart");
          var ctx = canvas.getContext("2d");
          var width = chart.chart.width,
              height = chart.chart.height
             
          ctx.restore();
          if (type == 'doughnut')
          {
           var percent = chart.config.data.datasets[0].data[0] 
          }

          var fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";

          var text = percent+'%',
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 1.9;

          ctx.fillText(text, textX, textY);
          ctx.save();

        }

        
        }
    });
    //For Fourth Chart
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if(chart.canvas.id == 'fourthChart'){
          var  type = chart.config.type;
          var canvas : any = document.getElementById("fourthChart");
          var ctx = canvas.getContext("2d");
          var width = chart.chart.width,
              height = chart.chart.height
             
          ctx.restore();
          if (type == 'doughnut')
          {
           var percent = chart.config.data.datasets[0].data[0] 
          }

          var fontSize = (height / 114).toFixed(2);
          ctx.font = fontSize + "em sans-serif";
          ctx.textBaseline = "middle";

          var text = percent+'%',
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 1.9;

          ctx.fillText(text, textX, textY);
          ctx.save();

        }

        
        }
    });
    this.loaderService.display(false);


  }
  number_of_weeks;
  setWeekView(event){
    this.number_of_weeks = event;
    this.getDataForBarChart();
    

  }
  filter_by_data = 'overall_data';
  FilterByData(value){
    this.filter_by_data = value;
    this.getDataForBarChart();
    this.getCMsAndDesForCity();

  }
  filter_by_type;
  FilterByType(value){
    this.filter_by_type = value;
    this.getDataForBarChart();

  }
  errorMessageShow(msg){
    this.erroralert = true;
    this.errorMessage = msg;
    setTimeout(function() {
      this.erroralert = false;
    }.bind(this), 2000);
  }
  date_filter_type;
  submitByDate(){
    if( this.from_date != undefined  &&  this.to_date != undefined){
      this.date_filter_type = 'qualification'
      
      this.getDataForBarChart();

    }
    else{
      alert('Select From Date And To date First');
    }
    
  }
  successMessageShow(msg){
    this.successalert = true;
    this.successMessage = msg;
    setTimeout(function() {
      this.successalert = false;
    }.bind(this), 2000);
  }
  ClearFilterData(){
    this.filter_by_data = 'overall_data';
    this.filter_by_type = '';
    this.from_date = '';
    this.to_date = '';
    this.selectedCityItems = [];
    this.selectedCmItems=[];
    this.selectedDesignerItems = [];
    this.date_filter_type = '';
    this.getDataForBarChart();

  }
  nav_select = 'graph_nav';
  selectNavBar(navData){
    this.nav_select = navData;

  }
  ClearDateFilter(){
    this.from_date = '';
    this.to_date = '';
    this.getDataForBarChart();

  }

}
