import { Component, OnInit ,Input,ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { CategoryService } from '../category.service';
import { LoaderService } from '../../../../services/loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
 selector: 'app-material-tracking',
 templateUrl: './material-tracking.component.html',
 styleUrls: ['./material-tracking.component.css'],
 providers: [ CategoryService ]
})
export class MaterialTrackingComponent implements OnInit {

  /* Declaring data members */

  @Input() line_item_check: any;
  viewHistorySelectedId=0;
  po_release_list:any = [];
  po_all_list:any = [];
  selectedTab = 'QualityCheck';
  quotation_id:string;
  po_number:any;
  po_date:any;
  poobj:any;
  line_item_check_material;
  fileUploadStatus='Upload QC Report';
  selectedMoment = new Date( );
  
  uploadFileList=[];
  minDate= new Date();
  sliSelectedId=[];
  selectedSLI=[]
  errorMessage='';
  historyList=[];
  isNewBillingAddress = false;
  isNewShippingAddress = false;
  showBillAddress = false;
  showShipAddress=false;

  showAddNewShippingAddressText=true;
  showAddNewBillingAddressText=true;
  fileToUpload:any;
  errorAlert= false;
  successAlert = false;
  successMessage='';


  /* Declaring Form Groups for different modals/view */
  scheduleQC = new FormGroup({  //for Scheduling QC
    // qcReadinessRemark: new FormControl(),
    scheduleQCRemark: new FormControl()
  });

  // select boxes in PO List 
  selectAllCheckbox = new FormGroup({  
    selectAllSli : new FormControl()
  });

  sliCheckBoxes = new FormGroup({});

  //raise Dispatch Date
  raiseDispatchDateForm = new FormGroup({ 
    dispatchDate: new FormControl('',[Validators.required]),
    upload: new FormControl(),
    savedBillingAddress: new FormControl(),
    siteWarehouse: new FormControl(),
    remarks: new FormControl(),
    billingAddress: new FormControl(),
    billingContactName: new FormControl(),
    billingContactNumber: new FormControl(),
    shippingAddress: new FormControl(),
    shippingContactName: new FormControl(),
    shippingContactNumber: new FormControl(),
    sameAddress: new FormControl(),
    selectedSavedShippingAddress: new FormControl(),
    selectedSavedBillingAddress: new FormControl()
  })
  //Complete QC
  completeQCForm= new FormGroup({
    upload: new FormControl()
  })
  //Partial Dispatch
  partialDispatchForm = new FormGroup({
    itemDescription: new FormControl('',Validators.required),
    itemBalance: new FormControl('',[Validators.required,Validators.min(0)])
  })
  //Partial Delivery
  partialDeliveryForm = new FormGroup({
    itemDescription: new FormControl('',Validators.required),
    itemBalance: new FormControl('',Validators.required)
  })
  // Dispatch Readiness
  dispatchReadinessForm = new FormGroup({
    qcReadinessRemark: new FormControl('')
  })

  //Using hardcoded values for saved address (Infact this should be provided by a service endpoint)
  shippingAddressList=[
    {
      addressName: 'Select Saved Address',
      address: null,
      contactName: null,
      contactNumber: null,
      default: true
    },
    {
      addressName: "Arrivae Store",
      contactNumber: "9900234020",
      contactName: "Vinay R",
      address:"Arrivae Factory Lakhs Modular Furniture,Herohalli Cross, Magadi Main Road, Bangalore 560091",
      default:false
    },
    {
      addressName: "Arrivae Warehouse",
      contactNumber: "9833950750",
      contactName:"Rajeev Jha",
      address:"Arrivae Warehouse, Boxmyspace, Bldg no. A-6, Gala no 8 to 11,Harihar Compound, Mankoli Naka,Mumbai Nashik Highway, Bhiwandi 421302",
      default:false
    },
    {
      addressName: "Bengaluru Warehouse",
      contactNumber: "9743258596",
      contactName:"Abhijith",
      address: "88/89, Basement, Muthuraya Swamy Layout, P&T Colony, Telephone Employees Layout, Sunkadakatte, Colony, Telephone Employees Layout,Sunkadakatte,Karnataka 560091",
      default:false
    },
    {
      addressName: "Pune Warehouse",
      contactNumber: "9975304669",
      contactName:"Jayesh Bhawar",
      address: "Gate no- 467/3, Post Kelevadi, Pune – Bangalore Highway, Near Khed – Shivapur toll plaza, Pune 412213.",
      default:false
    },
    {
      addressName: "ANDHERI EC  (For Hardware and LF)",
      contactNumber: "",
      contactName:"",
      address: "B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 ",
      default:false
    },
    {
      addressName: "RAWAT BROTHERS FURNITURE PVT. LTD, (For Raw Material)",
      contactNumber: "9130606486",
      contactName:"Laxman",
      address: "Shri Shankar Udyog, Gat No. 486/ 487, Village Kelawade, Tal. Bhor,Pune Bangalore NH4, Dist. Pune - 412213 . GSTIN/UIN: 27AACCR8098J1ZQ",
      default:false
    },
    {
      addressName: "Arrivae Bangalore Factory",
      contactNumber: "9900234020",
      contactName:"Vinay",
      address: "Artiiq Interia, No. 123, Kiadb Industrial Area,1st Phase, Harohalli, Kanakapura, Ramanagara Dist. 562112",
      default:false
    }
    ];

