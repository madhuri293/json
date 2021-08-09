import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl, Validators} from '@angular/forms';
import { ManageRecipe, ManageRecipeDTO } from './recipe.model';
import { RecipeService } from './recipe.service';
import { NotificationService } from '../../../core/services/notification/notification-service.service';
import { SPACE_REGEXP } from '../../../core/validators.ts/validators';
import { BsModalService } from 'ngx-bootstrap';
import { CustomModalComponent } from '../../../core/custom-modal/custom-modal.component';
import { DeleteMessageEnum, StatusEnum } from '../../../shared/enum/enum.model';
import { CommonService } from '../../../shared/common-services/common.service';
import { BehaviorSubject } from 'rxjs';
import { DashboadrdService } from '../../dashboard/dashboadrd.service';
import { PlantService } from '../plant/plant.service';
import { UnitOfMeasurementService } from '../unit-of-measurement/unit-of-measurement.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html'
})
export class RecipeComponent implements OnInit {


  manageRecipe: ManageRecipe = new ManageRecipe();
  manageRecipeDTO: ManageRecipeDTO = new ManageRecipeDTO();
  constructor(private formBuilder: FormBuilder, private router: ActivatedRoute,
    private recipeService: RecipeService, private notify: NotificationService, private route: Router,
    private bsModalService: BsModalService, private commonService: CommonService, private dashboardService: DashboadrdService,
    public plantService: PlantService, public measurementService: UnitOfMeasurementService) {
    this.manageRecipeDTO.privilege = this.commonService.applyPrivilege(router.snapshot.data.name);
  }

