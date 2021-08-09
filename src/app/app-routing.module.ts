import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardService } from './core/services/auth-guard/auth-guard.service';
import { SkeletonComponent } from './shared/layout/skeleton/skeleton.component';
import { InventoryResolverService } from './modules/inventory/inventory-resolver.service';

@NgModule({
  imports: [
    [RouterModule.forRoot(
      [
        {
          path: '', redirectTo: 'login', pathMatch: 'full'
        },
        {
          path: 'login',
          loadChildren: './modules/login/login.module#LoginModule',
          data: {
            name: 'Login'
          }
        },
        {
          path: '', component: SkeletonComponent,
          children: [
            {
              path: 'dashboard', loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
              data: {
                name: 'Dashboard'
              },
              canActivate: [AuthGuardService],
            },
            {
              path: 'manage/roles', loadChildren: './modules/manage/roles/roles.module#RolesModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Role'
              }
            },
            {
              path: 'manage/user', loadChildren: './modules/manage/user/user.module#UserModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'User'
              }
            },
            {
              path: 'manage/technology',
              loadChildren: './modules/manage/technology/technology.module#TechnologyModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Technology'
              }
            },
            {
              path: 'manage/privilege',
              loadChildren: './modules/manage/privilege/privilege.module#PrivilegeModule',
              // canActivate: [AuthGuardService],
              data: {
                name: 'Privileges'
              }
            },
            {
              path: 'plant/all', loadChildren: './modules/manage/plant/plant.module#PlantModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Plant'
              }
            },
            {
              path: 'plant/locations',
              loadChildren: './modules/manage/location/location.module#LocationModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Location'
              }
            },
            {
              path: 'plant/buildings',
              loadChildren: './modules/manage/building/building.module#BuildingModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Building'
              }
              // resolve: {
              //   buildingDataList: BuildingResolverService
              // },
            },
            {
              path: 'manage/uom-template',
              loadChildren: './modules/manage/uom-template/uom-template.module#UomTemplateModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'UOM Template'
              }
            },
            {
              // tslint:disable-next-line: max-line-length
              path: 'manage/unit-of-measurement',
              loadChildren: './modules/manage/unit-of-measurement/unit-of-measurement.module#UnitOfMeasurementModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Unit Of Measurement'
              }
            },
            {
              path: 'manage/manage-variables/:id/:name',
              loadChildren: './modules/manage/manage-variables/manage-variables.module#ManageVariablesModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'manage-Variable'
              }
            },
            {
              path: 'manage/equipment',
              loadChildren: './modules/manage/equipment/equipment.module#EquipmentModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Equipment'
              }
            },
            {
              path: 'manage/calibration/:id',
              loadChildren: './modules/manage/caliberation/caliberation.module#CaliberationModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'calibration'
              }
            },
            {
              // tslint:disable-next-line:max-line-length
              path: 'feed-stack/create',
              loadChildren: './modules/feed-stack/feed-stack-create/feed-stack-create.module#FeedStackCreateModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Create'
              }
            },
            {
              path: 'catalyst/catalyst-main-masters',
              loadChildren: './modules/catalyst/catalyst-main-masters/catalyst-main-masters.module#CatalystMainMastersModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst'
              }
            },
            {
              path: 'catalyst/catalyst-loading-template',
              loadChildren: './modules/catalyst/catalyst-loading-template/catalyst-loading-template.module#CatalystLoadingTemplateModule'
              ,
              canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Loading Template'
              }
            },
            {
              path: 'catalyst/catalyst-application',
              loadChildren: './modules/catalyst/catalyst-application/catalyst-application.module#CatalystApplicationModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Application'
              }
            },
            {
              path: 'catalyst/scale',
              loadChildren: './modules/catalyst/catalyst-scale/catalyst-scale.module#CatalystScaleModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Scale'
              }
            },
            {
              path: 'catalyst/size',
              loadChildren: './modules/catalyst/catalyst-size/catalyst-size.module#CatalystSizeModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Size'
              }
            }
            ,
            {
              path: 'catalyst/shape',
              loadChildren: './modules/catalyst/catalyst-shape/catalyst-shape.module#CatalystShapeModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Shape'
              }
            },
            {
              path: 'catalyst/type',
              loadChildren: './modules/catalyst/catalyst-type/catalyst-type.module#CatalystTypeModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Type'
              }
            },
            {
              path: 'catalyst/alias',
              loadChildren: './modules/catalyst/catalyst-alias-ss/catalyst-alias-ss.module#CatalystAliasSsModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Alias ss'
              }
            },
            {
              path: 'catalyst/family',
              loadChildren: './modules/catalyst/catalyst-family/catalyst-family.module#CatalystFamilyModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Family'
              }
            },
            {
              path: 'lims',
              loadChildren: './modules/lims/lims-component/lims.module#LIMSModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'LIMS Component'
              }
            },
            {
              path: 'lims/analysis',
              loadChildren: './modules/lims/lims-analysis-method/lims-analysis-method.module#LimsAnalysisMethodModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'LIMS Analysis Method'
              }
            },
            {
              path: 'charts',
              loadChildren: './modules/reports/charts/charts.module#ChartsModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Charts'
              }
            },
            {
              path: 'plots',
              loadChildren: './modules/reports/plots/plots.module#PlotsModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Plots'
              }
            },
            {
              path: 'catalyst/state',
              loadChildren: './modules/catalyst/catalyst-state/catalyst-state.module#CatalystStateModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst State'
              }
            },
            {
              path: 'catalyst/diluent',
              loadChildren: './modules/catalyst/diluent/diluent.module#DiluentModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Diluent'
              }
            },
            {
              path: 'projects',
              loadChildren: './modules/projects/projects.module#ProjectsModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Project'
              }
            },
            {
              path: 'manage/phd',
              loadChildren: './modules/manage/phd/phd.module#PhdModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'PHD Tags'
              }
            },
            {
              path: 'manage/mode',
              loadChildren: './modules/manage/mode/mode.module#ModeModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Mode'
              }
            },
            {
              path: 'adsorbant',
              loadChildren: './modules/manage/manage-adsorbents/manage-adsorbents.module#ManageAdsorbentsModule'
              , canActivate: [AuthGuardService],
              data: {
                name: 'Adsorbents'
              }
            },
            {
              path: 'manage/recipe',
              loadChildren: './modules/manage/recipe/recipe.module#RecipeModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Recipe'
              }
            },
            {
              path: 'manage/runObjective',
              loadChildren: './modules/manage/run-objective/run-objective.module#RunObjectiveModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Run Objective'
              }
            },
            {
              path: 'manage/standardcutrange',
              loadChildren: './modules/manage/standard-cut-ranges/standard-cut-ranges.module#StandardCutRangesModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Standard cut ranges'
              }
            },
            {
              path: 'manage/chemichals-used',
              loadChildren: './modules/manage/chemicals-used/chemicals-used.module#ChemicalsUsedModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Chemicals Used'
              }
            },
            {
              path: 'manage/mpt-unit-ops',
              loadChildren: './modules/manage/mpt-unit-ops/mpt-unit-ops.module#MPTUnitOpsModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'MPT Unit Ops'
              }
            },
            {
              path: 'manage/units-ops',
              loadChildren: './modules/manage/manage-unit-ops/manage-unit-ops.module#ManageUnitOpsModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Unit Operations'
              }
            },
            {
              path: 'manage/raw-materials',
              loadChildren: './modules/manage/manage-raw-materials/manage-raw-materials.module#ManageRawMaterialsModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Raw Materials'
              }
            },
            {
              path: 'inventory/raw-material-inventory',
              loadChildren: './modules/inventory/raw-material-inventory/raw-material-inventory.module#RawMaterialInventoryModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Raw Material Inventory'
              },
              resolve: {
                uomData: InventoryResolverService
              }
            },
            {
              path: 'inventory/catalyst-inventory-management',
              // tslint:disable-next-line:max-line-length
              loadChildren: './modules/inventory/catalyst-inventory-management/catalyst-inventory-management.module#CatalystInventoryManagementModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Catalyst Inventory Management'
              },
              resolve: {
                uomData: InventoryResolverService
              }
            },
            {
              path: 'inventory/synthesized-material-inventory-management',
              // tslint:disable-next-line:max-line-length
              loadChildren: './modules/inventory/synthesized-material-inventory-management/synthesized-material-inventory-management.module#SynthesizedMaterialInventoryManagementModule',
              canActivate: [AuthGuardService],
              data: {
                name: 'Synthesized Material Inventory'
              },
              resolve: {
                uomData: InventoryResolverService
              }
            }
          ]
        },
      ], {
      // preload all modules; optionally we could
      // implement a custom preloading strategy for just some
      // of the modules (PRs welcome 😉)
      // preloadingStrategy: PreloadAllModules,
      // enableTracing: true  // <-- debugging purposes only
      useHash: false, onSameUrlNavigation: 'reload'
    })],
    //   RouterModule.forRoot(routes, {
    //   // preload all modules; optionally we could
    //   // implement a custom preloading strategy for just some
    //   // of the modules (PRs welcome 😉)
    //   // preloadingStrategy: PreloadAllModules,
    //   // enableTracing: true  // <-- debugging purposes only
    //   useHash: false, onSameUrlNavigation: 'reload'
    // }
    // )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