    billingAddressList=[
      {
        addressName: 'Select Saved Address',
        address: null,
        contactName: null,
        contactNumber: null,
        default: true
      },
      {
        addressName: "Arrivae Karnataka",
        contactNumber: "",
        contactName: "",
        address: `SINGULARITY FURNITURE PRIVATE LIMITED,5th Floor, Umiya Business Bay, Tower 2, Cessna Business Park,Vartur Hobli, Outer Ring Road, Kadubeesanahalli, Bengaluru(Bangalore) Urban, Karnataka, 560037,GST Number: 29AAECP3450G1ZF `,
        default:false
      },
      {
        addressName: "Arrivae Maharashtra",
        contactNumber: "",
        contactName:"",
        address:`SINGULARITY FURNITURE PRIVATE LIMITED B 501/502, Everest House Surren Road, Gundavali, Andheri East, Mumbai, Maharashtra 400093 GST Number: 27AAECP3450G1ZJ`,
        default:false
      },
      {
        addressName: "Arrivae Tamil Nadu",
        contactNumber: "",
        contactName: "",
        address:`SINGULARITY FURNITURE PRIVATE LIMITED, 26B, Bharati Villas Jawaharlal Nehru Salai, Ekkaduthangal,Guindy Industrial Estate, Chennai, Chennai, Tamil Nadu, 600032,GST Number: 33AAECP3450G1ZQ`,
        default:false
      },
      {
        addressName: "Arrivae Telangana",
        contactNumber: "",
        contactName: "",
        address:` SINGULARITY FURNITURE PRIVATE LIMITED,5th floor, Survey No. 8, Purva Summit, Kondapur Village, WhiteField Road, Opposite Tech Mahindra, Hi-Tech City, Phase-II,Hyderabad, Telangana, 500081,GST Number: 36AAECP3450G1ZK`,
        default:false
      },
      {
        addressName: "Arrivae West Bengal",
        contactNumber: "",
        contactName: "",
        address:`SINGULARITY FURNITURE PRIVATE LIMITED 5, Dharamtolla Street, Kolkata, West Bengal, 700013,GST Number: 19AAECP3450G1ZG`,
        default:false
      },
      {
        addressName: "WFX Technologies",
        contactNumber: "9560915790",
        contactName: "Lokesh",
        address:`WFX Technologies Private Limited, B-13, Infocity-1, Sector-34, Gurugram - 122001, Haryana,GST No. : 06AAACW7299J1ZQ`,
        default:false
      }
      ];
    
    
  constructor(
    private router: Router,
    private loaderService : LoaderService,
    private categoryService:CategoryService,
    private route:ActivatedRoute,
    private ref: ChangeDetectorRef
    ) {}
 
  ngOnInit() { //Angular Life cycle Hook
    
    this.raiseDispatchDateForm.patchValue({
      selectedSavedShippingAddress:0
    }) //setting default for form Element 'selectedSavedShippingAddress'

    this.raiseDispatchDateForm.patchValue({
      selectedSavedBillingAddress:0
    }) //setting default for form Element 'selectedSavedBillingAddress'
    
    this.line_item_check_material = this.line_item_check;
    this.route.params.subscribe(
      params => {
        this.quotation_id = this.line_item_check_material['id'];
      }
    );
    this.fetchReleasePoList(this.quotation_id );
   }
    // Returns list of all quotations
    fetchReleasePoList(quotation_id){
      this.loaderService.display(true);
            this.categoryService.fetchReleasePoList(quotation_id).subscribe(
        res=>{
          //
          this.po_release_list = res.purchase_orders;
          this.loaderService.display(false);
          //this.clubbed_job_elements_ids={};
        },
        err=>{
          //
          this.loaderService.display(false);
        });
    }

