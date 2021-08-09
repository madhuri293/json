import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/primeng';
import { ShowAuthedDirective } from './show-authed.directive';
import { ErrorComponent } from './error-component/error.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { CustomTableComponent } from '../core/custom-table/custom-table.component';
import { TreeModule } from 'primeng/tree';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorSketchModule } from 'ngx-color/sketch';
import { CalendarModule } from 'primeng/calendar';
import { ToastrManager } from 'ng6-toastr-notifications';
import { CustomModalComponent } from '../core/custom-modal/custom-modal.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { UomCtrlComponent } from '../core/uom-ctrl/uom-ctrl.component';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { DisplayPipe } from '../core/pipes/display.pipe';
import { ModalModule} from 'ngx-bootstrap';
import { SkeletonComponent } from './layout/skeleton/skeleton.component';
import { ChipsModule } from 'primeng/chips';
import { HeaderComponent } from './layout/skeleton/header/header.component';
import { SidebarComponent } from './layout/skeleton/sidebar/sidebar.component';
import { CopyPasteDirective } from '../core/directive/copy-paste.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    TableModule,
    PaginatorModule,
    TreeModule,
    ToastrModule.forRoot(),
    ColorSketchModule,
    ColorPickerModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    AngularDateTimePickerModule,
    ModalModule,
    ChipsModule
  ],
  declarations: [
    ShowAuthedDirective,
    ErrorComponent,
    CustomTableComponent,
    CustomModalComponent,
    UomCtrlComponent,
    DisplayPipe,
    SkeletonComponent,
    HeaderComponent,
    SidebarComponent,
    CopyPasteDirective
  ],
  exports: [
    CopyPasteDirective,
    TreeModule,
    CommonModule,
    ErrorComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ShowAuthedDirective,
    TableModule,
    PaginatorModule,
    CustomTableComponent,
    ColorSketchModule,
    ColorPickerModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    CustomModalComponent,
    UomCtrlComponent,
    DisplayPipe,
    AngularDateTimePickerModule,
    ModalModule,
    ChipsModule
  ],
  entryComponents: [CustomModalComponent],
  providers: [ToastrManager, DatePipe]
})
export class SharedModule { }
