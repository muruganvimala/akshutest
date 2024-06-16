import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ApiService } from 'src/app/API/api.service';
import { SweetAlertService } from 'src/app/common/sweet-alert.service';
import * as XLSX from 'xlsx';
declare var $: any;
@Component({
  selector: 'app-kpi-config',
  templateUrl: './kpi-config.component.html',
  styleUrls: ['./kpi-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
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
  isPublisherSelected!: boolean;

  constructor(private http: HttpClient,private apiService: ApiService, private sweetAlert: SweetAlertService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    // Get the current URL
    const currenturl = new URL(window.location.href).pathname.substring(1);
    setTimeout(() => {
      this.showLoader();
    }, 100);

    this.breadCrumbItems = [
      { label: 'Settings', active: true },
      { label: 'KPI Config', active: true }
    ];

    this.getKPIConfigData();
    this.getPublishers();
    this.getRoleTableData(currenturl);
    setTimeout(() => {
      this.closeLoader();
    }, 2000);

  }

  getRoleTableData(currenturl:string): void {
    let roleName = sessionStorage.getItem('userRole');
    this.apiService.GetDataWithToken(`Rolemaster/getUserAccess?userrole=${roleName}&url=${currenturl}`).subscribe(
      (response) => {
        this.menuAccess.canView = response.canview;
        this.menuAccess.canAdd = response.caninsert;
        this.menuAccess.canUpdate = response.canupdate;
        this.menuAccess.canDelete = response.candelete;
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Unable to get UserAccess details',error.message);
      }
    );
  }

  getPublishers(): void {
    this.apiService.GetDataWithToken('User/getpublisher').subscribe(
      (list) => {
        this.publisherList = list.data;
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
      },
      (error) => {
        console.error('Error:', error);
      }
    );

  }

  add(id: any) {
    for (let field of this.kpiConfigFormField) {
      $(`#${field.id}MetricsMsg`).hide();
      $(`#${field.id}ActionMsg`).hide();
      $(`#${field.id}MetricsWrgInpMsg`).hide();
      $(`#${field.id}Action`).css('outline', '0.5px solid grey');
      $(`#${field.id}Metrics`).css('outline', '0.5px solid grey');
    }
    $('#publisher').val('');
    let Fields = this.kpiConfigFormField;

    for (let field of Fields) {

      //$(`#${field.id}Action`).css('border', 'none');
      //$(`#${field.id}Metrics`).css('border', 'none');

    }
    this.clearForm();
    //id = parseInt(id);
    for (let field of this.kpiConfigFormField) {
      $(`#${field.id}MetricsMsg`).hide();
      $(`#${field.id}ActionMsg`).hide();
    }

    $('#addUpdatePopUp').modal('show');
    $(`#publisher`).prop('disabled', false);

  }

  edit(id: any, idforEdit: any) {
    this.isDuplicate = false;
    for (let field of this.kpiConfigFormField) {
      $(`#${field.id}MetricsMsg`).hide();
      $(`#${field.id}ActionMsg`).hide();
      $(`#${field.id}MetricsWrgInpMsg`).hide();
      $(`#${field.id}Action`).css('outline', '0.5px solid grey');
      $(`#${field.id}Metrics`).css('outline', '0.5px solid grey');
    }

    $(`#publisher`).prop('disabled', true);
    id = parseInt(id);
    idforEdit = parseInt(idforEdit);
    this.idForEdit = idforEdit;
    $('#addUpdatePopUp').modal('show');
    this.Id = id;
    this.getConfigDataById(id);
  }

  getConfigDataById(id: any) {
    this.apiService.GetDataWithToken(`PublisherConfig/DisplayById/${id}`).subscribe(
      (Response) => {
        $(`#publisher`).prop('disabled', true);
        $('#publisher').val(`${Response.data.publisherId}`);
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
        $('#overallPerfomanceMetrics').prop('disabled', !Response.data.overallPerfomanceRequired);
        $('#scheduleMetrics').val(Response.data.scheduleMetrics === null ? '' : Response.data.scheduleMetrics);
        $('#scheduleMetrics').prop('disabled', !Response.data.scheduleRequired);
        $('#qualityMetrics').val(Response.data.qualityMetrics === null ? '' : Response.data.qualityMetrics);
        $('#qualityMetrics').prop('disabled', !Response.data.qualityRequired);
        $('#communicationMetrics').val(Response.data.communicationMetrics === null ? '' : Response.data.communicationMetrics);
        $('#communicationMetrics').prop('disabled', !Response.data.communicationRequired);
        $('#customerSatisfactionMetrics').val(Response.data.customerSatisfactionMetrics === null ? '' : Response.data.customerSatisfactionMetrics);
        $('#customerSatisfactionMetrics').prop('disabled', !Response.data.customerSatisfactionRequired);
        $('#accountManagementMetrics').val(Response.data.accountManagementMetrics === null ? '' : Response.data.accountManagementMetrics);
        $('#accountManagementMetrics').prop('disabled', !Response.data.accountManagementRequired);
        $('#rftMetrics').val(Response.data.rftMetrics === null ? '' : Response.data.rftMetrics);
        $('#rftMetrics').prop('disabled', !Response.data.rftRequired);
        $('#publicationSpeedMetrics').val(Response.data.publicationSpeedMetrics === null ? '' : Response.data.publicationSpeedMetrics);
        $('#publicationSpeedMetrics').prop('disabled', !Response.data.publicationSpeedRequired);
        $('#feedbackMetrics').val(Response.data.feedbackMetrics === null ? '' : Response.data.feedbackMetrics);
        $('#feedbackMetrics').prop('disabled', !Response.data.feedbackRequired);
        $('#authorsatisficationMetrics').val(Response.data.authorsatisficationMetrics === null ? '' : Response.data.authorsatisficationMetrics);
        $('#authorsatisficationMetrics').prop('disabled', !Response.data.authorsatisficationRequired);
        $('#overallPerfomanceAction').val(`${Response.data.overallPerfomanceAction}`);
        $('#overallPerfomanceAction').prop('disabled', !Response.data.overallPerfomanceRequired);
        $('#scheduleAction').val(`${Response.data.scheduleAction}`);
        $('#scheduleAction').prop('disabled', !Response.data.scheduleRequired);
        $('#qualityAction').val(`${Response.data.qualityAction}`);
        $('#qualityAction').prop('disabled', !Response.data.qualityRequired);
        $('#communicationAction').val(`${Response.data.communicationAction}`);
        $('#communicationAction').prop('disabled', !Response.data.communicationRequired);
        $('#customerSatisfactionAction').val(`${Response.data.customerSatisfactionAction}`);
        $('#customerSatisfactionAction').prop('disabled', !Response.data.customerSatisfactionRequired);
        $('#accountManagementAction').val(`${Response.data.accountManagementAction}`);
        $('#accountManagementAction').prop('disabled', !Response.data.accountManagementRequired);
        $('#rftAction').val(`${Response.data.rftAction}`);
        $('#rftAction').prop('disabled', !Response.data.rftRequired);
        $('#publicationSpeedAction').val(`${Response.data.publicationSpeedAction}`);
        $('#publicationSpeedAction').prop('disabled', !Response.data.publicationSpeedRequired);
        $('#feedbackAction').val(`${Response.data.feedbackAction}`);
        $('#feedbackAction').prop('disabled', !Response.data.feedbackRequired);
        $('#authorsatisficationAction').val(`${Response.data.authorsatisficationAction}`);
        $('#authorsatisficationAction').prop('disabled', !Response.data.authorsatisficationRequired);
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
    this.isPublisherSelected = false;
    //this.selectedPub = false;
    this.isDuplicate = this.kpiConfigList.some(obj => obj.publisherId == publisher);
    //$('#submitBtn').prop('disabled', this.isDuplicate);
    if (this.isDuplicate) {
      $(`#publisher`).css('outline', '0.5px solid red');
    }
    else if (!this.isDuplicate) {
      $(`#publisher`).css('outline', '0.5px solid grey');
    }
  }

  addKpiConfig() {

    let pubId = parseInt($('#publisher').val());
    let pubName = this.publisherList.find(item => item.id == pubId);
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

    this.apiService.postDataWithToken('PublisherConfig/Insert', biPublisherConfig).subscribe(
      (Response) => {
        this.sweetAlert.addAlert();
        this.getKPIConfigData();
        this.hideaddUpdatePopUpp();
        this.calculatePages();
        //this.searchTerm = biPublisherConfig.publisherName;
        //this.currentPage = 1;
      },
      (error) => {
        //console.log('kpi config insert api trigger failure');
        console.error('Error:', error);
        this.hideaddUpdatePopUpp();
      }
    );
  }

  updateKpiConfig(id: any) {
    let pubId = parseInt(id)
    let pubName = this.publisherList.find(item => item.id === pubId);
    let biPublisherConfig = {
      id: this.idForEdit,
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
 
    this.apiService.UpdateDataWithToken('PublisherConfig/Update', biPublisherConfig).subscribe(
      (Response) => {
        this.sweetAlert.updateAlert();
        this.getKPIConfigData();
        this.hideaddUpdatePopUpp();
      },
      (error) => {
        console.error('Error:', error);
        this.sweetAlert.failureAlert('Update failure',error.message);
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
    let oldTotal = this.filteredItems().length;
    this.apiService.DeleteDataWithToken(`PublisherConfig/DeleteById/${id}`).subscribe(
      (Response) => {
        $('#deletePopUp').modal('hide');
        this.sweetAlert.DeletealertWithSuccess();
        this.getKPIConfigData();
        this.hidedeletePopUp();
        this.calculatePages();
        this.Id = '';
        if(oldTotal ==1){
          this.currentPage = this.pages.length -1;
        }
        //this.searchTerm = '';
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
    let Fields = this.kpiConfigFormField;
    let kpiCfgValid = true;

    let pub = $('#publisher').val();
    if (pub) {
      this.isPublisherSelected = false;
    }
    else if (!pub) {
      this.isPublisherSelected = true;
    }

    for (let field of Fields) {
      let checkboxId = `${field.id}Required`;
      let isChecked = $(`#${checkboxId}`).is(':checked');

      if (isChecked) {

        if ($(`#${field.id}Metrics`).val().trim() != '' && ($(`#${field.id}Action`).val() == 'more' || $(`#${field.id}Action`).val() == 'less')) {
          //$('#submitBtn').prop('disabled', false);
          //console.log('validation pass');
        }
        else if ($(`#${field.id}Metrics`).val().trim() == '' || ($(`#${field.id}Action`).val() != 'more' || $(`#${field.id}Action`).val() != 'less')) {
          //$('#submitBtn').prop('disabled', true);
          $(`#${field.id}Action`).css('outline', '0.5px solid red');
          $(`#${field.id}Metrics`).css('outline', '0.5px solid red');
          kpiCfgValid = false;
          //console.log('validation fail');
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
      //console.log('submit triggered for insert');
    } else if (id != '' && kpiCfgValid == true) {
      this.updateKpiConfig(id);
      //console.log('submit triggered for update');
    }

  }

  onChangeChkBox(id: string) {
    //console.log('onchange check box function triggered');
    let checkboxId = `${id}Required`;
    let isChecked = $(`#${checkboxId}`).is(':checked');

    if (isChecked) {
      let metrics = $(`#${id}Metrics`).val();
      if (!metrics) {
        $(`#${id}Metrics`).css('outline', '0.5px solid red');
        $(`#${id}MetricsMsg`).show();
      }
      else if (metrics) {
        $(`#${id}Metrics`).css('outline', '0.5px solid grey');
        $(`#${id}MetricsMsg`).hide();
      }
      let action = $(`#${id}Action`).val();
      if (!action) {
        $(`#${id}Action`).css('outline', '0.5px solid red');
        $(`#${id}ActionMsg`).show();
      }
      else if (action) {
        $(`#${id}Action`).css('outline', '0.5px solid grey');
        $(`#${id}ActionMsg`).hide();
      }

      $(`#${id}Metrics`).prop('disabled', false);
      $(`#${id}Action`).prop('disabled', false);

    } else if (!isChecked) {
      $(`#${id}Metrics`).prop('disabled', true);
      $(`#${id}Action`).prop('disabled', true);
      //console.log('checked');
      $(`#${id}Action`).css('outline', '0.5px solid grey');
      $(`#${id}Metrics`).css('outline', '0.5px solid grey');
      $(`#${id}MetricsMsg`).hide();
      $(`#${id}ActionMsg`).hide();
      //$('#submitBtn').prop('disabled', false);
    }
  }

  metricsKeyUp(id: string) {

    let val = $(`#${id}Metrics`).val().toString();
    if (val && !/^[-]?\d*\.?\d+$/.test(val)) {
      $(`#${id}MetricsWrgInpMsg`).show();
    } else {
      $(`#${id}MetricsWrgInpMsg`).hide();
    }

    let checkboxId = `${id}Required`;
    let isChecked = $(`#${checkboxId}`).is(':checked');
    if (isChecked && $(`#${id}Metrics`).val() == 0) {
      //$('#submitBtn').prop('disabled', true);
      $(`#${id}Metrics`).css('outline', '0.5px solid red');
      $(`#${id}MetricsMsg`).show();
      //console.log('metrics validation failed');
    } else if (isChecked && $(`#${id}Metrics`).val() != 0) {
      //$('#submitBtn').prop('disabled', false);
      //console.log('metrics validation passed');
      $(`#${id}Metrics`).css('outline', '0.5px solid grey');
      $(`#${id}MetricsMsg`).hide();
      $(this).val($(`#${id}Metrics`).val().replace(/[^0-9]/g, ''));

    }

  }

  metricsFocus(id: any) {

    let checkboxId = `${id}Required`;
    let isChecked = $(`#${checkboxId}`).is(':checked');
    if (isChecked && $(`#${id}Metrics`).val() == 0) {
      $(`#${id}Metrics`).val('');
    }

  }

  actionChange(id: string) {

    let checkboxId = `${id}Required`;
    let isChecked = $(`#${checkboxId}`).is(':checked');
    if (isChecked && $(`#${id}Action`).val() == '') {
      //$('#submitBtn').prop('disabled', true);
      $(`#${id}Action`).css('outline', '0.5px solid red');
      $(`#${id}ActionMsg`).show();
      //console.log('metrics validation failed');
    } else if (isChecked && $(`#${id}Action`).val() != '') {
      //$('#submitBtn').prop('disabled', false);
      $(`#${id}Action`).css('outline', '0.5px solid grey');
      $(`#${id}ActionMsg`).hide();
    }

  }

  onSearchKeyUp(searchTerm: string): void {
    this.currentPage = 1;
    this.searchTerm = searchTerm;
    this.pagedItems = this.filteredItems();
    this.resetPagination();
  }

  filterByText(item: any): boolean {
    const includedColumns = ['publisher'];
    if (!this.searchTerm) {
      return true; // No filter applied
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase(); // Convert search term to lowercase once for efficiency
    for (let key in item) {
      if (item.hasOwnProperty(key) && !includedColumns.includes(key)) {
        const value = item[key];
        if (typeof value === 'string' && value.toLowerCase().includes(lowerCaseSearchTerm)) {
          return true;
        } else if (typeof value === 'number' && value.toString().includes(this.searchTerm)) {
          return true;
        }
      }
    }
  
    return false;
  }
  

  filteredItems() {
    const pageSizeNumber = +this.pageSize;
    const filteredList = this.kpiConfigList.filter(item => this.filterByText(item));
    let startIndex = 0;
    let endIndex = filteredList.length;
    if (pageSizeNumber !== -1) {
      startIndex = (this.currentPage - 1) * pageSizeNumber;
      endIndex = Math.min(startIndex + pageSizeNumber, filteredList.length);
    }
    this.startIndex = startIndex + 1;
    this.endIndex = endIndex;
    return filteredList.slice(startIndex, endIndex);
  }

  updatePaginationControls() {
    const isFirstPage = this.currentPage === this.pages[0];
    const isLastPage = this.currentPage === this.pages[this.pages.length - 1];
    $('#firstPage, #previousPage').toggleClass('disabled', isFirstPage);
    $('#nextPage, #lastPage').toggleClass('disabled', isLastPage);
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
      totalItems = this.filteredItems().length;
    }
    let totalPages = Math.ceil(totalItems / this.pageSize);
    for (let i = 1; i <= totalPages; i++) {
      this.pages.push(i);
    }
    this.updatePaginationControls();

  }

  onPageSizeChange(): void {

    this.resetPagination();
    this.currentPage = 1;
    if (this.pageSize === -1) {
      this.pagedItems = this.filteredItems();
      this.endIndex = this.kpiConfigList.length;
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

    const data: any[] = this.filteredItems().map((item, index) => ({

      'ID': index + 1,
      'Publisher Name': item.publisherName,
      'Overall Perfomance  Required': item.overallPerfomanceRequired,
      'Overall Perfomance  Metrics': item.overallPerfomanceMetrics,
      'Overall Perfomance  Action': item.overallPerfomanceAction,
      'Schedule  Required': item.scheduleRequired,
      'Schedule  Metrics': item.scheduleMetrics,
      'Schedule  Action': item.scheduleAction,
      'Quality  Required': item.qualityRequired,
      'Quality  Metrics': item.qualityMetrics,
      'Quality  Action': item.qualityAction,
      'Communication  Required': item.communicationRequired,
      'Communication  Metrics': item.communicationMetrics,
      'Communication  Action': item.communicationAction,
      'Customer Satisfaction  Required': item.customerSatisfactionRequired,
      'Customer Satisfaction  Metrics': item.customerSatisfactionMetrics,
      'Customer Satisfaction  Action': item.customerSatisfactionAction,
      'Account Management  Required': item.accountManagementRequired,
      'Account Management  Metrics': item.accountManagementMetrics,
      'Account Management  Action': item.accountManagementAction,
      'RFT  Required': item.rftRequired,
      'RFT  Metrics': item.rftMetrics,
      'RFT  Action': item.rftAction,
      'Publication Speed  Required': item.publicationSpeedRequired,
      'Publication Speed  Metrics': item.publicationSpeedMetrics,
      'Publication Speed  Action': item.publicationSpeedAction,
      'Feedback  Required': item.feedbackRequired,
      'Feedback  Metrics': item.feedbackMetrics,
      'Feedback  Action': item.feedbackAction,
      'Author Satisfication  Required': item.authorsatisficationRequired,
      'Author Satisfication  Metrics': item.authorsatisficationMetrics,
      'Author Satisfication  Action': item.authorsatisficationAction

    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'KPI_Config_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');

  }

  exportPdf() {
    //const doc = new jsPDF() as any;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a3'
    }) as any;

    const data = []; // Initialize an empty array for your tabular data

    // Define the headers for your table
    const headers = [
      'ID',
      'Publisher Name',
      'Overall Perfomance Required',
      'Overall Perfomance Metrics',
      'Overall Perfomance Action',
      'Schedule Required',
      'Schedule Metrics',
      'Schedule Action',
      'Quality Required',
      'Quality Metrics',
      'Quality Action',
      'Communication Required',
      'Communication Metrics',
      'Communication Action',
      'Customer Satisfaction Required',
      'Customer Satisfaction Metrics',
      'Customer Satisfaction Action',
      'Account Management Required',
      'Account Management Metrics',
      'Account Management Action',
      'RFT Required',
      'RFT Metrics',
      'RFT Action',
      'Publication Speed Required',
      'Publication Speed Metrics',
      'Publication Speed Action',
      'Feedback Required',
      'Feedback Metrics',
      'Feedback Action',
      'Author Satisfication Required',
      'Author Satisfication Metrics',
      'Author Satisfication Action'
    ];

    // Add headers to the data array as the first row
    data.push(headers);

    // Iterate over your tabular data and push each row to the data array
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.publisherName,
        item.overallPerfomanceRequired,
        item.overallPerfomanceMetrics,
        item.overallPerfomanceAction,
        item.scheduleRequired,
        item.scheduleMetrics,
        item.scheduleAction,
        item.qualityRequired,
        item.qualityMetrics,
        item.qualityAction,
        item.communicationRequired,
        item.communicationMetrics,
        item.communicationAction,
        item.customerSatisfactionRequired,
        item.customerSatisfactionMetrics,
        item.customerSatisfactionAction,
        item.accountManagementRequired,
        item.accountManagementMetrics,
        item.accountManagementAction,
        item.rftRequired,
        item.rftMetrics,
        item.rftAction,
        item.publicationSpeedRequired,
        item.publicationSpeedMetrics,
        item.publicationSpeedAction,
        item.feedbackRequired,
        item.feedbackMetrics,
        item.feedbackAction,
        item.authorsatisficationRequired,
        item.authorsatisficationMetrics,
        item.authorsatisficationAction
      ];
      data.push(rowData);

    });

    doc.autoTable({
      //head: [headers],
      body: data,
      theme: 'grid',
      styles: {
        fontSize: 6, // Adjust font size as needed for readability
        cellPadding: 1,
      },
      columnStyles: {
        0: { cellWidth: 'auto' } // Adjust column widths as needed
      }
      // You might not need the didDrawPage callback if you're not trying to manipulate internal properties.
    });

    // Format the date and save the PDF
    const myDate = new Date();
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy'); // Ensure this is correctly implemented
    doc.save(`KPI_Config_Data_${formattedDate}.pdf`);

  }

  exportCsv() {
    // Get CSV headers
    let csvContent = 'ID,Publisher Name,Overall Perfomance Required,Overall Perfomance Metrics,Overall Perfomance Action,Schedule Required,Schedule Metrics,Schedule Action,Quality Required,Quality Metrics,Quality Action,Communication Required,Communication Metrics,Communication Action,Customer Satisfaction Required,Customer Satisfaction Metrics,Customer Satisfaction Action,Account Management Required,Account Management Metrics,Account Management Action,RFT Required,RFT Metrics,RFT Action,Publication Speed Required,Publication Speed Metrics,Publication Speed Action,Feedback Required,Feedback Metrics,Feedback Action,Author Satisfication Required,Author Satisfication Metrics,Author Satisfication Action\n';

    // Add CSV rows based on kpiConfigList data
    this.filteredItems().forEach((item, index) => {
      const rowData = [
        index + 1,
        item.publisherName,
        item.overallPerfomanceRequired,
        item.overallPerfomanceMetrics,
        item.overallPerfomanceAction,
        item.scheduleRequired,
        item.scheduleMetrics,
        item.scheduleAction,
        item.qualityRequired,
        item.qualityMetrics,
        item.qualityAction,
        item.communicationRequired,
        item.communicationMetrics,
        item.communicationAction,
        item.customerSatisfactionRequired,
        item.customerSatisfactionMetrics,
        item.customerSatisfactionAction,
        item.accountManagementRequired,
        item.accountManagementMetrics,
        item.accountManagementAction,
        item.rftRequired,
        item.rftMetrics,
        item.rftAction,
        item.publicationSpeedRequired,
        item.publicationSpeedMetrics,
        item.publicationSpeedAction,
        item.feedbackRequired,
        item.feedbackMetrics,
        item.feedbackAction,
        item.authorsatisficationRequired,
        item.authorsatisficationMetrics,
        item.authorsatisficationAction
      ];
      csvContent += rowData.join(',') + '\n'; // Join row data with commas and add a new line
    });

    // Encode CSV content for download
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    // Create a link element for download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    // Format current date
    const myDate = new Date();
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy'); // Assuming datePipe is a date formatting utility
    link.setAttribute('download', 'KPI_Config_Data' + formattedDate + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
  }


  exportExcelAll() {

    const data: any[] = this.kpiConfigList.map((item, index) => ({

      'ID': index + 1,
      'Publisher Name': item.publisherName,
      'Overall Perfomance  Required': item.overallPerfomanceRequired,
      'Overall Perfomance  Metrics': item.overallPerfomanceMetrics,
      'Overall Perfomance  Action': item.overallPerfomanceAction,
      'Schedule  Required': item.scheduleRequired,
      'Schedule  Metrics': item.scheduleMetrics,
      'Schedule  Action': item.scheduleAction,
      'Quality  Required': item.qualityRequired,
      'Quality  Metrics': item.qualityMetrics,
      'Quality  Action': item.qualityAction,
      'Communication  Required': item.communicationRequired,
      'Communication  Metrics': item.communicationMetrics,
      'Communication  Action': item.communicationAction,
      'Customer Satisfaction  Required': item.customerSatisfactionRequired,
      'Customer Satisfaction  Metrics': item.customerSatisfactionMetrics,
      'Customer Satisfaction  Action': item.customerSatisfactionAction,
      'Account Management  Required': item.accountManagementRequired,
      'Account Management  Metrics': item.accountManagementMetrics,
      'Account Management  Action': item.accountManagementAction,
      'RFT  Required': item.rftRequired,
      'RFT  Metrics': item.rftMetrics,
      'RFT  Action': item.rftAction,
      'Publication Speed  Required': item.publicationSpeedRequired,
      'Publication Speed  Metrics': item.publicationSpeedMetrics,
      'Publication Speed  Action': item.publicationSpeedAction,
      'Feedback  Required': item.feedbackRequired,
      'Feedback  Metrics': item.feedbackMetrics,
      'Feedback  Action': item.feedbackAction,
      'Author Satisfication  Required': item.authorsatisficationRequired,
      'Author Satisfication  Metrics': item.authorsatisficationMetrics,
      'Author Satisfication  Action': item.authorsatisficationAction

    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    XLSX.writeFile(wb, 'KPI_Config_Data' + this.datePipe.transform(myDate, 'ddMMyyy') + '.xlsx');

  }

  exportPdfAll() {
    //const doc = new jsPDF() as any;
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a3'
    }) as any;

    const data = []; // Initialize an empty array for your tabular data

    // Define the headers for your table
    const headers = [
      'ID',
      'Publisher Name',
      'Overall Perfomance ',
      '',
      '',
      'Schedule ',
      '',
      '',
      'Quality ',
      '',
      '',
      'Communication ',
      '',
      '',
      'Customer Satisfaction ',
      '',
      '',
      'Account Management ',
      '',
      '',
      'RFT ',
      '',
      '',
      'Publication Speed ',
      '',
      '',
      'Feedback ',
      '',
      '',
      'Author Satisfication ',
      '',
      ''
    ];

    const subHeaders = [
      '',
      '',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action',
      'Required',
      'Metrics',
      'Action'
    ];

    // Add headers to the data array as the first row
    data.push(headers);
    data.push(subHeaders);

    // Iterate over your tabular data and push each row to the data array
    this.kpiConfigList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.publisherName,
        item.overallPerfomanceRequired,
        item.overallPerfomanceMetrics,
        item.overallPerfomanceAction,
        item.scheduleRequired,
        item.scheduleMetrics,
        item.scheduleAction,
        item.qualityRequired,
        item.qualityMetrics,
        item.qualityAction,
        item.communicationRequired,
        item.communicationMetrics,
        item.communicationAction,
        item.customerSatisfactionRequired,
        item.customerSatisfactionMetrics,
        item.customerSatisfactionAction,
        item.accountManagementRequired,
        item.accountManagementMetrics,
        item.accountManagementAction,
        item.rftRequired,
        item.rftMetrics,
        item.rftAction,
        item.publicationSpeedRequired,
        item.publicationSpeedMetrics,
        item.publicationSpeedAction,
        item.feedbackRequired,
        item.feedbackMetrics,
        item.feedbackAction,
        item.authorsatisficationRequired,
        item.authorsatisficationMetrics,
        item.authorsatisficationAction
      ];
      data.push(rowData);

    });

    doc.autoTable({
      // head: [headers],
      // subHeaders:[subHeaders],
      body: data,
      theme: 'grid',
      styles: {
        fontSize: 6, // Adjust font size as needed for readability
        cellPadding: 1,
      },
      columnStyles: {
        0: { cellWidth: 'auto' } // Adjust column widths as needed
      }
      // You might not need the didDrawPage callback if you're not trying to manipulate internal properties.
    });

    // Format the date and save the PDF
    const myDate = new Date();
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy'); // Ensure this is correctly implemented
    doc.save(`KPI_Config_Data_${formattedDate}.pdf`);

  }

  exportCsvAll() {
    // Get CSV headers
    let csvContent = 'ID,Publisher Name,Overall Perfomance Required,Overall Perfomance Metrics,Overall Perfomance Action,Schedule Required,Schedule Metrics,Schedule Action,Quality Required,Quality Metrics,Quality Action,Communication Required,Communication Metrics,Communication Action,Customer Satisfaction Required,Customer Satisfaction Metrics,Customer Satisfaction Action,Account Management Required,Account Management Metrics,Account Management Action,RFT Required,RFT Metrics,RFT Action,Publication Speed Required,Publication Speed Metrics,Publication Speed Action,Feedback Required,Feedback Metrics,Feedback Action,Author Satisfication Required,Author Satisfication Metrics,Author Satisfication Action\n';

    // Add CSV rows based on kpiConfigList data
    this.kpiConfigList.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.publisherName,
        item.overallPerfomanceRequired,
        item.overallPerfomanceMetrics,
        item.overallPerfomanceAction,
        item.scheduleRequired,
        item.scheduleMetrics,
        item.scheduleAction,
        item.qualityRequired,
        item.qualityMetrics,
        item.qualityAction,
        item.communicationRequired,
        item.communicationMetrics,
        item.communicationAction,
        item.customerSatisfactionRequired,
        item.customerSatisfactionMetrics,
        item.customerSatisfactionAction,
        item.accountManagementRequired,
        item.accountManagementMetrics,
        item.accountManagementAction,
        item.rftRequired,
        item.rftMetrics,
        item.rftAction,
        item.publicationSpeedRequired,
        item.publicationSpeedMetrics,
        item.publicationSpeedAction,
        item.feedbackRequired,
        item.feedbackMetrics,
        item.feedbackAction,
        item.authorsatisficationRequired,
        item.authorsatisficationMetrics,
        item.authorsatisficationAction
      ];
      csvContent += rowData.join(',') + '\n'; // Join row data with commas and add a new line
    });

    // Encode CSV content for download
    const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    // Create a link element for download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    // Format current date
    const myDate = new Date();
    const formattedDate = this.datePipe.transform(myDate, 'ddMMyyyy'); // Assuming datePipe is a date formatting utility
    link.setAttribute('download', 'KPI_Config_Data' + formattedDate + '.csv');

    document.body.appendChild(link); // Append link to the body
    link.click(); // Trigger download
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
    this.updatePaginationControls();
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
    this.updatePaginationControls();
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
    this.updatePaginationControls();

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
    this.updatePaginationControls();
  }

  showLoader(): void {
    $('#loaderAnimation').modal('show');
  }
  closeLoader(): void {
    $('#loaderAnimation').modal('hide');
  }

}