    //Returns all list of PO Items
    child_po_list;
    fetchPOList(quotation_id, poobj){
      this.quotation_id=quotation_id;
      this.poobj=poobj
      this.loaderService.display(true);
      this.categoryService.fetchAllPoList(quotation_id,poobj.id).subscribe(
        res=>{
          
          this.child_po_list=res.job_elements[0].child_job_elements;
          this.po_all_list = res.job_elements;
          this.po_number = poobj.reference_no;
          this.po_date = poobj.updated_at;
          this.loaderService.display(false);
          
        },
        err=>{
          this.loaderService.display(false);
        });
      this.selectAllCheckbox.patchValue({selectAllSli:false}) //sets the select all checkbox to false
      $(".expanding-col").css("display", "none");
      $(".expanding-col-"+ this.poobj.id).css("display", "table-row");
      this.selectedSLI=[]; //clearing the selection
      this.sliSelectedId=[]; //clearing the selection
      //this.clubbed_job_elements_ids={};
      
    }

  setSelectedTab(val){
    this.selectedTab = val;
    this.getHistory( this.viewHistorySelectedId)
   }

  /* authored by : Kaartik@Gloify.com */
  //toggles the billingAddress forms in the dom
  showBillingAddress() {
    this.showBillAddress = !this.showBillAddress;
  }

  /* authored by : Kaartik@Gloify.com */
  //toggles the shippingAddress forms in the dom
  showShippingAddress() {
    this.showShipAddress = !this.showShipAddress;
  }
  
  /* authored by : Kaartik@Gloify.com */
   onQCschedulesubmit() {
     //
    //  
    if(this.sliSelectedId.length==0){
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }else
    {
      
      //
      if(this.selectedSLI.every(item=> item.qc_date)){

        this.scheduleQualityControl('rescheduled',this.selectedMoment,this.sliSelectedId,this.scheduleQC.controls["scheduleQCRemark"].value ,[]);
      }else {
        this.scheduleQualityControl('scheduled',this.selectedMoment,this.sliSelectedId,this.scheduleQC.controls["scheduleQCRemark"].value ,[]);
      }
    }
  }
 
 clubbed_job_elements_ids={}
  /* authored by : Kaartik@Gloify.com */
  selectAllSli(event,index){
    
    if(event.target.checked){
      this.po_all_list.forEach(sli => {
        if(this.selectedSLI.indexOf(sli)==-1){
          this.selectedSLI.push(sli);  /* contains sli Object */
          this.sliSelectedId.push(sli.id); /* contains only sli ids */
          this.clubbed_job_elements_ids[sli.id] = sli.clubbed_ids;
      
        }
        if(sli.child_job_elements){
            sli.child_job_elements.forEach(child => {
            if(this.selectedSLI.indexOf(child)==-1){
            this.selectedSLI.push(child); 
            this.sliSelectedId.push(child.id); 
          }
        })
        }
      });
      $('input[name="sli-checkboxes"]').prop("checked",true); /*if select-all checkbox is checked then every sli should be selected*/
    }
    else{
      this.selectedSLI=[]; 
      this.sliSelectedId=[];
      this.clubbed_job_elements_ids={};
      $('input[name="sli-checkboxes"]').prop("checked",false);/*if It is unchecked all the slis should be unchecked*/
    }
  }

  /* authored by : Kaartik@Gloify.com */
  //checks the status of selected sli checkbox and performs respective actions
  selectSLI(event,index,item){

    if(event.target.checked){
      if((this.sliSelectedId.indexOf(item.id)==-1)){
        this.sliSelectedId.push(item.id);
        this.selectedSLI.push(item);
        this.clubbed_job_elements_ids[item.id] = item.clubbed_ids;
      }
    }
    else{
      if((this.sliSelectedId.indexOf(item.id)!=-1)){
        this.sliSelectedId.splice(this.sliSelectedId.indexOf(item.id),1);
        this.selectedSLI.splice(this.selectedSLI.indexOf(item),1);
        delete this.clubbed_job_elements_ids[item.id];
      }
    }

    if(this.selectedSLI.length>0){
      this.selectAllCheckbox.patchValue({
        selectAllSli:true //even if one sli is checked the select all checkbox will be checked as well.
      })
    }else{ //if all the slis are unchecked the select all checkbox should be unchecked as well.
      this.selectAllCheckbox.patchValue({
        selectAllSli:false
      })
    }
    
  }
  
