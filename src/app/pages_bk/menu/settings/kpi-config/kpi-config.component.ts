import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-kpi-config',
  templateUrl: './kpi-config.component.html',
  styleUrls: ['./kpi-config.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KpiConfigComponent implements OnInit {

  breadCrumbItems!: Array<{}>;
  Id: string = '';
  publisherList: any[] = [];
  kpiConfigList: any[] = [];
  kpiConfigFormField: any[] = [
    { title: 'Overall Perfomance', id: 'overallPerfomance' },
    { title: 'Schedule', id: 'schedule' },
    { title: 'Quality', id: 'quality' },
    { title: 'Communication', id: 'communication' },
    { title: 'Customer Satisfaction', id: 'customerSatisfaction' },
    { title: 'Account Management', id: 'accountManagement' },
    { title: 'RFT', id: 'rft' },
    { title: 'Publication Speed', id: 'publicationSpeed' },
    { title: 'Feedback', id: 'feedback' },
    { title: 'Author Satisfication', id: 'authorsatisfication' }
  ];

  selectedKPIConfig: any;
  kpiConfigLength: number = 0;
  searchTerm: string = "";
  currentPage: number = 1;
  pagedItems: any[] = [];
  pageSizeOptions: number[] = [4, 8, -1];
  pageSize: number = this.pageSizeOptions[0];
  pages: number[] = [];
  startIndex: number = 0;
  endIndex: number = 0;
  menuAccess: any = {
    canView: false,
    canAdd: false,
    canUpdate: false,
    canDelete: false
  }
  idForEdit: number = 0;
  selectedPub!: boolean;
  isDuplicate!: boolean;
  //anyChBoxChecked!:boolean;

  constructor(private apiService: ApiService, private sweetAlert: SweetAlertService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showLoader();
    }, 100);

    this.breadCrumbItems = [
      { label: 'Settings', active: true },
      { label: 'KPI Config', active: true }
    ];

    this.getKPIConfigData();
    this.getPublishers();
    this.crudAccess();
    setTimeout(() => {
      this.closeLoader();
    }, 2000);

  }

  crudAccess(): void {
    let roleName = sessionStorage.getItem('userRole');


    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${roleName}&parentmenuid=9&childmenuid=54`).subscribe(
      (response) => {
        this.menuAccess.canView = response.canview;
        this.menuAccess.canAdd = response.caninsert;
        this.menuAccess.canUpdate = response.canupdate;
        this.menuAccess.canDelete = response.candelete;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getPublishers(): void {
    this.apiService.GetDataWithToken('User/getpublisher').subscribe(
      (list) => {
        this.publisherList = list.data;
        console.log(this.publisherList);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  getKPIConfigData(): void {
    this.apiService.GetDataWithToken('PublisherConfig/Display').subscribe(
      (Response) => {
        this.kpiConfigList = Response.data;
        this.kpiConfigLength = this.kpiConfigList.length;
        if (this.kpiConfigLength < 4) {
          this.pageSizeOptions = [-1];
        }
        else if (this.kpiConfigLength < 8) {
          this.pageSizeOptions = [4, -1]
        }
        else if (this.kpiConfigLength > 8) {
          this.pageSizeOptions = [4, 8, -1]
        }
        this.pagedItems = this.filteredItems();
        this.calculatePages();
        console.log(this.kpiConfigList);
        console.log(this.pages);
      },
      (error) => {
        console.error('Error:', error);
      }
    );

  }

  add(id: any) {
    //this.selectedPub = true;
    $('#publisher').val('');
    let Fields = this.kpiConfigFormField;

    for (let field of Fields) {

      //$(`#${field.id}Action`).css('border', 'none');
      //$(`#${field.id}Metrics`).css('border', 'none');

    }
    this.clearForm();
    //id = parseInt(id);
    $('#addUpdatePopUp').modal('show');
    $(`#publisher`).prop('disabled', false);

  }

  edit(id: any, idforEdit: any) {
    //this.selectedPub = true;
    console.log('edit triggered');
    $(`#publisher`).prop('disabled', true);
    let Fields = this.kpiConfigFormField;

    for (let field of Fields) {

      //$(`#${field.id}Action`).css('border', 'none');
      //$(`#${field.id}Metrics`).css('border', 'none');

    }
    //this.clearForm();
    id = parseInt(id);
    idforEdit = parseInt(idforEdit);
    this.idForEdit = idforEdit;
    $('#addUpdatePopUp').modal('show');
    this.Id = id;
    this.getConfigDataById(id);
  }

  // getConfigDataById(id: any) {
  //   this.apiService.GetDataWithToken(`PublisherConfig/DisplayById/${id}`).subscribe(
  //     (Response) => {
  //       $(`#publisher`).prop('disabled', true);
  //       $(`#publisher`).val(`${Response.data.publisherId}`);
  //       console.log(Response.data.publisherId)
  //       $('#overallPerfomanceRequired').prop('checked', Response.data.overallPerfomanceRequired);
  //       $('#scheduleRequired').prop('checked', Response.data.scheduleRequired);
  //       $('#qualityRequired').prop('checked', Response.data.qualityRequired);
  //       $('#communicationRequired').prop('checked', Response.data.communicationRequired);
  //       $('#customerSatisfactionRequired').prop('checked', Response.data.customerSatisfactionRequired);
  //       $('#accountManagementRequired').prop('checked', Response.data.accountManagementRequired);
  //       $('#rftRequired').prop('checked', Response.data.rftRequired);
  //       $('#publicationSpeedRequired').prop('checked', Response.data.publicationSpeedRequired);
  //       $('#feedbackRequired').prop('checked', Response.data.feedbackRequired);
  //       $('#authorsatisficationRequired').prop('checked', Response.data.authorsatisficationRequired);
  //       $('#overallPerfomanceMetrics').val(Response.data.overallPerfomanceMetrics === null ? '' : Response.data.overallPerfomanceMetrics);
  //       $('#scheduleMetrics').val(Response.data.scheduleMetrics === null ? '' : Response.data.scheduleMetrics);
  //       $('#qualityMetrics').val(Response.data.qualityMetrics === null ? '' : Response.data.qualityMetrics);
  //       $('#communicationMetrics').val(Response.data.communicationMetrics === null ? '' : Response.data.communicationMetrics);
  //       $('#customerSatisfactionMetrics').val(Response.data.customerSatisfactionMetrics === null ? '' : Response.data.customerSatisfactionMetrics);
  //       $('#accountManagementMetrics').val(Response.data.accountManagementMetrics === null ? '' : Response.data.accountManagementMetrics);
  //       $('#rftMetrics').val(Response.data.rftMetrics === null ? '' : Response.data.rftMetrics);
  //       $('#publicationSpeedMetrics').val(Response.data.publicationSpeedMetrics === null ? '' : Response.data.publicationSpeedMetrics);
  //       $('#feedbackMetrics').val(Response.data.feedbackMetrics === null ? '' : Response.data.feedbackMetrics);
  //       $('#authorsatisficationMetrics').val(Response.data.authorsatisficationMetrics === null ? '' : Response.data.authorsatisficationMetrics);
  //       $('#overallPerfomanceAction').val(`${Response.data.overallPerfomanceAction}`);
  //       $('#scheduleAction').val(`${Response.data.scheduleAction}`);
  //       $('#qualityAction').val(`${Response.data.qualityAction}`);
  //       $('#communicationAction').val(`${Response.data.communicationAction}`);
  //       $('#customerSatisfactionAction').val(`${Response.data.customerSatisfactionAction}`);
  //       $('#accountManagementAction').val(`${Response.data.accountManagementAction}`);
  //       $('#rftAction').val(`${Response.data.rftAction}`);
  //       $('#publicationSpeedAction').val(`${Response.data.publicationSpeedAction}`);
  //       $('#feedbackAction').val(`${Response.data.feedbackAction}`);
  //       $('#authorsatisficationAction').val(`${Response.data.authorsatisficationAction}`);
  //       $('#publisher').val(`${Response.data.publisherName}`);
  //       this.selectedKPIConfig = Response.data;
  //       console.log(Response.data);
  //     },
  //     (error) => {
  //       console.error('Error:', error);
  //     }
  //   );
  // }

  getConfigDataById(id: any) {
    this.apiService.GetDataWithToken(`PublisherConfig/DisplayById/${id}`).subscribe(
      (Response) => {
        $(`#publisher`).prop('disabled', true);
        $('#publisher').val(`${Response.data.publisherId}`);
        console.log(Response.data.publisherId)
        $('#overallPerfomanceRequired').prop('checked', Response.data.overallPerfomanceRequired);
        $('#scheduleRequired').prop('checked', Response.data.scheduleRequired);
        $('#qualityRequired').prop('checked', Response.data.qualityRequired);
        $('#communicationRequired').prop('checked', Response.data.communicationRequired);
        $('#customerSatisfactionRequired').prop('checked', Response.data.customerSatisfactionRequired);
        $('#accountManagementRequired').prop('checked', Response.data.accountManagementRequired);
        $('#rftRequired').prop('checked', Response.data.rftRequired);
        $('#publicationSpeedRequired').prop('checked', Response.data.publicationSpeedRequired);
        $('#feedbackRequired').prop('checked', Response.data.feedbackRequired);
        $('#authorsatisficationRequired').prop('checked', Response.data.authorsatisficationRequired);
        $('#overallPerfomanceMetrics').val(Response.data.overallPerfomanceMetrics === null ? '' : Response.data.overallPerfomanceMetrics);
        $('#scheduleMetrics').val(Response.data.scheduleMetrics === null ? '' : Response.data.scheduleMetrics);
        $('#qualityMetrics').val(Response.data.qualityMetrics === null ? '' : Response.data.qualityMetrics);
        $('#communicationMetrics').val(Response.data.communicationMetrics === null ? '' : Response.data.communicationMetrics);
        $('#customerSatisfactionMetrics').val(Response.data.customerSatisfactionMetrics === null ? '' : Response.data.customerSatisfactionMetrics);
        $('#accountManagementMetrics').val(Response.data.accountManagementMetrics === null ? '' : Response.data.accountManagementMetrics);
        $('#rftMetrics').val(Response.data.rftMetrics === null ? '' : Response.data.rftMetrics);
        $('#publicationSpeedMetrics').val(Response.data.publicationSpeedMetrics === null ? '' : Response.data.publicationSpeedMetrics);
        $('#feedbackMetrics').val(Response.data.feedbackMetrics === null ? '' : Response.data.feedbackMetrics);
        $('#authorsatisficationMetrics').val(Response.data.authorsatisficationMetrics === null ? '' : Response.data.authorsatisficationMetrics);
        $('#overallPerfomanceAction').val(`${Response.data.overallPerfomanceAction}`);
        $('#scheduleAction').val(`${Response.data.scheduleAction}`);
        $('#qualityAction').val(`${Response.data.qualityAction}`);
        $('#communicationAction').val(`${Response.data.communicationAction}`);
        $('#customerSatisfactionAction').val(`${Response.data.customerSatisfactionAction}`);
        $('#accountManagementAction').val(`${Response.data.accountManagementAction}`);
        $('#rftAction').val(`${Response.data.rftAction}`);
        $('#publicationSpeedAction').val(`${Response.data.publicationSpeedAction}`);
        $('#feedbackAction').val(`${Response.data.feedbackAction}`);
        $('#authorsatisficationAction').val(`${Response.data.authorsatisficationAction}`);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  showaddUpdatePopUp(id: any) {
    this.Id = id;
    //this.clearForm();
    $('#addUpdatePopUp').modal('show');
  }

  hideaddUpdatePopUpp() {
    this.selectedKPIConfig = null;
    this.clearForm();
    $('#addUpdatePopUp').modal('hide');
  }

  onChangePublisher() {
    let publisher = $('#publisher').val();
    //this.selectedPub = false;
    this.isDuplicate = this.kpiConfigList.some(obj => obj.publisherId == publisher);
    //$('#submitBtn').prop('disabled', this.isDuplicate);
    if (this.isDuplicate) {
      $(`#publisher`).css('outline', '0.5px solid red');
    }
    else if (!this.isDuplicate) {
      $(`#publisher`).css('outline', '0.5px solid grey');
    }
    console.log(publisher + " duplicate is " + this.isDuplicate);
  }

  addKpiConfig() {
    console.log('insert kpi triggered');
    let pubId = parseInt($('#publisher').val());
    let pubName = this.publisherList.find(item => item.id == pubId);
    console.log(" pubId " + pubId);
    console.log(" publisherName " + pubName);
    let biPublisherConfig = {
      publisherId: pubId,
      publisherName: pubName.acronym,
      overallPerfomanceRequired: $('#overallPerfomanceRequired').is(':checked'),
      scheduleRequired: $('#scheduleRequired').is(':checked'),
      qualityRequired: $('#qualityRequired').is(':checked'),
      communicationRequired: $('#communicationRequired').is(':checked'),
      customerSatisfactionRequired: $('#customerSatisfactionRequired').is(':checked'),
      accountManagementRequired: $('#accountManagementRequired').is(':checked'),
      rftRequired: $('#rftRequired').is(':checked'),
      publicationSpeedRequired: $('#publicationSpeedRequired').is(':checked'),
      feedbackRequired: $('#feedbackRequired').is(':checked'),
      authorsatisficationRequired: $('#authorsatisficationRequired').is(':checked'),
      overallPerfomanceMetrics: $('#overallPerfomanceMetrics').val() == "" ? "0" : $('#overallPerfomanceMetrics').val(),
      scheduleMetrics: $('#scheduleMetrics').val() == "" ? "0" : $('#scheduleMetrics').val(),
      qualityMetrics: $('#qualityMetrics').val() == "" ? "0" : $('#qualityMetrics').val(),
      communicationMetrics: $('#communicationMetrics').val() == "" ? "0" : $('#communicationMetrics').val(),
      customerSatisfactionMetrics: $('#customerSatisfactionMetrics').val() == "" ? "0" : $('#customerSatisfactionMetrics').val(),
      accountManagementMetrics: $('#accountManagementMetrics').val() == "" ? "0" : $('#accountManagementMetrics').val(),
      rftMetrics: $('#rftMetrics').val() == "" ? "0" : $('#rftMetrics').val(),
      publicationSpeedMetrics: $('#publicationSpeedMetrics').val() == "" ? "0" : $('#publicationSpeedMetrics').val(),
      feedbackMetrics: $('#feedbackMetrics').val() == "" ? "0" : $('#feedbackMetrics').val(),
      authorsatisficationMetrics: $('#authorsatisficationMetrics').val() == "" ? "0" : $('#authorsatisficationMetrics').val(),
      overallPerfomanceAction: $('#overallPerfomanceAction').val() == null ? 'no' : $('#overallPerfomanceAction').val(),
      scheduleAction: $('#scheduleAction').val() == null ? 'no' : $('#scheduleAction').val(),
      qualityAction: $('#qualityAction').val() == null ? 'no' : $('#qualityAction').val(),
      communicationAction: $('#communicationAction').val() == null ? 'no' : $('#communicationAction').val(),
      customerSatisfactionAction: $('#customerSatisfactionAction').val() == null ? 'no' : $('#customerSatisfactionAction').val(),
      accountManagementAction: $('#accountManagementAction').val() == null ? 'no' : $('#accountManagementAction').val(),
      rftAction: $('#rftAction').val() == null ? 'no' : $('#rftAction').val(),
      publicationSpeedAction: $('#publicationSpeedAction').val() == null ? 'no' : $('#publicationSpeedAction').val(),
      feedbackAction: $('#feedbackAction').val() == null ? 'no' : $('#feedbackAction').val(),
      authorsatisficationAction: $('#authorsatisficationAction').val() == null ? 'no' : $('#authorsatisficationAction').val()
    }
    console.log(biPublisherConfig);
    this.apiService.postDataWithToken('PublisherConfig/Insert', biPublisherConfig).subscribe(
      (Response) => {
        console.log('insert api triggered');
        this.sweetAlert.addAlert();
        this.getKPIConfigData();
        this.hideaddUpdatePopUpp();
        console.log('kpi config insert api trigger success');
      },
      (error) => {
        console.log('kpi config insert api trigger failure');
        console.error('Error:', error);
        this.hideaddUpdatePopUpp();
      }
    );
  }

  updateKpiConfig(id: any) {
    console.log('update function triggered');
    let pubId = parseInt(id)
    let pubName = this.publisherList.find(item => item.id === pubId);
    let biPublisherConfig = {
      id: this.idForEdit,
      publisherId: id,
      publisherName: pubName.acronym,
      overallPerfomanceRequired: $('#overallPerfomanceRequired').is(':checked'),
      scheduleRequired: $('#scheduleRequired').is(':checked'),
      qualityRequired: $('#qualityRequired').is(':checked'),
      communicationRequired: $('#communicationRequired').is(':checked'),
      customerSatisfactionRequired: $('#customerSatisfactionRequired').is(':checked'),
      accountManagementRequired: $('#accountManagementRequired').is(':checked'),
      rftRequired: $('#rftRequired').is(':checked'),
      publicationSpeedRequired: $('#publicationSpeedRequired').is(':checked'),
      feedbackRequired: $('#feedbackRequired').is(':checked'),
      authorsatisficationRequired: $('#authorsatisficationRequired').is(':checked'),
      overallPerfomanceMetrics: $('#overallPerfomanceMetrics').val(),
      scheduleMetrics: $('#scheduleMetrics').val(),
      qualityMetrics: $('#qualityMetrics').val(),
      communicationMetrics: $('#communicationMetrics').val(),
      customerSatisfactionMetrics: $('#customerSatisfactionMetrics').val(),
      accountManagementMetrics: $('#accountManagementMetrics').val(),
      rftMetrics: $('#rftMetrics').val(),
      publicationSpeedMetrics: $('#publicationSpeedMetrics').val(),
      feedbackMetrics: $('#feedbackMetrics').val(),
      authorsatisficationMetrics: $('#authorsatisficationMetrics').val(),
      overallPerfomanceAction: $('#overallPerfomanceAction').val(),
      scheduleAction: $('#scheduleAction').val(),
      qualityAction: $('#qualityAction').val(),
      communicationAction: $('#communicationAction').val(),
      customerSatisfactionAction: $('#customerSatisfactionAction').val(),
      accountManagementAction: $('#accountManagementAction').val(),
      rftAction: $('#rftAction').val(),
      publicationSpeedAction: $('#publicationSpeedAction').val(),
      feedbackAction: $('#feedbackAction').val(),
      authorsatisficationAction: $('#authorsatisficationAction').val()
    }

    console.log(biPublisherConfig);

    this.apiService.UpdateDataWithToken('PublisherConfig/Update', biPublisherConfig).subscribe(
      (Response) => {
        console.log('update api triggered success');
        this.sweetAlert.updateAlert();
        this.getKPIConfigData();
        this.hideaddUpdatePopUpp();
      },
      (error) => {
        console.log('update api triggered failed');
        console.error('Error:', error);
        this.hideaddUpdatePopUpp();
      }
    );
  }


  showdeletePopUp(id: any) {
    this.Id = id;
    $('#deletePopUp').modal('show');
  }

  hidedeletePopUp() {
    $('#deletePopUp').modal('hide');
  }

  deleteKpiConfig(id: any) {
    this.apiService.DeleteDataWithToken(`PublisherConfig/DeleteById/${id}`).subscribe(
      (Response) => {
        $('#deletePopUp').modal('hide');
        console.log(id + " deleted ");
        this.sweetAlert.DeletealertWithSuccess();
        this.getKPIConfigData();
        this.hidedeletePopUp();
        this.Id = '';
      },
      (error) => {
        console.error('Error:', error);
        this.hidedeletePopUp();
      }
    );

  }

  clearForm() {
    this.isDuplicate = false;
    //this.anyChBoxChecked = false;
    //this.selectedPub =false;
    $(`#publisher`).css('outline', '0.5px solid grey');
    let Fields = this.kpiConfigFormField;
    this.isDuplicate = false;
    for (let field of Fields) {

      $(`#${field.id}Action`).css('outline', '1px solid grey');
      $(`#${field.id}Metrics`).css('outline', '1px solid grey');
      $(`#${field.id}Required`).prop('checked', false);
      $(`#${field.id}Metrics`).prop('disabled', true);
      $(`#${field.id}Action`).prop('disabled', true);
      $(`#${field.id}Metrics`).val('');
      $(`#${field.id}Action`).val('');

    }
    this.Id = "";
  }

  submit(id: any) {
    console.log(" submit triggered ");
    let Fields = this.kpiConfigFormField;
    let kpiCfgValid = true;

    for (let field of Fields) {
      let checkboxId = `${field.id}Required`;
      let isChecked = $(`#${checkboxId}`).is(':checked');

      if (isChecked) {

        if ($(`#${field.id}Metrics`).val().trim() != '' && ($(`#${field.id}Action`).val() == 'more' || $(`#${field.id}Action`).val() == 'less')) {
          //$('#submitBtn').prop('disabled', false);
          console.log('validation pass');
        }
        else if ($(`#${field.id}Metrics`).val().trim() == '' || ($(`#${field.id}Action`).val() != 'more' || $(`#${field.id}Action`).val() != 'less')) {
          //$('#submitBtn').prop('disabled', true);
          $(`#${field.id}Action`).css('outline', '0.5px solid red');
          $(`#${field.id}Metrics`).css('outline', '0.5px solid red');
          kpiCfgValid = false;
          console.log('validation fail');
        }
      }
      else if (!isChecked) {
        $(`#${field.id}Metrics`).prop('disabled', true);
        $(`#${field.id}Action`).prop('disabled', true);
        //$('#submitBtn').prop('disabled', false);
      }
    }
    if (id == '' && kpiCfgValid == true) {
      this.addKpiConfig();
      console.log('submit triggered for insert');
    } else if (id != '' && kpiCfgValid == true) {
      this.updateKpiConfig(id);
      console.log('submit triggered for update');
    }

  }

  // submit(id: any) {

  //   let Fields = this.kpiConfigFormField;
  //   //let kpiCfgValid;


  //   // let publisher = $('#publisher').val();
  //   // if(publisher ==''){
  //   //   $(`#publisher`).css('outline', '0.5px solid red');
  //   // }
  //   //$(`#${id}Metrics`).css('outline', '0.5px solid red');

  //   let chkBoxArr = [];
  //   for (let field of Fields) {
  //     let checkboxId = `${field.id}Required`;
  //     let isChecked = $(`#${checkboxId}`).is(':checked');
  //     chkBoxArr.push(isChecked);
  //     if (isChecked) {

  //       if ($(`#${field.id}Metrics`).val().trim() != '' && ($(`#${field.id}Action`).val() == 'more' || $(`#${field.id}Action`).val() == 'less')) {
  //         //$('#submitBtn').prop('disabled', false);
  //         console.log('validation pass');
  //       }
  //       else if ($(`#${field.id}Metrics`).val().trim() == '' || ($(`#${field.id}Action`).val() != 'more' || $(`#${field.id}Action`).val() != 'less')) {
  //         //$('#submitBtn').prop('disabled', true);
  //         $(`#${field.id}Action`).css('outline', '0.5px solid red');
  //         $(`#${field.id}Metrics`).css('outline', '0.5px solid red');
  //         //kpiCfgValid = false;
  //         console.log('validation fail');
  //       }

  //       // if (chkBoxArr.includes(true)) {
  //       //   console.log('At least one checkbox is checked');
  //       //   this.anyChBoxChecked= true;
  //       // } else {
  //       //   console.log('No checkboxes are checked');
  //       //   this.anyChBoxChecked = false;
  //       // }

  //     }
  //     else if (!isChecked) {
  //       $(`#${field.id}Metrics`).prop('disabled', true);
  //       $(`#${field.id}Action`).prop('disabled', true);
  //       //$('#submitBtn').prop('disabled', false);
  //     }


  //   }

  //   let pub = $(`#publisher`).val();
  //   if (pub!="") {
  //     $(`#publisher`).css('outline', '0.5px solid grey');
  //     //this.selectedPub=false;
  //   }

  //   else if (pub=="") {
  //     $(`#publisher`).css('outline', '0.5px solid red');
  //     //this.selectedPub = true;
  //   }

  //   //kpiCfgValid = kpiCfgValid && pub && !this.anyChBoxChecked;

  //   if (id == '' && (!this.isDuplicate) 
  //   //&& this.selectedPub 
  //   //&& this.anyChBoxChecked

  //   ) {
  //     this.addKpiConfig();
  //   } else if (id != '' && (!this.isDuplicate) 
  //   //&& this.selectedPub 
  //   //&& this.anyChBoxChecked
  //   ) {
  //     this.updateKpiConfig(id);
  //     console.log('submit triggered for update');
  //   }
  //   else{
  //     console.log('some thing wrong in submit function');
  //   }

  // }

  onChangeChkBox(id: string) {
    //console.log('onchange check box function triggered');
    let checkboxId = `${id}Required`;
    let isChecked = $(`#${checkboxId}`).is(':checked');

    if (isChecked) {
      //if ($(`#${id}Metrics`).val() != 0 && $(`#${id}Action`).val() != '') {
      $(`#${id}Metrics`).prop('disabled', false);
      $(`#${id}Action`).prop('disabled', false);
      $(`#${id}Action`).css('outline', '0.5px solid grey');
      $(`#${id}Metrics`).css('outline', '0.5px solid grey');
      //}
      // else if($(`#${id}Metrics`).val() == 0 && $(`#${id}Action`).val() == '') {
      //   $(`#${id}Metrics`).prop('disabled', false);
      //   $(`#${id}Action`).prop('disabled', false);
      //   $(`#${id}Metrics`).css('outline', '0.5px solid red');
      //   $(`#${id}Action`).css('outline', '0.5px solid red');
      // }
      // else if($(`#${id}Metrics`).val() == 0 ){
      //   $(`#${id}Metrics`).prop('disabled', false);
      //   $(`#${id}Metrics`).css('outline', '0.5px solid red');
      // }
      // else if($(`#${id}Action`).val() == 0 ){
      //   $(`#${id}Action`).prop('disabled', false);
      //   $(`#${id}Action`).css('outline', '0.5px solid red');
      // }


    } else if (!isChecked) {
      $(`#${id}Metrics`).prop('disabled', true);
      $(`#${id}Action`).prop('disabled', true);
      //console.log('checked');
      $(`#${id}Action`).css('outline', '0.5px solid grey');
      $(`#${id}Metrics`).css('outline', '0.5px solid grey');
      //////$('#submitBtn').prop('disabled', false);
    }
  }

  metricsKeyUp(id: string) {

    let checkboxId = `${id}Required`;
    let isChecked = $(`#${checkboxId}`).is(':checked');
    if (isChecked && $(`#${id}Metrics`).val() == '') {
      ////$('#submitBtn').prop('disabled', true);
      $(`#${id}Metrics`).css('outline', '0.5px solid red');
      console.log('metrics validation failed');
    } else if (isChecked && $(`#${id}Metrics`).val() != '') {
      ////$('#submitBtn').prop('disabled', false);
      console.log('metrics validation passed');
      $(`#${id}Metrics`).css('outline', '0.5px solid grey');
    }

  }

  actionChange(id: string) {

    let checkboxId = `${id}Required`;
    let isChecked = $(`#${checkboxId}`).is(':checked');
    if (isChecked && $(`#${id}Action`).val() == '') {
      ////$('#submitBtn').prop('disabled', true);
      $(`#${id}Action`).css('outline', '0.5px solid red');
      console.log('metrics validation failed');
    } else if (isChecked && $(`#${id}Action`).val() != '') {
      ////$('#submitBtn').prop('disabled', false);
      $(`#${id}Action`).css('outline', '0.5px solid grey');
      console.log('metrics validation passed');
    }

  }

  onSearchKeyUp(searchTerm: string): void {
    this.currentPage = 1;
    this.searchTerm = searchTerm;
    this.pagedItems = this.filteredItems();
    this.resetPagination();

  }

  filterByText(item: any): boolean {
    const excludedColumns = ['publisher', 'publisherId', 'id'];
    // Filter by text box input for all columns
    if (!this.searchTerm) {
      return true; // No filter applied
    }
    // Check if any column contains the search term (string or number)
    for (let key in item) {
      if (item.hasOwnProperty(key) && !excludedColumns.includes(key)) {
        const value = item[key];
        if (typeof value === 'string' && value.toLowerCase().includes(this.searchTerm.toLowerCase())) {
          return true;
        } else if (typeof value === 'number' && value.toString().includes(this.searchTerm)) {
          return true;
        }
      }
    }

    return false;
  }

  filteredItems(): any[] {
    const pageSizeNumber = +this.pageSize;
    if (pageSizeNumber === -1) {
      return this.kpiConfigList.filter(item =>
        this.filterByText(item)
      );

    }
    else {
      const startIndex = (this.currentPage - 1) * pageSizeNumber;
      const endIndex = startIndex + pageSizeNumber;
      this.startIndex = (this.currentPage - 1) * this.pageSize + 1;
      let KPIConfigList = this.publisherList.filter(item => this.filterByText(item)).slice(startIndex, endIndex);
      this.endIndex = ((this.currentPage) * (this.pageSize));
      if (this.endIndex > this.publisherList.length) {
        this.endIndex = ((this.currentPage - 1) * (this.pageSize)) + (this.kpiConfigList.length);
      }
      return this.kpiConfigList.filter(item =>
        this.filterByText(item)
      )
        .slice(startIndex, endIndex);
    }

  }

  resetPagination(): void {
    this.currentPage = 1;
    const filteredItems = this.filteredItems();
    this.pagedItems = filteredItems.slice(0, this.pageSize === -1 ? filteredItems.length : this.pageSize);
    this.calculatePages();
  }

  calculatePages(): void {
    this.pages = [];
    let totalItems = this.kpiConfigList.length;
    if (this.searchTerm != '') {
      console.log("search term is not empty");
      totalItems = this.filteredItems().length;
      console.log(" total item count is " + totalItems);
    }
    let totalPages = Math.ceil(totalItems / this.pageSize);
    //console.log('totalItems:', totalItems);
    //console.log('this.pageSize:', this.pageSize);
    for (let i = 1; i <= totalPages; i++) {
      this.pages.push(i);
      // Fix: Log the value of 'i' instead of 'this.pages'
    }

  }

  onPageSizeChange(): void {

    this.resetPagination();
    this.currentPage = 1;
    if (this.pageSize === -1) {
      this.pagedItems = this.filteredItems();
    } else {
      this.pagedItems = this.filteredItems().slice(0, this.pageSize);
      this.calculatePages();
    }

  }

  onPageChange(page: number): void {
    if (this.pageSize === 0) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    this.calculatePages();
  }

  exportExcel() {
    const element = document.getElementById('ExportTable');

    if (element) {
      // Create a worksheet
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      // Create a workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'KPIConfig');

      const currentDate = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      }).replace(/\//g, '');
      const filename = `KPIConfig_Data_${currentDate}.xlsx`;

      // Save the workbook as an Excel file
      XLSX.writeFile(wb, filename);
    } else {
      console.error('Element not found');
    }
  }

  firstPage() {
    let page = 1
    if (this.pageSize === 0) {
      return; // Do nothing for the "Select" option
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);

  }

  lastPage() {
    let page = this.pages[this.pages.length - 1];
    if (this.pageSize === 0) {
      return; // Do nothing for the "Select" option
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
  }

  previousPage() {
    let page = 0;
    if (this.currentPage != 1) {
      page = this.currentPage - 1;
      if (this.pageSize === 0) {
        return; // Do nothing for the "Select" option
      }
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    }

  }

  nextPage() {
    let page = 0;
    if (this.currentPage != this.pages[this.pages.length - 1]) {
      page = this.currentPage + 1;
      if (this.pageSize === 0) {
        return; // Do nothing for the "Select" option
      }
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedItems = this.filteredItems().slice(startIndex, endIndex);
    }

  }

  showLoader(): void {
    $('#loaderAnimation').modal('show');
  }
  closeLoader(): void {
    $('#loaderAnimation').modal('hide');
  }

}