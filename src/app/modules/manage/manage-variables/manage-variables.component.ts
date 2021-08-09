import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageVariableService } from './manage-variable.service';
import { UomTemplateService } from '../uom-template/uom-template.service';
import { FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { ManageVariableDTO } from './mamange-variable.model';
import { CommonService } from '../../../shared/common-services/common.service';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';

@Component({
  selector: 'app-manage-variables',
  templateUrl: './manage-variables.component.html'
})
export class ManageVariablesComponent implements OnInit {

  manageVariableDTO: ManageVariableDTO = new ManageVariableDTO();
  originalArray: any;
  feedStock: boolean;
  feedStockId:any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public manageVariableService: ManageVariableService,
    private uomTemplateService: UomTemplateService,
    private notify: NotificationService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private dashboardService: DashboadrdService
  ) {
    this.manageVariableDTO.privilege = this.commonService.applyPrivilege(this.route.snapshot.data.name);
  }


  ngOnInit() {
    this.dashboardService.showTechnologyHeader = false;

    this.manageVariableDTO.disableFlag = false;
    this.manageVariableDTO.templateName = this.uomTemplateService.name;
    this.activatedRoute.params.subscribe(params => {
      this.manageVariableDTO.templateName = params.name;
      this.manageVariableDTO.templateId = params.id;
    });
    this.manageVariableDTO.variableForm = this.fb.group({
      variables: this.fb.array([])
    });
    this.getApplication();

  }
  getApplication() {
    this.manageVariableService.get().subscribe(result => {
      this.manageVariableDTO.applicationList = result.data;
    });
  }

  onBackClick() {
    this.router.navigate(['/manage/uom-template']);
  }
  onSelect(id: any) {
    this.manageVariableService.loading = true;
    const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.manageVariableService.getUOMVariableList(this.manageVariableDTO.templateId, id, user.userId).subscribe(result => {
      this.manageVariableDTO.variablesData = result.data;
      if(this.manageVariableDTO.variablesData[1] && this.manageVariableDTO.variablesData[1].variableName === 'IBP'){
        this.feedStock = true;
        this.feedStockId = id;
      
      } else {
        this.feedStock = false
      }
      if (!this.manageVariableDTO.variablesData.length) {
        this.notify.showError('No variables Data');
        this.manageVariableDTO.disableFlag = false;
        this.manageVariableService.loading = false;
      } else {
        this.manageVariableDTO.disableFlag = true;
        this.manageVariableService.loading = false;
        this.generateForm();
       

       
      }
    });




  }


  generateForm() {
    this.manageVariableDTO.variableForm = this.fb.group({
      variables: this.fb.array([])
    });
    this.manageVariableDTO.variablesData.forEach((item: any) => {
      this.addRow(item);
    });
  }

  addRow(item) {
    const control = <FormArray>this.manageVariableDTO.variableForm.get('variables');
    control.push(this.initiatForm(item));
  }

  initiatForm(item: any): FormGroup {

      return this.fb.group({
    
        variableName: [item.variableName],
        categoryId: [item.categoryId],
        variableDecimalPoint: [item.variableDecimalPoint, Validators.compose([Validators.required, Validators.pattern(/^[0-9]\d*$/)])],
        uomTemplateId: [item.uomTemplateId],
        defaultUOMId: [item.defaultUOMId],
        uomVariableId: [item.uomVariableId],
        id: [item.id],
        createdByUserId: [item.createdByUserId],
        updatedByUserId: [item.updatedByUserId],
    
   
    
    })
      }
    
  onUpdateClick() {
    this.manageVariableService.loading = true;
   
   
    if(this.feedStock){
      this.manageVariableDTO.variableForm.value.variables[0].variableDecimalPoint = this.manageVariableDTO.variableForm.value.variables[1].variableDecimalPoint;
      this.manageVariableService.update(this.manageVariableDTO.variableForm.value.variables).subscribe(
        (response: any) => {
          this.manageVariableService.loading = false;
          this.notify.showSuccess('Variables updated successfully');
         this.onSelect(this.feedStockId);
        },
        error => {
          this.manageVariableService.loading = false;
          this.notify.showError('Something went wrong');
        }
      );
    } else {
      this.manageVariableService.update(this.manageVariableDTO.variableForm.value.variables).subscribe(
        (response: any) => {
          this.manageVariableService.loading = false;
          this.notify.showSuccess('Variables updated successfully');
        },
        error => {
          this.manageVariableService.loading = false;
          this.notify.showError('Something went wrong');
        }
      );
    }
   
  }
}