  /* authored by : Kaartik@Gloify.com */
  toggleShowBillingAddress(){
    this.isNewBillingAddress=!this.isNewBillingAddress;
  }

  /* authored by : Kaartik@Gloify.com */
  toggleShowShippingAddress(){
    this.isNewShippingAddress=!this.isNewShippingAddress;
  }

  /* authored by : Kaartik@Gloify.com */
  sameBillShipAddressToggle()
  {
    this.isNewShippingAddress=true;
    this.showAddNewShippingAddressText=false;

    if(this.raiseDispatchDateForm.controls["sameAddress"].value){
      
      let patchAddressData = {
        shippingAddress: this.raiseDispatchDateForm.controls["billingAddress"].value, //fetching values from formcontrol
        shippingContactName: this.raiseDispatchDateForm.controls["billingContactName"].value,
        shippingContactNumber: this.raiseDispatchDateForm.controls["billingContactNumber"].value,
        selectedSavedShippingAddress:0
      }
      this.raiseDispatchDateForm.patchValue(patchAddressData);
      // this.raiseDispatchDateForm.controls["shippingAddress"].disable(); //disables the form i.e read only
      // this.raiseDispatchDateForm.controls["shippingContactName"].disable();
      // this.raiseDispatchDateForm.controls["shippingContactNumber"].disable();
    }
    else{
      let patchAddressData = {
        shippingAddress: null,
        shippingContactName: null,
        shippingContactNumber: null
      }
      this.raiseDispatchDateForm.patchValue(patchAddressData);
      this.raiseDispatchDateForm.controls["shippingAddress"].enable(); //enables it back
      this.raiseDispatchDateForm.controls["shippingContactName"].enable();
      this.raiseDispatchDateForm.controls["shippingContactNumber"].enable();
    }
  }
  /* authored by : Kaartik@Gloify.com */
  setShippingAddress(event){
    this.setAddress(event,'shipping');
  }
  /* authored by : Kaartik@Gloify.com */
  setBillingAddress(event){
    this.setAddress(event,'billing')
  }
  /* authored by : Kaartik@Gloify.com */
  //sets address based on type i.e billing or shipping
  setAddress(event,type){

    this.raiseDispatchDateForm.patchValue({ //uncheck the checkbox if any address is changed ;
      sameAddress:false
    })

    if(type=='shipping'){

    this.isNewShippingAddress=true;
    let addressData=this.shippingAddressList[this.raiseDispatchDateForm.controls["selectedSavedShippingAddress"].value];
    
      let patchAddressData = {
        shippingAddress: addressData.address,
        shippingContactName: addressData.contactName,
        shippingContactNumber: addressData.contactNumber
      }
      this.raiseDispatchDateForm.patchValue(patchAddressData);

    if(addressData.default){
      this.showAddNewShippingAddressText=true;
      this.isNewShippingAddress=false;
      this.raiseDispatchDateForm.controls["shippingAddress"].enable();
      this.raiseDispatchDateForm.controls["shippingContactName"].enable();
      this.raiseDispatchDateForm.controls["shippingContactNumber"].enable();
    }
    else{
      // this.raiseDispatchDateForm.controls["shippingAddress"].disable();
      // this.raiseDispatchDateForm.controls["shippingContactName"].disable();
      // this.raiseDispatchDateForm.controls["shippingContactNumber"].disable();
      this.showAddNewShippingAddressText=false;
    }
  }
  else if(type=='billing'){
    
    this.isNewBillingAddress=true;
    let addressData=this.billingAddressList[this.raiseDispatchDateForm.controls["selectedSavedBillingAddress"].value];
    
      let patchAddressData = {
        billingAddress: addressData.address,
        billingContactName: addressData.contactName,
        billingContactNumber: addressData.contactNumber
      }
      this.raiseDispatchDateForm.patchValue(patchAddressData);

    //
    if(addressData.default){
      this.showAddNewBillingAddressText=true;
      this.isNewBillingAddress=false;
      this.raiseDispatchDateForm.controls["billingAddress"].enable();
      this.raiseDispatchDateForm.controls["billingContactName"].enable();
      this.raiseDispatchDateForm.controls["billingContactNumber"].enable();
    }
    else{
      // this.raiseDispatchDateForm.controls["billingAddress"].disable();
      // this.raiseDispatchDateForm.controls["billingContactName"].disable();
      // this.raiseDispatchDateForm.controls["billingContactNumber"].disable();
      this.showAddNewBillingAddressText=false;
    }
  }
}

