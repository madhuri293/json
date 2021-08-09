import { FormGroup } from '@angular/forms';

export class HeaderDTO {
  toggleSideBar = false;
  mobileToggleSideBar = false;
  technologyList: any;
  name: any;
  headerForm: FormGroup;
  userName: any;
  loading:boolean;
  selectedTechnologyId: any;
}
