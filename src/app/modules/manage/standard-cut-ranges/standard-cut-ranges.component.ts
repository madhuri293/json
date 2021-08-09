import { Component, OnInit} from '@angular/core';
import { StandardCutRangeDTO, StandardCutRangeBP, flyOutFormDTO } from './standard-cut-ranges.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { RunObjectiveService } from '../run-objective/run-objective.service';
import { StandardCutRangesService } from './standard-cut-ranges.service';
import { ManageVariableService } from '../manage-variables/manage-variable.service';
import { CommonService } from '../../../shared/common-services/common.service';
import { UnitSelectorNames, StatusEnum } from '../../../shared/enum/enum.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-standard-cut-ranges',
  templateUrl: './standard-cut-ranges.component.html'
})
export class StandardCutRangesComponent implements OnInit {
  selectedtemplate: any;
  cutRangeBp = new StandardCutRangeBP();
  cutRangeBpDTO = new StandardCutRangeDTO();
  flyoutDTO = new flyOutFormDTO();
  isInsert: boolean;
  tempRunObjectiveName: any;

 
  constructor(private commonService: CommonService, private router: ActivatedRoute,
    private manageVariableService: ManageVariableService,
    public cutRangeService: StandardCutRangesService, private formBuilder: FormBuilder, private dashboardService: DashboadrdService,
    private notify: NotificationService, private runObjectiveService: RunObjectiveService, ) {
    this.cutRangeBpDTO.privilege = this.commonService.applyPrivilege(router.snapshot.data.name);
  }

  ngOnInit() {
    this.isInsert = false;
    this.cutRangeBpDTO.selectedIndex = 0;
    this.dashboardService.showTechnologyHeader = true;
    this.cutRangeBpDTO.loading = true;
    this.cutRangeBpDTO.isUpdate = false;
    this.cutRangeBpDTO.nOfRecordPage = 5;
    this.cutRangeBpDTO.nOfFlyRecordPage = 10;
    this.cutRangeBpDTO.isTableData = false;

    this.setUnits();
    this.standardCutFromControls();
    this.runObjectiveFormControls();
    this.getAllTechnology();

    this.cutRangeBpDTO.cols = [
      { field: 'objectiveName', header: 'Objective Name' }
    ];

    this.refresh();

  }



  standardCutFromControls() {
    this.cutRangeBpDTO.standardCutRangeForm = this.formBuilder.group(
      {
        technology: new FormControl('', Validators.compose([])),
        runObjectiveName: new FormControl('', Validators.compose([Validators.required])),
      }
    );
  }

  runObjectiveFormControls() {

    this.cutRangeBpDTO.runObjectiveForm = this.formBuilder.group(
      {
        runObjectiveName: new FormControl('', Validators.compose([Validators.required])),
      }
    );
  }