  /* authored by : Kaartik@Gloify.com */
  scheduleQualityControl(status,scheduledDate,itemList,remarks,files){
    let statusOfFirstItem = this.selectedSLI[0].qc_status; //getting the status of the first element in the list 
    let shouldSchedule = this.selectedSLI.every(sli=>sli.qc_status==statusOfFirstItem);
    if(this.sliSelectedId.length>0){
      
      
    if(shouldSchedule){ //if there are more than one distinct status in the sli list  then user is redirected to error message.
      this.loaderService.display(true);
      this.categoryService.scheduleQC(status,scheduledDate,itemList,remarks,files,this.clubbed_job_elements_ids).subscribe(
      res=>{
        this.successAlert = true;
        this.successMessage = res.message;; 
        this.refreshPOList();
        setTimeout(()=>this.successAlert=false,5000); //both success and error message will be only shown for 5 seconds. 
      },
      error=>{
        this.errorAlert=true;
        this.errorMessage=error;
        setTimeout(()=>this.errorAlert=false,5000);
      }
    )
    }else{
      console.warn('The selected items have different status');
      this.errorMessage='The selected items have different qc statuses.';
      this.errorAlert=true;
    }}else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
    this.loaderService.display(false);
    if(status=='rescheduled'){
      //Do Nothing
    }else{
      this.resetAllFormValues();
    }
    this.selectedMoment=new Date();
  }

/* authored by : Kaartik@Gloify.com */
  saveDispatchReadinessDate(itemList,date,remarks){
    this.loaderService.display(true);
    if(this.sliSelectedId.length>0){
    this.categoryService.saveDispatchReadinessDate(itemList,date,remarks,this.clubbed_job_elements_ids).subscribe(
      res=>{
        this.successAlert=true;
        this.successMessage=res.message;
        setTimeout(()=>this.successAlert=false,5000);
        this.refreshPOList();
      },
      error=>{
        this.errorAlert=true;
        this.errorMessage=error.message;
        setTimeout(()=>this.errorAlert=false,5000);
      }
    )}
    else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
    this.loaderService.display(false);
    this.resetAllFormValues(); //this resets all the form values in all the forms except RaiseDispatchDateForm
    this.selectedMoment=new Date();
  }
 /* authored by : Kaartik@Gloify.com */
  cancelQC(){
    if(this.sliSelectedId.length>0){
      this.scheduleQualityControl('cancelled',"",this.sliSelectedId,"","");
    }
    else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
  }

/* authored by : Kaartik@Gloify.com */
  noQCneeded(){
    if(this.sliSelectedId.length>0){
      this.scheduleQualityControl('not_needed',"",this.sliSelectedId,"",[]);   
      this.loaderService.display(true);
    }else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
    this.loaderService.display(false);
  }
/* authored by : Kaartik@Gloify.com */
  completeQC(){
  
    if(this.sliSelectedId.length>0){
    // this.scheduleQualityControl('Completed',"",this.sliSelectedId,"",[{attachment:this.completeQCForm.controls['upload'].value.value,file_name:this.completeQCForm.controls['upload'].value.fileName}]);
    if(this.completeQCForm.controls['upload'].value){
      this.scheduleQualityControl('completed',"",this.sliSelectedId,"",this.completeQCForm.controls['upload'].value.fileList);
    }else{
      this.scheduleQualityControl('completed',"",this.sliSelectedId,"",[]);
    }
    }else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
  }
/* authored by : Kaartik@Gloify.com */
  saveDispatchReadiness( ){
    if(this.sliSelectedId.length>0){
    this.saveDispatchReadinessDate(this.sliSelectedId,this.selectedMoment,this.dispatchReadinessForm.controls["qcReadinessRemark"].value);
    
    }else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
  }
/* authored by : Kaartik@Gloify.com */
  raiseDispatchDate(dispatchedBy){
    if(this.sliSelectedId.length>0){
    let scheduleDate =this.raiseDispatchDateForm.controls["dispatchDate"].value;
    let status="scheduled";
    let site =this.raiseDispatchDateForm.controls["siteWarehouse"].value;
    let billingAddress =this.raiseDispatchDateForm.controls["billingAddress"].value;
    let shippingAddress =this.raiseDispatchDateForm.controls["shippingAddress"].value;
    let remarks =this.raiseDispatchDateForm.controls["remarks"].value;
    let dispatchedItems: "";
    let pendingItems: "";
    let files;
    if(this.raiseDispatchDateForm.controls["upload"].value){
      files = this.raiseDispatchDateForm.controls["upload"].value.fileList;
    }else{
      files=[];
    }
    this.loaderService.display(true);
    this.categoryService.saveDispatchScheduleDate(this.sliSelectedId,status,dispatchedBy,scheduleDate,site,billingAddress,shippingAddress,remarks,dispatchedItems,pendingItems,files,this.clubbed_job_elements_ids).subscribe(
      res=>{
        this.successAlert=true;
        this.successMessage=res.message;
        this.refreshPOList();
        setTimeout(()=>this.successAlert=false,5000);
      },
      error=>{
        this.errorAlert=true;
        this.errorMessage=error;
        setTimeout(()=>this.errorAlert=false,5000);
        //
      }
    )}
    else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
    this.loaderService.display(false);
    this.raiseDispatchDateForm.patchValue({
      dispatchDate: new Date(),
      upload: null,
      savedBillingAddress: null,
      siteWarehouse: null,
      remarks: null,
      billingAddress: null,
      billingContactName: null,
      billingContactNumber: null,
      shippingAddress: null,
      shippingContactName: null,
      shippingContactNumber: null,
      sameAddress: null,
     })
    
    this.raiseDispatchDateForm.patchValue({
      selectedSavedShippingAddress:0
    }) //setting default for form Element 'selectedSavedShippingAddress'

    this.raiseDispatchDateForm.patchValue({
      selectedSavedBillingAddress:0
    }) //setting default for form Element 'selectedSavedBillingAddress'
    
    this.isNewBillingAddress=false;
    this.showAddNewBillingAddressText=true;
    this.isNewShippingAddress=false;
    this.showAddNewShippingAddressText=true;

    }
  
