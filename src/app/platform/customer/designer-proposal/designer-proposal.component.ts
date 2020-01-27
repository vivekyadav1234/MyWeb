import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { Routes, Router, RouterModule , ActivatedRoute, Params} from '@angular/router';
import  { CustomerService} from '../customer.service';
import { Observable } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/loader.service';
import { Angular2TokenService } from 'angular2-token';
import { PresentationService } from '../../presentation/presentation.service';
import { QuotationService } from '../../quotation/quotation.service';

declare var $:any;
declare let PptxGenJS:any

@Component({
  selector: 'app-designer-proposal',
  templateUrl: './designer-proposal.component.html',
  styleUrls: ['./designer-proposal.component.css'],
  providers: [ CustomerService, PresentationService , QuotationService ]
})
export class DesignerProposalComponent implements OnInit {
  cForm:  FormGroup;
  approvalForm:  FormGroup;
  project_id;
  activeTab:any = 'initialProposal';
  public proposal_list: any =[];
  proposal_detail:any;
  proposal_boq_list:any = [];
  proposal_ppt_list:any = [];
  team:any = [];
  scheduledEvents:any = [];
  sharedFiles:any = [];
  constructor(
    private fb: FormBuilder, 
    public activatedRoute: ActivatedRoute, 
    public loaderService : LoaderService,
    private _tokenService: Angular2TokenService,
    private router: Router,
    private el: ElementRef,
    private route:ActivatedRoute,
    private customerService : CustomerService,
    private presentationService : PresentationService) { 

  	this.cForm = fb.group({
      'project_id' : [],
  	  'date': ['', Validators.required],
  	  'time' : ['', Validators.required],
  	  'description': [],
      'scheduled_at': []
  	});

    this.approvalForm = fb.group({
      'proposal_doc_id': ['', Validators.required],
      'is_approved' : ['', Validators.required],
      'remark': ['']
    });
  }

  ngOnInit() {
  	this.activatedRoute.params.subscribe((params: Params) => {
        this.project_id = params['custId'];
        this.getListOfProposal();
      });
  }

  activatedProposalId:any
  getListOfProposal(){
    this.customerService.getListofProposal(this.project_id).subscribe(
      res=>{
         this.proposal_list = res['proposals'];
         this.activatedProposalId = this.proposal_list[0].id;
         this.showProposalDoc(this.proposal_list[0].id)

      },
      err=>{
        

      }
      );
  }
  files_count = [];
  ActivateTab(tab){
    $(".pill-tab").removeClass("active");
    $("."+tab).addClass("active");
    this.activeTab = tab;
    if(tab == "meet"){
      this.customerService.getTeam(this.project_id).subscribe(
        res => {
          this.team = res;
        },
        err => {
          
        });
    }

    else if (tab == "calls") {
      this.customerService.getScheduledEvents(this.project_id).subscribe(
        res => {
          this.scheduledEvents = res.events;
        },
        err => {
          
        });
    }
    else if (tab == "files") {
      this.customerService.getSharedBoqs(this.project_id).subscribe(
        res => {
          this.sharedFiles = res.boq_and_ppt_uploads;
          
        },
        err => {
          
        });
    }
  }
  month:any;
  day:any;
  year:any
  // Disable calender date
  disableDate(){
    var datep = $('#txtDate').val();

    var dtToday = new Date();
      
     this.month = dtToday.getMonth() + 1;
     this.day = dtToday.getDate();
     this.year = dtToday.getFullYear();
    if(this.month < 10)
        this.month = '0' + this.month.toString();
    if(this.day < 10)
        this.day = '0' + this.day.toString();
    
    var maxDate = this.year + '-' + this.month + '-' + this.day;
    $('#txtDate').attr('min', maxDate);
    if (datep < maxDate) {
      alert("selected date is in past");
      $('#txtDate').val(maxDate);
    }

  }

  showProposalDoc(id){
    this.loaderService.display(true);
    $('.proposalBox').removeClass("addShadow");
    $("#proposal-"+id).addClass("addShadow");
    this.activatedProposalId = id;
    this.customerService.getProposalDoc(id).subscribe(
      res => {
        this.proposal_detail = res['proposal'];
        this.proposal_boq_list = res['proposal']['proposed_quotations'];
        this.proposal_ppt_list = res['proposal']['proposesd_presentations'];
        this.loaderService.display(false);
      },
      err => {
        
      });
  }

  activated_doc_id:any;
  setProposedDocId(doc_id){
    this.activated_doc_id = doc_id;
  }

  approveBoq(){
    this.boqApproval(this.activated_doc_id, true);
  }

  boqApproval(doc_id, status){
    this.approvalForm.patchValue({proposal_doc_id: doc_id});
    this.approvalForm.patchValue({is_approved: status});

    this.customerService.boqApproval(this.approvalForm.value).subscribe(
      res => {
        this.showProposalDoc(this.activatedProposalId);
        $("#approvalModal").modal("hide");
      },
      err => {
        
      });
  }

  schedule(formVal){
    this.cForm.patchValue({project_id: this.project_id});

    var datetimeObj = new Date(formVal.date+' '+formVal.time);
    this.cForm.patchValue({scheduled_at: datetimeObj});

    this.customerService.scheduleMeeting(this.cForm.value).subscribe(
      res => {
        $('.designername').html(res.event.designers);
        $('.meetingdate').html(res.event.datetime);
        $('.meetingtime').html(res.event.datetime);
        $(".scheduledModal").modal("show");
        this.cForm.reset();
      },
      err => {
        
      });
  }

  exportPPT(presentation){
    this.fetchPresentation(presentation['id']);

    

    // pptx.setLayout('LAYOUT_WIDE');
    // LAYOUT_16x9  Yes  10 x 5.625 inches
    // LAYOUT_16x10  No  10 x 6.25 inches
    // LAYOUT_4x3  No  10 x 7.5 inches
    // LAYOUT_WIDE  No  13.3 x 7.5 inches
    // LAYOUT_USER  No  user defined - see below (inches)

    // for(var key in this.canvasMap)
    //  {
    //     var slide = pptx.addNewSlide();
    //     slide.addImage(
    //       { 
    //         x:'0%', 
    //         y:'0%',
    //         w:'100%',
    //         h:'100%',
    //         data:this.canvasMap[key].toDataURL('png')
    //       });
    //  }
    //  pptx.save();
  }

  fetchPresentation(ppt_id){
    this.presentationService.fetchPresentation(this.project_id,ppt_id).subscribe(
      res => {

        var pptx = new PptxGenJS();
        pptx.setAuthor('Arrivae');
        pptx.setCompany('Arrivae');
        pptx.setRevision('15');
        pptx.setSubject('Arrivae');
        pptx.setTitle('Arrivae');

        pptx.setLayout({ name:'Arrivae', width:10, height:7.5 });

        for(var key of res['presentation']['slides'])
         {
            var slide = pptx.addNewSlide();
            slide.addImage(
              { 
                x:'0%', 
                y:'0%',
                w:'100%',
                h:'100%',
                data:key['data'].toDataURL('png')
              });
         }
         pptx.save();
      },
      err => {

      });
  }
}