  ngOnInit() {
    this.refresh();
    this.dashboardService.showTechnologyHeader = true;
    this.manageRecipeDTO.loading = true;

    this.manageRecipeDTO.isEnable = false;
    this.manageRecipeFromControls();
    this.manageRecipeDTO.nOfRecordPage = 10;

    this.manageRecipeDTO.columns = [
      { field: 'plantCode', header: 'Plant' },
      { field: 'tagCode', header: 'Code Recipe Tag' },
      { field: 'tagName', header: 'Description' },
      { field: 'unitName', header: 'Recipe UOM' },
      { field: 'tagMinValue', header: 'Min Value' },
      { field: 'tagMaxValue', header: 'Max Value' },
      { field: 'energized', header: 'Energized' },

    ];
    if (this.manageRecipeDTO.privilege) {
      this.manageRecipeDTO.columns.push({ field: 'delete', header: 'Action' });
    }
    this.getTechnologies();
    this.getRecipeUOM();
    this.getManageRecipeList();
    this.getPlantList();
    this.manageRecipeDTO.min = null;
    this.manageRecipeDTO.max = null;
    this.manageRecipeDTO.minerrormsg = '';
  }
  manageRecipeFromControls() {
    this.manageRecipeDTO.manageRecipeForm = this.formBuilder.group(
      {
        technology: new FormControl('', Validators.compose([])),
        plant: new FormControl('', Validators.compose([Validators.required])),
        recipeTag: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20),
        Validators.pattern(SPACE_REGEXP)])),
        description: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100),
        Validators.pattern(SPACE_REGEXP)])),
        recipeUOM: new FormControl('', Validators.compose([Validators.required])),
        minValue: new FormControl('', Validators.compose([])),
        maxValue: new FormControl('', Validators.compose([])),
        energized: new FormControl('', Validators.compose([Validators.maxLength(10), Validators.pattern(SPACE_REGEXP)])),

      }
    );
  }
  onResetClick() {
    this.manageRecipeDTO.isEnable = false;
    this.getManageRecipeList();
    this.manageRecipe = new ManageRecipe();
    this.manageRecipeDTO.manageRecipeForm.reset();
    this.manageRecipeDTO.min = null;
    this.manageRecipeDTO.max = null;
    this.manageRecipeDTO.minerrormsg = '';
    this.getPlantList();
    this.getTechnologies();
    this.commonService.sendToggleFlag(true);


  }
  convertUppercase(energized: string) {
    if (energized) {
      this.manageRecipe.energized = energized.toLocaleUpperCase();
    }

  }
  getManageRecipeList() {
    this.manageRecipeDTO.loading = true;
    this.recipeService.getAllRecipe().subscribe(result => {
      this.manageRecipeDTO.loading = false;

      this.manageRecipeDTO.rows = result.data;
      this.manageRecipeDTO.totalRecords = this.manageRecipeDTO.rows.length;
      this.manageRecipeDTO.numberOfRecords = this.manageRecipeDTO.rows.length;
    },
      (error) => {
        this.manageRecipeDTO.loading = false;
        this.notify.showError(error.message);
      });
  }

  getTechnologies() {
    const selectedTechnology = localStorage.getItem('technology');
    this.manageRecipe.technologyId = selectedTechnology;
    this.dashboardService.getTechnologies().subscribe(result => {
      this.manageRecipeDTO.manageTechnologyList = result.data;
      this.manageRecipeDTO.manageTechnologyList = this.manageRecipeDTO.manageTechnologyList.filter(val => val.status === StatusEnum.Y);
      this.manageRecipeDTO.manageTechnologyList = this.manageRecipeDTO.manageTechnologyList.filter(
        tech => tech.technologyId === selectedTechnology);

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  getPlantList() {
    this.plantService.getActivePlants().subscribe(result => {
      this.manageRecipeDTO.managePlantList = result.data.filter(plant => plant.status === StatusEnum.Y);
      this.manageRecipe.plantId = null;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  getRecipeUOM() {
    this.manageRecipeDTO.loading = true;
    this.measurementService.getActiveUom().subscribe(result => {

      this.manageRecipeDTO.manageRecipeUOMList = result;
      this.manageRecipeDTO.loading = false;
    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  onRoleEditClick(evt: any) {
    this.manageRecipeDTO.isEnable = true;
    this.manageRecipeDTO.isDisabled = false;
    this.manageRecipe = new ManageRecipe();
    this.recipeService.getById(evt.id).subscribe(role => {
      this.manageRecipe = role.data;

    },
      (error) => {
        this.notify.showError(error.message);
      });
  }

  saveManageRecipe(manageRecipe: any) {
    this.manageRecipeDTO.isEnable = false;
    this.manageRecipeDTO.isDisabled = true;
    if (manageRecipe.id) {
      this.recipeService.update(manageRecipe).subscribe(result => {
        this.manageRecipeDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
        this.manageRecipeDTO.managePlantList = null;
      },
        (error) => {
          this.manageRecipeDTO.isDisabled = false;
          this.notify.showError(error.message);
        });

    } else {
      this.recipeService.save(manageRecipe).subscribe(result => {
        this.manageRecipeDTO.isDisabled = false;
        this.notify.showSuccess(result.body.message);
        this.onResetClick();
        this.manageRecipeDTO.managePlantList = null;
      }, (error) => {
        this.manageRecipeDTO.isDisabled = false;
        this.notify.showError(error.message);
      });
    }


  }
  find(manageRecipe: any) {
    this.manageRecipeDTO.totalRecords = 0;
    if (this.manageRecipeDTO.manageRecipeForm.valid || this.manageRecipeDTO.manageRecipeForm.dirty) {
      this.manageRecipeDTO.rows = [];

      this.manageRecipeDTO.loading = true;
      this.recipeService.find(manageRecipe).subscribe(result => {
        this.manageRecipeDTO.rows = result.body.data;
        this.commonService.sendToggleFlag(true);

        this.manageRecipeDTO.manageRecipeList = result.body.data.length;
        this.manageRecipeDTO.totalRecords = this.manageRecipeDTO.rows.length;
        this.notify.showSuccess(result.body.message);
        this.manageRecipeDTO.loading = false;
      },
        (error) => {
          this.manageRecipeDTO.manageRecipeList = [];
          this.manageRecipeDTO.totalRecords = 0;
          this.notify.showError(error.message);
          this.manageRecipeDTO.loading = false;
        });
    } else {
      this.notify.showError('Enter at least one field to search');
    }

  }


  deleteConfirmation(manageRecipe: any) {
    this.manageRecipeDTO.idToDelete = manageRecipe.id;
    this.manageRecipeDTO.skId = manageRecipe.technologyId;
    const modal = this.bsModalService.show(CustomModalComponent, { class: 'modal-md' });
    (modal.content as CustomModalComponent).showConfirmationModal(
      DeleteMessageEnum.TITLE, DeleteMessageEnum.MESSAGE
    );
    (modal.content as CustomModalComponent).onClose.subscribe((result: boolean) => {
      if (result) {
        this.onManageRecipeDelete(this.manageRecipeDTO.idToDelete, this.manageRecipeDTO.skId);
        this.commonService.configFlag = new BehaviorSubject(false);
      }
    });
  }
  onManageRecipeDelete(data: number, sk: any) {
    this.recipeService.delete(data, sk).subscribe(result => {
      this.notify.showSuccess(result.body.message);
      this.onResetClick();
    },
      (error) => {
        this.notify.showError(error.message);
      });

  }


  checkmin(minvalue: any) {
    this.manageRecipeDTO.min = minvalue;
    // tslint:disable-next-line:radix
    if (this.manageRecipeDTO.max !== '' && parseInt(this.manageRecipeDTO.min) > parseInt(this.manageRecipeDTO.max)) {
      this.manageRecipeDTO.minerrormsg = 'Min cannot be greater than Max';
    } else {
      this.manageRecipeDTO.minerrormsg = '';
    }
  }

  checkmax(maxvalue: any) {
    this.manageRecipeDTO.max = maxvalue;
    // tslint:disable-next-line:radix
    if (this.manageRecipeDTO.min !== '' && parseInt(this.manageRecipeDTO.min) > parseInt(this.manageRecipeDTO.max)) {
      this.manageRecipeDTO.minerrormsg = 'Min cannot be greater than Max';
    } else {
      this.manageRecipeDTO.minerrormsg = '';
    }
  }
  refresh() {
    this.commonService.loadComponent.subscribe(loadFlag => {
      if (loadFlag) {
        this.manageRecipeDTO.privilege = this.commonService.applyPrivilege(this.router.snapshot.data.name);
        this.dashboardService.showTechnologyHeader = true;
        this.manageRecipeDTO.loading = true;

        this.manageRecipeDTO.isEnable = false;
        this.manageRecipeFromControls();
        this.manageRecipeDTO.nOfRecordPage = 10;
        this.manageRecipeDTO.totalRecords = 10;

        this.manageRecipeDTO.columns = [
          { field: 'plantCode', header: 'Plant' },
          { field: 'tagCode', header: 'Tag Code' },
          { field: 'tagName', header: 'Tag Name' },
          { field: 'unitName', header: 'Recipe UOM' },
          { field: 'tagMinValue', header: 'Min Value' },
          { field: 'tagMaxValue', header: 'Max Value' },
          { field: 'energized', header: 'Energized' },

        ];
        if (this.manageRecipeDTO.privilege) {
          this.manageRecipeDTO.columns.push({ field: 'delete', header: 'Action' });
        }
        this.getTechnologies();
        this.getRecipeUOM();
        this.getManageRecipeList();
        this.getPlantList();
        this.manageRecipeDTO.min = null;
        this.manageRecipeDTO.max = null;
        this.manageRecipeDTO.minerrormsg = '';
      }
    })
  }
}