  getAllTechnology() {
    const selectedTechnology = localStorage.getItem('technology');
    this.cutRangeBp.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.cutRangeBpDTO.technology = result.data;
      this.cutRangeBpDTO.technology = this.cutRangeBpDTO.technology.filter(tech => tech.technologyId === selectedTechnology);
      this.cutRangeBpDTO.technology = this.cutRangeBpDTO.technology.filter(val => val.status === StatusEnum.Y);
    }, error => {
      this.notify.showError(error.message);
    });
  }

  getRunObjectiveDetails() {
    this.cutRangeService.loading = true;
    
    this.flyoutDTO.objectiveName = this.cutRangeBp.objectiveName;
    this.runObjectiveService.getRunActiveObjective().subscribe(result => {
      this.cutRangeBpDTO.runObjectiveList = result.data;
      this.cutRangeService.loading = false;
      this.cutRangeBpDTO.runObjectiveRecords = this.cutRangeBpDTO.runObjectiveList;
      this.cutRangeBpDTO.totalRecords = this.cutRangeBpDTO.runObjectiveList.length;
    }, (error) => {
      this.cutRangeService.loading = false;
      this.notify.showError(error.message);
    }
    );
  }
  closeFlyout() {
    this.cutRangeBpDTO.runObjectiveForm.reset();
  }
  onEdit(val: any) {

    this.cutRangeBpDTO.isUpdate = false;
    this.cutRangeBpDTO.runObjectiveName = val.objectiveName;
    this.cutRangeBpDTO.runObjectiveId = val.id;
    const flyoutModelClose = document.getElementById('runObjectiveclose');
    flyoutModelClose.click();
    this.getTableData(val.id);
    this.setUnits();
  }

  getTableData(productObjectiveId: any) {
    this.cutRangeBpDTO.selectedIndex = 0;
    this.cutRangeBpDTO.showError = false;
    this.cutRangeBpDTO.displayValueIP = '';
    this.cutRangeBpDTO.displayValueEP = '';
    this.cutRangeService.getById(productObjectiveId).subscribe(result => {
      this.cutRangeBpDTO.originalGridData = result.data;
      this.cutRangeBpDTO.errorIndex = -1;
      this.cutRangeBpDTO.gridData = this.cutRangeBpDTO.originalGridData;
      if (this.cutRangeBpDTO.originalGridData.length > 0) {
        this.cutRangeBpDTO.isTableData = true;
        this.cutRangeBpDTO.originalGridData.forEach(val=>{
          if(val.endPoint === null){
            this.cutRangeBpDTO.showError = true;
                }
         
        })
      } else {
        this.cutRangeBpDTO.isTableData = false;
        this.cutRangeBpDTO.showError = true;
        this.addRow();

      }
      this.updateDisplayValue();

      this.notify.showSuccess(result.message);

    }, error => {
      this.notify.showError(error.message);
      this.cutRangeBpDTO.isTableData = false;

    }
    );
  }
  
  selectIndex(id) {
    this.cutRangeBpDTO.selectedIndex = id;

  }
  insertRow() {
    this.cutRangeBpDTO.isUpdate = true;
    this.cutRangeBpDTO.showError = false;
    const rowIndex = this.cutRangeBpDTO.selectedIndex - 1;
    if (!isNaN(rowIndex) && rowIndex !== -1) {
      const newIbp = this.cutRangeBpDTO.gridData[rowIndex].endpointDV;
      if (newIbp !== null && newIbp !=="" ) {
        const obj = { 'ibpDV': newIbp, 'endpointDV': null, 'yieldCutDV': parseInt(newIbp) };
        this.cutRangeBpDTO.gridData.splice(this.cutRangeBpDTO.selectedIndex, 0, obj);
        this.isInsert = true;
      } else {
        const obj = { 'ibpDV': null, 'endpointDV': null, 'yieldCutDV': '' };
        this.cutRangeBpDTO.gridData.splice(this.cutRangeBpDTO.selectedIndex, 0, obj);
      }



    } else {
      const obj = { 'ibpDV': null, 'endpointDV': null, 'yieldCutDV': '' };
      this.cutRangeBpDTO.gridData.splice(this.cutRangeBpDTO.selectedIndex, 0, obj);
    }


  }
  addRow() {
    this.cutRangeBpDTO.errorIndex = -1;
    this.cutRangeBpDTO.isUpdate = true;
    if (this.cutRangeBpDTO.errorIndex === this.cutRangeBpDTO.gridData.length && this.cutRangeBpDTO.showError === true) {
      this.cutRangeBpDTO.showError = false;
    }
    if (this.cutRangeBpDTO.gridData && this.cutRangeBpDTO.gridData.length > 0) {
      const len = this.cutRangeBpDTO.gridData.length;
      const newIbp = this.cutRangeBpDTO.gridData[len - 1].endpointDV;
      if (newIbp !== null && newIbp !=="") {
        const obj = { 'ibpDV': newIbp, 'endpointDV': null, 'yieldCutDV': parseInt(newIbp) };
        this.cutRangeBpDTO.gridData.splice(len, 0, obj);
        this.cutRangeBpDTO.showError = true;
      } else {
        const obj = { 'ibpDV': null, 'endpointDV': null, 'yieldCutDV': null };
        this.cutRangeBpDTO.gridData.push(obj);
        this.cutRangeBpDTO.showError = true;
        this.cutRangeBpDTO.errorIndex = -1;
      }
    } else {

      const obj = { 'ibpDV': null, 'endpointDV': null, 'yieldCutDV': null };
      this.cutRangeBpDTO.gridData.push(obj);
      this.cutRangeBpDTO.showError = true;
      this.cutRangeBpDTO.errorIndex = -1;

    }

  }

  yieldCutRangeUpdate() {


    if (!this.cutRangeBpDTO.isValidDecimal) {
      if (this.cutRangeBpDTO.gridData && this.cutRangeBpDTO.gridData.length > 0) {
        this.cutRangeBpDTO.gridData.forEach(val => {
        
          if(val.yieldCutDV !== undefined){
            const result = val.yieldCutDV.toString().split('-');
            val.yieldCutIbp = result[0];
            val.yiledCutEp = result[1];
            this.yieldCutLabelCheck(val);
          }


        });
      }
      this.updateBaseValue();
    } 
  }

  yieldCutLabelCheck(val) {
    if ((val.yieldCutIbp === undefined && val.yiledCutEp === undefined) || (val.yieldCutIbp ==="" && val.yiledCutEp ==="")) {
      val.yieldCutDV = '';
      val.unitDisplayName = '';
      // when empty row
    }  else if(val.yieldCutIbp ===""){
      val.yieldCutDV =  val.yiledCutEp;
      // val.unitDisplayName = this.selectedtemplate.unitDisplayName;
    } else if(val.yiledCutEp ===""){
      val.yieldCutDV =  val.yieldCutIbp;
      // val.unitDisplayName = this.selectedtemplate.unitDisplayName;
    }
     else if (!isNaN(val.yieldCutIbp) && !isNaN(val.yiledCutEp)) {
      val.yieldCutDV = parseInt(val.yieldCutIbp) + ' ' + '-' + ' ' + parseInt(val.yiledCutEp);
      val.unitDisplayName = this.selectedtemplate.unitDisplayName;
      // both numbers
    } else if (isNaN(val.yieldCutIbp) && isNaN(val.yiledCutEp) && val.yiledCutEp != undefined) {
      val.yieldCutDV = val.yieldCutIbp + ' ' + '-' + ' ' + val.yiledCutEp;
      val.unitDisplayName = '';

      // both names
    } else if (isNaN(val.yiledCutEp) && val.yiledCutEp != undefined) {
      val.yieldCutDV = parseInt(val.yieldCutIbp) + ' ' + '-' + ' ' + val.yiledCutEp;
      val.unitDisplayName = '';
      // EP name
    } else if (isNaN(val.yieldCutIbp) && val.yiledCutEp == undefined) {
      val.yieldCutDV = val.yieldCutIbp;
      val.unitDisplayName = '';

      // single name
    }
    else if (isNaN(val.yieldCutIbp)) {
      val.yieldCutDV = val.yieldCutIbp + ' ' + '-' + ' ' + parseInt(val.yiledCutEp);
      val.unitDisplayName = this.selectedtemplate.unitDisplayName;

      // IP name
    }
    else if (!isNaN(val.yieldCutIbp)) {
      val.yieldCutDV = parseInt(val.yieldCutIbp);
      val.unitDisplayName = this.selectedtemplate.unitDisplayName;
      // when only single number
    }
  }
  updateRow() {
    this.cutRangeBpDTO.isUpdate = true;
    this.cutRangeBpDTO.loading = true;







    this.cutRangeService.save(this.cutRangeBpDTO.gridData, this.cutRangeBpDTO.runObjectiveId).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.cutRangeBpDTO.loading = false;
      this.cutRangeBpDTO.isUpdate = false;

    }, error => {
      this.notify.showError(error.message);

    });

  }
  deleteRange(data, index) {
    if (this.cutRangeBpDTO.originalGridData.length > 0) {
      this.cutRangeBpDTO.isTableData = true;
      this.cutRangeBpDTO.originalGridData.splice(index, 1);

    } else {
      this.cutRangeBpDTO.isTableData = false;
      this.cutRangeBpDTO.showError = true;
    }
    this.getAllTechnology();

    if (index !== this.cutRangeBpDTO.gridData.length) {
    if(index >0 && !isNaN(this.cutRangeBpDTO.gridData[index - 1].endpointDV) && this.cutRangeBpDTO.gridData[index - 1].endpointDV !=="" && this.cutRangeBpDTO.gridData[index - 1].endpointDV !== null){
        this.cutRangeBpDTO.gridData[index].ibpDV = this.cutRangeBpDTO.gridData[index - 1].endpointDV;
        if(this.cutRangeBpDTO.gridData[index].endpointDV !== null && !isNaN(this.cutRangeBpDTO.gridData[index].endpointDV) && this.cutRangeBpDTO.gridData[index].endpointDV !==""){
          this.cutRangeBpDTO.gridData[index].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[index].ibpDV) + ' ' + '-' + ' ' + parseInt(this.cutRangeBpDTO.gridData[index].endpointDV);
  
        } else if(this.cutRangeBpDTO.gridData[index].ibpDV !=="" && this.cutRangeBpDTO.gridData[index].ibpDV !== null){
          this.cutRangeBpDTO.gridData[index].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[index].ibpDV);
          
        } else {
          this.cutRangeBpDTO.gridData[index].yieldCutDV = '';
          this.cutRangeBpDTO.gridData[index].unitDisplayName = '';


        } 
      }else{
        this.cutRangeBpDTO.gridData[index].ibpDV = this.cutRangeBpDTO.gridData[index-1].endpointDV;
        this.cutRangeBpDTO.gridData[index].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[index].endpointDV);
  
      }
    } 
   
  this.duplicateRowValidation();
    this.yieldCutRangeUpdate();

  }
  preventDots(evt){
    const charCode = evt.which ? evt.which : evt.keyCode;
    const number = evt.target.value.split('.');
    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    if(number.length > 1 && charCode === 46){
         return false;
    }
    
    
  }
  startRangeCheck(displayValueIP, rindex) {
   
    if (displayValueIP === null || displayValueIP === "") {
      this.cutRangeBpDTO.showError = true;
      this.cutRangeBpDTO.errorIndex = rindex;
      this.cutRangeBpDTO.isUpdate = true;
      this.cutRangeBpDTO.gridData[rindex].ibpDV='';

    } else if (isNaN(displayValueIP)) {
      this.cutRangeBpDTO.isValidDecimal = true;
      this.cutRangeBpDTO.showError = true;
      this.cutRangeBpDTO.errorIndex = rindex;

      this.cutRangeBpDTO.isUpdate = true;

    }

    else {
      this.cutRangeBpDTO.isValidDecimal = false;

      this.cutRangeBpDTO.isUpdate = true;
      if (rindex !== 0) {
      
      if(this.cutRangeBpDTO.gridData[rindex].endpointDV === null){
          this.cutRangeBpDTO.showError = true;

        }
        else if (parseFloat(displayValueIP) < parseFloat(this.cutRangeBpDTO.gridData[rindex - 1].endpointDV) 
        || (parseFloat(displayValueIP) === parseFloat(this.cutRangeBpDTO.gridData[rindex].endpointDV))
        || (parseFloat(this.cutRangeBpDTO.gridData[rindex].endpointDV) !== null && parseFloat(displayValueIP) > parseFloat(this.cutRangeBpDTO.gridData[rindex].endpointDV))) {
         
          this.cutRangeBpDTO.showError = true;
          this.cutRangeBpDTO.errorIndex = rindex;
          // tslint:disable-next-line:radix
          this.cutRangeBpDTO.gridData[rindex].ibpDV = parseFloat(displayValueIP);
          // tslint:disable-next-line:radix
        } 
        
        else if (rindex < this.cutRangeBpDTO.gridData.length - 1 && parseFloat(this.cutRangeBpDTO.gridData[rindex + 1].ibpDV) < parseFloat(this.cutRangeBpDTO.gridData[rindex].endpointDV)) {
          this.cutRangeBpDTO.showError = true;
          this.cutRangeBpDTO.errorIndex = rindex + 1;


          // tslint:disable-next-line:radix
          this.cutRangeBpDTO.gridData[rindex].ibpDV = parseFloat(displayValueIP);

          // tslint:disable-next-line:radix
        }
        else {
          // tslint:disable-next-line:radix
          this.cutRangeBpDTO.gridData[rindex].ibpDV = parseFloat(displayValueIP);
          // tslint:disable-next-line:max-line-length
          this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseFloat(this.cutRangeBpDTO.gridData[rindex].ibpDV) + ' ' + '-' + ' ' + parseFloat(this.cutRangeBpDTO.gridData[rindex].endpointDV);
          this.cutRangeBpDTO.showError = false;
        }
      } else {
        // tslint:disable-next-line:radix
        if (parseFloat(this.cutRangeBpDTO.gridData[0].endpointDV) !== null && parseFloat(displayValueIP) > parseFloat(this.cutRangeBpDTO.gridData[0].endpointDV) && displayValueIP === null) {
          this.cutRangeBpDTO.showError = true;
          this.cutRangeBpDTO.errorIndex = rindex;
          // tslint:disable-next-line:radix
          this.cutRangeBpDTO.gridData[rindex].ibpDV = parseFloat(displayValueIP);


        } else if(this.cutRangeBpDTO.gridData[0].endpointDV === null){
          this.cutRangeBpDTO.showError = true;

        } 
        else {
          this.cutRangeBpDTO.showError = false;
          // tslint:disable-next-line:radix
          this.cutRangeBpDTO.gridData[rindex].ibpDV = parseFloat(displayValueIP);



        }
      }


    }
    if (this.cutRangeBpDTO.gridData[rindex].endpointDV !== null
       && this.cutRangeBpDTO.gridData[rindex].ibpDV !== null
       && !isNaN(this.cutRangeBpDTO.gridData[rindex].ibpDV)
       && !isNaN(this.cutRangeBpDTO.gridData[rindex].endpointDV) 
       && this.cutRangeBpDTO.gridData[rindex].endpointDV !=="" 
       && this.cutRangeBpDTO.gridData[rindex].ibpDV !=="" ) {
      // tslint:disable-next-line:max-line-length
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].ibpDV) + ' ' + '-' + ' ' + parseInt(this.cutRangeBpDTO.gridData[rindex].endpointDV);

    } else if (this.cutRangeBpDTO.gridData[rindex].endpointDV === null
       && !isNaN(this.cutRangeBpDTO.gridData[rindex].endpointDV)
       && this.cutRangeBpDTO.gridData[rindex].endpointDV !=="" 
       && this.cutRangeBpDTO.gridData[rindex].ibpDV !=="") {
     
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].ibpDV);

    } else if (this.cutRangeBpDTO.gridData[rindex].ibpDV === null
       && !isNaN(this.cutRangeBpDTO.gridData[rindex].ibpDV) 
       && this.cutRangeBpDTO.gridData[rindex].ibpDV !=="" 
       && this.cutRangeBpDTO.gridData[rindex].endpointDV !=="") {
     
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].endpointDV);

    } else if((this.cutRangeBpDTO.gridData[rindex].ibpDV ==="" && this.cutRangeBpDTO.gridData[rindex].endpointDV === "") 
      || (this.cutRangeBpDTO.gridData[rindex].ibpDV ==="" && this.cutRangeBpDTO.gridData[rindex].endpointDV === null))
      {
     
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV ='';
      this.cutRangeBpDTO.gridData[rindex].unitDisplayName='';
    }
     else if(this.cutRangeBpDTO.gridData[rindex].ibpDV ==="" && this.cutRangeBpDTO.gridData[rindex].endpointDV !== null){

      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].endpointDV);
    }
     else if(this.cutRangeBpDTO.gridData[rindex].endpointDV ==="" && this.cutRangeBpDTO.gridData[rindex].ibpDV !== null){

      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].ibpDV);
    }
    
    this.yieldCutRangeUpdate();
  }
  endRangeCheck(displayValueEP, rindex) {
   
    if (displayValueEP === null || displayValueEP ==="") {
      this.cutRangeBpDTO.showError = true;
      this.cutRangeBpDTO.errorIndex = rindex;
      this.cutRangeBpDTO.isUpdate = true;
      this.cutRangeBpDTO.gridData[rindex].endpointDV='';

    } else if (isNaN(displayValueEP)) {
      this.cutRangeBpDTO.isValidDecimal = true;
      this.cutRangeBpDTO.showError = true;
      this.cutRangeBpDTO.errorIndex = rindex;

      this.cutRangeBpDTO.isUpdate = true;

    } else {
      if (this.isInsert) {
        this.cutRangeBpDTO.gridData[rindex + 1].ibpDV = parseFloat(displayValueEP);

        if (this.cutRangeBpDTO.gridData[rindex + 1].endpointDV !== null && !isNaN(this.cutRangeBpDTO.gridData[rindex + 1].endpointDV)) {
          this.cutRangeBpDTO.gridData[rindex + 1].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex + 1].ibpDV) + ' ' + '-' + ' ' + parseInt(this.cutRangeBpDTO.gridData[rindex + 1].endpointDV);

        } else if(!isNaN(this.cutRangeBpDTO.gridData[rindex + 1].endpointDV)) {
          this.cutRangeBpDTO.gridData[rindex + 1].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex + 1].ibpDV);

        } else{
          this.cutRangeBpDTO.gridData[rindex + 1].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex + 1].ibpDV);
          this.cutRangeBpDTO.showError = true;
          this.cutRangeBpDTO.errorIndex = rindex+1;
        }
      }
      this.isInsert = false;
      this.cutRangeBpDTO.isValidDecimal = false;

      this.cutRangeBpDTO.isUpdate = true;

      const type = 'End Point';

      // tslint:disable-next-line:radix
      if ((parseFloat(displayValueEP) < parseFloat(this.cutRangeBpDTO.gridData[rindex].ibpDV))
       || (parseFloat(displayValueEP) === parseFloat(this.cutRangeBpDTO.gridData[rindex].ibpDV)) 
       || (rindex !== 0 && parseFloat(this.cutRangeBpDTO.gridData[rindex].ibpDV) < parseFloat(this.cutRangeBpDTO.gridData[rindex - 1].endpointDV))) {
        this.cutRangeBpDTO.showError = true;
        this.cutRangeBpDTO.errorIndex = rindex;
        // tslint:disable-next-line:radix
        this.cutRangeBpDTO.gridData[rindex].endpointDV = parseFloat(displayValueEP);

        // tslint:disable-next-line:radix
      } 
     
        // tslint:disable-next-line:max-line-length
       else if (rindex > 0 && parseFloat(this.cutRangeBpDTO.gridData[rindex].ibpDV) === parseFloat(this.cutRangeBpDTO.gridData[rindex - 1].ibpDV)) {
        this.cutRangeBpDTO.showError = true;
        this.cutRangeBpDTO.errorIndex = rindex;
        // tslint:disable-next-line:radix
        this.cutRangeBpDTO.gridData[rindex].endpointDV = parseFloat(displayValueEP);
         this.duplicateRowValidation();

        // tslint:disable-next-line:max-line-length
      }
     
      else if (rindex < this.cutRangeBpDTO.gridData.length - 1 && parseFloat(displayValueEP) < parseFloat(this.cutRangeBpDTO.gridData[rindex + 1].ibpDV)) {
        this.cutRangeBpDTO.showError = true;
        // tslint:disable-next-line:radix
        this.cutRangeBpDTO.gridData[rindex].endpointDV = parseFloat(displayValueEP);
        // tslint:disable-next-line:max-line-length
        this.successiveRowValidation(displayValueEP, rindex, type);
        this.duplicateRowValidation();


      }


      else {
        this.cutRangeBpDTO.showError = false;
        // tslint:disable-next-line:radix
        this.cutRangeBpDTO.gridData[rindex].endpointDV = parseFloat(displayValueEP);
        this.successiveRowValidation(displayValueEP, rindex, type);
        this.duplicateRowValidation();






      }

    }
    if (this.cutRangeBpDTO.gridData[rindex].endpointDV !== null && this.cutRangeBpDTO.gridData[rindex].ibpDV !== null && !isNaN(this.cutRangeBpDTO.gridData[rindex].ibpDV) && !isNaN(this.cutRangeBpDTO.gridData[rindex].endpointDV) && this.cutRangeBpDTO.gridData[rindex].endpointDV !=="" && this.cutRangeBpDTO.gridData[rindex].ibpDV !=="") {
      // tslint:disable-next-line:max-line-length
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].ibpDV) + ' ' + '-' + ' ' + parseInt(this.cutRangeBpDTO.gridData[rindex].endpointDV);

    } else if (this.cutRangeBpDTO.gridData[rindex].endpointDV === null && !isNaN(this.cutRangeBpDTO.gridData[rindex].endpointDV) && this.cutRangeBpDTO.gridData[rindex].endpointDV !=="" && this.cutRangeBpDTO.gridData[rindex].ibpDV !=="") {
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].ibpDV);

    } else if (this.cutRangeBpDTO.gridData[rindex].ibpDV === null && !isNaN(this.cutRangeBpDTO.gridData[rindex].ibpDV) && this.cutRangeBpDTO.gridData[rindex].ibpDV !=="" && this.cutRangeBpDTO.gridData[rindex].endpointDV !=="") {
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].endpointDV);

    } else if(this.cutRangeBpDTO.gridData[rindex].ibpDV ==="" && this.cutRangeBpDTO.gridData[rindex].endpointDV === "" || (this.cutRangeBpDTO.gridData[rindex].ibpDV ===null && this.cutRangeBpDTO.gridData[rindex].endpointDV === "")){
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV ='';
      this.cutRangeBpDTO.gridData[rindex].unitDisplayName='';
    } else if(this.cutRangeBpDTO.gridData[rindex].ibpDV ==="" && this.cutRangeBpDTO.gridData[rindex].endpointDV !== null){
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].endpointDV);
    } else if(this.cutRangeBpDTO.gridData[rindex].endpointDV ==="" && this.cutRangeBpDTO.gridData[rindex].ibpDV !== null){
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = parseInt(this.cutRangeBpDTO.gridData[rindex].ibpDV);

   
    }
    this.yieldCutRangeUpdate();

  }
  yieldCutRange(value, rindex) {
    if(value === 'NaN'){
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = '';
      this.cutRangeBpDTO.gridData[rindex].unitDisplayName='';
    } else{
      this.cutRangeBpDTO.gridData[rindex].yieldCutDV = value;

    }

    this.yieldCutRangeUpdate();
  }

  successiveRowValidation(displayValueEP, index, type) {
    for (let i = index; i < this.cutRangeBpDTO.gridData.length - 1; i++) {
      // tslint:disable-next-line:max-line-length
      if (parseFloat(this.cutRangeBpDTO.gridData[i + 1].ibpDV) !== null && parseFloat(this.cutRangeBpDTO.gridData[i + 1].ibpDV) < parseFloat(this.cutRangeBpDTO.gridData[i].endpointDV) || (parseFloat(this.cutRangeBpDTO.gridData[i + 1].ibpDV) === null)) {
        this.cutRangeBpDTO.showError = true;
        this.cutRangeBpDTO.errorIndex = i;
        break;

      }
     
       else {
        this.cutRangeBpDTO.showError = false;
        this.cutRangeBpDTO.errorIndex = i;



      }
    }



  }

  duplicateRowValidation() {

    for (let i = 0; i < this.cutRangeBpDTO.gridData.length; i++) {
      if(isNaN(this.cutRangeBpDTO.gridData[i].endpointDV) 
      || (parseFloat(this.cutRangeBpDTO.gridData[i].ibpDV) === parseFloat(this.cutRangeBpDTO.gridData[i].endpointDV))
      || (i > 0 && parseFloat(this.cutRangeBpDTO.gridData[i].ibpDV) < parseFloat(this.cutRangeBpDTO.gridData[i - 1].ibpDV))
      || (i > 0 && parseFloat(this.cutRangeBpDTO.gridData[i].endpointDV) < parseFloat(this.cutRangeBpDTO.gridData[i - 1].endpointDV))
      || (i > 0 && parseFloat(this.cutRangeBpDTO.gridData[i].ibpDV) === parseFloat(this.cutRangeBpDTO.gridData[i - 1].ibpDV))
      || (i > 0 && parseFloat(this.cutRangeBpDTO.gridData[i].endpointDV) === parseFloat(this.cutRangeBpDTO.gridData[i - 1].endpointDV)
	  || (this.cutRangeBpDTO.gridData[i].endpointDV ==="" || this.cutRangeBpDTO.gridData[i].endpointDV === null))
     ){
        this.cutRangeBpDTO.showError = true;
        this.cutRangeBpDTO.errorIndex = i;
        break;
      }
     
      else if (i < this.cutRangeBpDTO.gridData.length - 1 && parseFloat(this.cutRangeBpDTO.gridData[i].ibpDV) === parseFloat(this.cutRangeBpDTO.gridData[i + 1].ibpDV)) {
        this.cutRangeBpDTO.showError = true;
        this.cutRangeBpDTO.errorIndex = i + 1;
        break;
      }
      else {
        this.cutRangeBpDTO.showError = false;
        this.cutRangeBpDTO.isUpdate = false;
      }
    }
  }

  // ===============================UOM Functionality==============================
  setUnits() {
    if (this.cutRangeBpDTO.variableCategory && this.cutRangeBpDTO.variableName) {
      // tslint:disable-next-line:max-line-length
      this.manageVariableService.getUOMListByCategoryAndVariable(this.cutRangeBpDTO.variableCategory, this.cutRangeBpDTO.variableName).subscribe(result => {
        this.cutRangeBpDTO.uomObjList = result.data;
        this.cutRangeBpDTO.loading = false;

        this.cutRangeBpDTO.uomObj = this.cutRangeBpDTO.uomObjList[0];
        this.cutRangeBpDTO.units = this.cutRangeBpDTO.uomObjList;


        // tslint:disable-next-line:no-shadowed-variable
        this.cutRangeBpDTO.units.forEach(value => {
          if (value.isDefaultUOM === true) {
            this.cutRangeBpDTO.defaultUnit = value;
          }
        });
        if (this.cutRangeBpDTO.defaultUnit) {
          this.unitsChange(this.cutRangeBpDTO.defaultUnit);
        }
        this.updateDisplayValue();

      });
    }
  }







  preventNonNumericalInput(e: any) {
    e = e || window.event;
    const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);
    if (!charStr.match(/^[0-9._-]+$/)) {
      e.preventDefault();
    }
  }

  unitsChange(data) {
    this.selectedtemplate = data;
    this.updateDisplayValue();


  }



  updateBaseValue() {
    this.cutRangeBpDTO.gridData.forEach((value, i) => {
      if (!isNaN(parseFloat(value.ibpDV))) {
        // tslint:disable-next-line:max-line-length
        if (this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME < '5') {
          // tslint:disable-next-line:max-line-length
          value.ibp = Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / (parseFloat(value.ibpDV) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs));
          // tslint:disable-next-line:max-line-length
          if (!isNaN(value.yieldCutIbp) && value.yieldCutIbp !=='') {
            value.y1 = Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / (parseFloat(value.yieldCutIbp) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs));

          } else {
            value.y1 = value.yieldCutIbp;
          }
        } else {
          // tslint:disable-next-line:max-line-length
          value.ibp = parseFloat(value.ibpDV) * Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);
          // tslint:disable-next-line:max-line-length
          if (!isNaN(value.yieldCutIbp) && value.yieldCutIbp !=='') {
            value.y1 = parseFloat(value.yieldCutIbp) * Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);

          } else {
            value.y1 = value.yieldCutIbp;
          }

        }

        value.ibpDV = parseFloat(value.ibpDV).toFixed(this.GetPrecison());
        value.ibpDV = isNaN(value.ibpDV) ? '' : value.ibpDV;
        if (!isNaN(value.yieldCutIbp) && value.yieldCutIbp !=='') {
          value.yieldCutIbp = parseFloat(value.yieldCutIbp).toFixed(this.GetPrecison());
          value.yieldCutIbp = isNaN(value.yieldCutIbp) ? '' : value.yieldCutIbp;
        }

        // tslint:disable-next-line:max-line-length
      } else if (value.ibpDV === '' || value.ibpDV === null || value.ibpDV === undefined || value.yieldCutIbp === '' || value.yieldCutIbp === null || value.yieldCutIbp === undefined) {
        value.ibp = null;
        value.yieldCutIbp = null;

      }

      if (!isNaN(parseFloat(value.endpointDV))) {
        // tslint:disable-next-line:max-line-length
        if (this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME < '5') {
          // tslint:disable-next-line:max-line-length
          value.endPoint = Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / (parseFloat(value.endpointDV) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs));

          // tslint:disable-next-line:max-line-length
          if (!isNaN(value.yiledCutEp) && value.yiledCutEp !=='') {
            value.y2 = Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / (parseFloat(value.yiledCutEp) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs));

          } else {
            value.y2 = value.yiledCutEp
          }


        } else {
          // tslint:disable-next-line:max-line-length
          value.endPoint = parseFloat(value.endpointDV) * Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);
          // tslint:disable-next-line:max-line-length
          if (!isNaN(value.yiledCutEp)  && value.yiledCutEp !=='') {
            value.y2 = parseFloat(value.yiledCutEp) * Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) + Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);

          } else {
            value.y2 = value.yiledCutEp;
          }

        }

        value.endpointDV = parseFloat(value.endpointDV).toFixed(this.GetPrecison());
        value.endpointDV = isNaN(value.endpointDV) ? '' : value.endpointDV;

        if (!isNaN(value.yiledCutEp)  && value.yiledCutEp !=='') {
          value.yiledCutEp = parseFloat(value.yiledCutEp).toFixed(this.GetPrecison());
          value.yiledCutEp = isNaN(value.yiledCutEp) ? '' : value.yiledCutEp;
        }


        // tslint:disable-next-line:max-line-length
      } else if (value.endpointDV === '' || value.endpointDV === null || value.endpointDV === undefined || value.yiledCutEp === '' || value.yiledCutEp === null || value.yiledCutEp === undefined) {
        value.endPoint = null;
      }

      value.yieldCutLabel = value.y1 + '-' + value.y2;




    });
  }

  updateDisplayValue() {
    let result;
    this.cutRangeBpDTO.gridData.forEach((value, i) => {
      if (value.yieldCutLabel !== undefined && isNaN(value.yieldCutLabel)) {
        result = value.yieldCutLabel.split('-');

      }
      // tslint:disable-next-line:max-line-length
      if (this.cutRangeBpDTO.variableCategory && this.cutRangeBpDTO.variableName && this.cutRangeBpDTO.defaultUnit && !isNaN(value.ibp) && (value.ibp !== null)
        && (value.ibp !== '')) {

        // tslint:disable-next-line:max-line-length
        if (this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME < '5') {
          // tslint:disable-next-line:max-line-length

          value['ibpDV'] = (Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / value.ibp) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);



          // tslint:disable-next-line:max-line-length
          if (!isNaN(result[0]) && result[0] !=="") {
            value['yieldCutIbp'] = (Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / result[0]) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);

          } else {
            value['yieldCutIbp'] = result[0];
          }

        } else {
          // tslint:disable-next-line:max-line-length
          value['ibpDV'] = (Number(value.ibp) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs)) / Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs);

          // tslint:disable-next-line:max-line-length
          if (!isNaN(result[0]) && result[0] !=="") {
            value['yieldCutIbp'] = (Number(result[0]) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs)) / Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs);

          } else {
            value['yieldCutIbp'] = result[0];
          }

        }
        value.ibpDV = parseFloat(value.ibpDV).toFixed(this.GetPrecison());
        value.ibpDV = isNaN(value.ibpDV) ? '' : value.ibpDV;
        if (!isNaN(value.yieldCutIbp) && value.yieldCutIbp !=="") {
          value.yieldCutIbp = parseFloat(value.yieldCutIbp).toFixed(this.GetPrecison());
          value.yieldCutIbp = isNaN(value.yieldCutIbp) ? '' : value.yieldCutIbp;
        }


      } else {
        value['ibpDV'] = null;
      }


      // tslint:disable-next-line:max-line-length
      if (this.cutRangeBpDTO.variableCategory && this.cutRangeBpDTO.variableName && this.cutRangeBpDTO.defaultUnit && !isNaN(value.endPoint) && (value.endPoint !== null)
        && (value.endPoint !== '')) {
        // tslint:disable-next-line:max-line-length
        if (this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.API || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME || this.cutRangeBpDTO.defaultUnit.unitDisplayName === UnitSelectorNames.BAUME < '5') {
          // tslint:disable-next-line:max-line-length
          value['endpointDV'] = (Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / value.endPoint) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);




          // tslint:disable-next-line:max-line-length
          if (!isNaN(result[1]) && result[1] !=="") {
            value['yiledCutEp'] = (Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs) / result[1]) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs);

          } else {
            value['yiledCutEp'] = result[1];
          }
        } else {
          // tslint:disable-next-line:max-line-length
          value['endpointDV'] = (Number(value.endPoint) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs)) / Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs);

          // tslint:disable-next-line:max-line-length
          if (!isNaN(result[1]) && result[1] !=="") {
            value['yiledCutEp'] = (Number(result[1]) - Number(this.cutRangeBpDTO.defaultUnit.interceptValueCs)) / Number(this.cutRangeBpDTO.defaultUnit.slopeValueCs);

          } else {
            value['yiledCutEp'] = result[1];
          }

        }
        value.endpointDV = parseFloat(value.endpointDV).toFixed(this.GetPrecison());
        value.endpointDV = isNaN(value.endpointDV) ? '' : value.endpointDV;

        if (!isNaN(value.yiledCutEp) && value.yiledCutEp !=="") {
          value.yiledCutEp = parseFloat(value.yiledCutEp).toFixed(this.GetPrecison());
          value.yiledCutEp = isNaN(value.yiledCutEp) ? '' : value.yiledCutEp;
        }



      } else {
        value['endpointDV'] = null;
      }
      if (value.yieldCutIbp === undefined && value.yiledCutEp === undefined 
       ) {
        value.yieldCutDV = '';
        value.unitDisplayName = '';
        // when empty row
      } 
       else if(value.yieldCutIbp ==="" && value.yiledCutEp){
        value.yieldCutDV='';
        value.unitDisplayName='';
       }
        else if(value.yieldCutIbp ===""){
        value.yieldCutDV=parseInt(value.yiledCutEp);
        value.unitDisplayName = this.selectedtemplate.unitDisplayName;
       }
       else if(value.yiledCutEp ===""){
        value.yieldCutDV=parseInt(value.yieldCutIbp);
        value.unitDisplayName = this.selectedtemplate.unitDisplayName;
       } 
      else if (!isNaN(value.yieldCutIbp) && !isNaN(value.yiledCutEp)) {
        value.yieldCutDV = parseInt(value.yieldCutIbp) + ' ' + '-' + ' ' + parseInt(value.yiledCutEp);
        value.unitDisplayName = this.selectedtemplate.unitDisplayName;
        // both numbers
      } else if (isNaN(value.yieldCutIbp) && isNaN(value.yiledCutEp) && value.yiledCutEp !== 'undefined') {
        value.yieldCutDV = value.yieldCutIbp + ' ' + '-' + ' ' + value.yiledCutEp;
        value.unitDisplayName = '';

        // both names
      } else if (isNaN(value.yiledCutEp) && value.yiledCutEp !== 'undefined') {
        value.yieldCutDV = parseInt(value.yieldCutIbp) + ' ' + '-' + ' ' + value.yiledCutEp;
        value.unitDisplayName = '';
        // EP name
      } else if (isNaN(value.yieldCutIbp) && value.yiledCutEp === 'undefined') {
        value.yieldCutDV = value.yieldCutIbp;
        value.unitDisplayName = '';

        // single name
      }
      else if (isNaN(value.yieldCutIbp)) {
        value.yieldCutDV = value.yieldCutIbp + ' ' + '-' + ' ' + parseInt(value.yiledCutEp);
        value.unitDisplayName = this.selectedtemplate.unitDisplayName;

        // IP name
      }
      else if (!isNaN(value.yieldCutIbp)) {
        value.yieldCutDV = parseInt(value.yieldCutIbp);
        value.unitDisplayName = this.selectedtemplate.unitDisplayName;
        // when only single number
      }
      



    })
  }






  GetPrecison() {
    if (this.cutRangeBpDTO.uomObj.variableDecimalPoint != null) {
      return this.cutRangeBpDTO.uomObj.variableDecimalPoint;
    } else {
      return 6;
    }
  }


  find(data: any) {
    if (this.cutRangeBpDTO.runObjectiveForm.dirty || this.cutRangeBpDTO.runObjectiveForm.valid) {
      this.runObjectiveService.findRunObjective(data).subscribe(result => {
        this.cutRangeBpDTO.runObjectiveRecords = result.body.data;
        if (result.body.data) {
          this.notify.showSuccess(result.body.message);
          this.cutRangeBpDTO.totalRecords = this.cutRangeBpDTO.runObjectiveRecords.length;
          this.cutRangeBpDTO.runObjectiveRecords = this.cutRangeBpDTO.runObjectiveRecords;
        } else {
          this.notify.showError(result.body.message);
          this.cutRangeBpDTO.totalRecords = this.cutRangeBpDTO.runObjectiveRecords.length;
          this.cutRangeBpDTO.nOfFlyRecordPage = this.cutRangeBpDTO.runObjectiveRecords.length;
          this.cutRangeBpDTO.runObjectiveRecords = this.cutRangeBpDTO.runObjectiveRecords.slice(0, this.cutRangeBpDTO.nOfFlyRecordPage);
        }
      },
        (error) => {
          this.cutRangeBpDTO.runObjectiveRecords = [];
          this.cutRangeBpDTO.runObjectiveRecords = null;
          this.cutRangeBpDTO.totalRecords = 0;
          this.notify.showError(error.message);
        });
    } else {
      this.notify.showError('Please Enter at least one field to search');
    }

  }

  resetForm() {
    this.cutRangeBpDTO.runObjectiveForm.reset();
    this.getRunObjectiveDetails();
    this.getAllTechnology();
    this.flyoutDTO = new flyOutFormDTO();
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.cutRangeBpDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.cutRangeBpDTO.loading = true;
        this.cutRangeBpDTO.isUpdate = false;
        this.cutRangeBpDTO.nOfRecordPage = 5;
        this.cutRangeBpDTO.nOfFlyRecordPage = 10;
        this.cutRangeBpDTO.isTableData = false;
        this.setUnits();
        this.standardCutFromControls();
        this.runObjectiveFormControls();
        this.getAllTechnology();
        this.cutRangeBpDTO.cols = [
          { field: 'objectiveName', header: 'Objective Name' }
        ];
      }
    })
  }

}