  /* authored by : Kaartik@Gloify.com */
  dispatchItems(dispatchedBy,status){
    // 
    if(this.sliSelectedId.length>0){
    this.loaderService.display(true); // starts showing the loader
    this.categoryService.saveDispatchScheduleDate(this.sliSelectedId,status,dispatchedBy,new Date(),"","","","",this.partialDispatchForm.controls["itemDescription"].value,this.partialDispatchForm.controls["itemBalance"].value,[],this.clubbed_job_elements_ids).subscribe(
      res=>{
        this.successAlert=true;
        this.successMessage=res.message;
        setTimeout(()=>this.successAlert=false,5000);
        this.refreshPOList();
      },
      error=>{
        this.errorAlert=true;
        this.errorMessage=error;
        setTimeout(()=>this.errorAlert=false,5000);
      }
    )
    this.loaderService.display(false); //removes the loader
    }else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
    ($('#partialModal')as any).modal('hide'); //hiding the modal using Jquery as data-dismiss does not work for ngSubmit so we have to attach onClick event to it,Have a look at the template.
    ($('#partialArrivaeModal')as any).modal('hide');

    this.resetAllFormValues();
  }

 /* authored by : Kaartik@Gloify.com */
  completeDelivery(status){
    if(this.sliSelectedId.length>0){
      this.loaderService.display(true);
      this.categoryService.deliverItems(this.sliSelectedId,status,this.partialDeliveryForm.controls["itemDescription"].value,this.partialDeliveryForm.controls["itemBalance"].value,this.clubbed_job_elements_ids).subscribe(
        res=>{
          this.successAlert=true;
          this.successMessage=res.message;
          setTimeout(()=>this.successAlert=false,5000);
          this.ref.detectChanges();
          this.refreshPOList();
        },
        error=>{
          this.errorAlert=true;
          this.errorMessage=error;
          setTimeout(()=>this.errorAlert=false,5000);
        }
      )
      this.loaderService.display(false);
    }else{
      this.errorMessage='Please select atleast one SLI .'
      this.errorAlert=true;
      setTimeout(()=>this.errorAlert=false,5000);
    }
    ($('#PartialDelivery')as any).modal('hide');
    this.resetAllFormValues();
  }

  /* authored by : Kaartik@Gloify.com */
  resetAllFormValues(){
    this.scheduleQC.reset();
    this.completeQCForm.reset();
    this.partialDispatchForm.reset();
    this.completeQCForm.get('upload').setValue(null);
    this.partialDeliveryForm.reset();
    this.dispatchReadinessForm.reset();
    this.minDate= new Date();
  }

  /* authored by : Kaartik@Gloify.com */
  removeErrorMessage(){ 
    this.errorAlert=false;
  }

  /* authored by : Kaartik@Gloify.com */
  removeSuccessMessage(){
    this.successAlert=false;
  }

  /* authored by : Kaartik@Gloify.com */
  getHistory(id){
    this.viewHistorySelectedId=id;
    this.viewHistory(id);
  }

  /* authored by : Kaartik@Gloify.com */
  viewHistory(id){
    this.loaderService.display(true);
    this.categoryService.viewHistory(id,this.selectedTab).subscribe(
      res=>{
        this.historyList=res.history;
        //
      },
      error=>{
        this.errorAlert=true;
        this.errorMessage=error;
        setTimeout(()=>this.errorAlert=false,5000);
        //
      }
    )
    this.loaderService.display(false);
    }
  

  /* authored by : Kaartik@Gloify.com */
  //onChange of file Input
  onFileChange(event,feature) {

    this.uploadFileList=[];
    this.fileUploadStatus='Upload QC Report'

    //if the only one file is uploaded then the name of while is used else the number of files uuploaded are shown.
    if(event.target.files.length>1){ 
      this.fileUploadStatus=event.target.files.length + ' Files were Uploaded.' ;
    }else{
      this.fileUploadStatus=event.target.files[0].name;
    }
    
    if(event.target.files && event.target.files.length > 0) {
      for(let file of event.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.uploadFileList.push({
          file_name: file.name,
          attachment: (<string>reader.result)
        })
        }
      };
      let fileList = this.uploadFileList;

      if(feature=='completeQC'){
        this.completeQCForm.get('upload').setValue({fileList});
      }else if(feature=='raiseDispatchDate'){
        this.raiseDispatchDateForm.get('upload').setValue({fileList});}
      }
    }

    /* authored by : Kaartik@Gloify.com */
    onDispatchFileChange($event){
      this.onFileChange($event,'raiseDispatchDate');
    }

    /* authored by : Kaartik@Gloify.com */
    setDefaultFileUploadStatus(type){
      if(type=='qc_report'){
        this.fileUploadStatus='Upload QC Report';
      }else if(type=='packing_list'){
        this.fileUploadStatus='Upload Packing List';
      }
    }

    /* authored by : Kaartik@Gloify.com */
    //When the details of slis are updated the table should update as well thus the before function was created.
    refreshPOList(){
      this.loaderService.display(true);
      this.categoryService.fetchAllPoList(this.quotation_id,this.poobj.id).subscribe(
        res=>{
          
          this.child_po_list=res.job_elements.child_job_elements;
          this.po_all_list = res.job_elements;
          this.po_number = this.poobj.reference_no;
          this.po_date = this.poobj.updated_at;
          this.selectAllCheckbox.patchValue({selectAllSli:false}); //when the PO list is updated the select all checkbox is unchecked as well, As we cannot save the state of the checkboxes of slis 
                                                                  //as they are dynamically created
          this.ref.detectChanges(); //for angular to detect changes in the List 
        },
        err=>{
        });
        this.sliSelectedId=[];
        this.selectedSLI=[];
        this.loaderService.display(false);
        this.clubbed_job_elements_ids={};
      }

      /* authored by : Kaartik@Gloify.com */
      rescheduleDefaultValues(){ //default values for rescheduling
        if(this.sliSelectedId.length==1 ){ //these default values are only neede when the seleted slis count is one.
          this.scheduleQC.patchValue({
            scheduleQCRemark:this.selectedSLI[0].qc_remarks
          })
          this.selectedMoment=new Date(Date.parse(this.selectedSLI[0].qc_date)) || new Date();
        }
      }
      /* authored by : Kaartik@Gloify.com */
      downloadQCReport(){
        //TODO
      } 

      downloadPackingList(){
        //TODO
      }
      
}
