import { Component, OnInit } from '@angular/core';
import { HeaderService } from './service/header.service';
import { HeaderDTO } from './service/header.model';
import $ from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboadrdService } from '../../../../modules/dashboard/dashboadrd.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UomTemplateService } from '../../../../modules/manage/uom-template/uom-template.service';
import { CommonService } from '../../../common-services/common.service';
import { HttpService } from '../../../../core/services/http/http.service';
import { UserService } from '../../../../modules/manage/user/user.service';
import { LoginService } from '../../../../modules/login/login.service';
import { NotificationService } from '../../../../core/services/notification/notification-service.service';
import { StatusEnum } from '../../../enum/enum.model';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  headerDTO: HeaderDTO = new HeaderDTO();
  technology: any;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private notify: NotificationService,
    public http: HttpService, private userService: UserService, private loginSerivce: LoginService,
    public dashboardService: DashboadrdService, private commonService: CommonService,
    private headerService: HeaderService, private router: Router, private uomService: UomTemplateService) {
  }

  ngOnInit() {
    const self = this;
    this.headerFormControls();
    $(function () {
      $('.mini-navbar .accordion li').hover(function () {
        self.sidenavToggle();
      });
    });
    this.onTechnologySelect();
    this.headerDTO.selectedTechnologyId = localStorage.getItem('technology');
    const userDetails = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.headerDTO.userName = userDetails.eId;
    if (userDetails.firstName !== null) {
      const fisrt = userDetails.firstName.split('');
      this.headerDTO.userName = fisrt[0];
    }
    if (userDetails.lastName !== null) {
      const second = userDetails.lastName.split('');
      this.headerDTO.userName = this.headerDTO.userName + second[0];
    }


    this.dashboardService.getTechnologies().subscribe(result => {
      this.headerDTO.technologyList = result.data;
      this.headerDTO.technologyList = this.headerDTO.technologyList.filter(val => val.status === StatusEnum.Y);

    }, error => {
    });

  }
  headerFormControls() {
    this.headerDTO.headerForm = this.formBuilder.group({
      technology: ['', Validators.required]
    });
  }


  goToDashboard(technology: any) {
    this.commonService.statusFlag = true;
    this.headerDTO.loading = true;
    this.headerService.sendSideMenuFlag(true);
    let permissionArray;
    this.headerDTO.technologyList.forEach(element => {
      if (element.technologyName === technology) {
        this.headerDTO.selectedTechnologyId = element.technologyId;
        localStorage.setItem('technology', element.technologyId);
        this.dashboardService.technologyId = element.technologyId;
      }
    });
    this.http.get('./assets/path.json').subscribe(pathResponse => {
      const userObj = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
      const techId = localStorage.getItem('technology');
      const role = userObj.technologyRoles.filter(userTechnology => userTechnology.technologyId === techId);
      this.userService.getSideMenu(techId, role[0].roleId)
        .toPromise().then(privilegeData => {
          const parentMenuList = new Array();
          privilegeData.data.forEach(element => {
            parentMenuList.push(element.children);
          });
          const menuArray = [].concat.apply([], parentMenuList);
          const pathName = Object.keys(pathResponse).find(key => pathResponse[key] === location.pathname.substring(1));
          permissionArray = menuArray.filter(privilegeObj => privilegeObj.label === pathName);
          if (permissionArray[0] && permissionArray[0].children[1].isEnabled) {

            this.commonService.canReloadComponent(true);
            this.headerDTO.loading = false;
          } else {
            this.router.navigate(['/dashboard']);
            this.headerDTO.loading = false;
          }
        });

    });
    const user = JSON.parse(this.commonService.decrypt(localStorage.getItem('userObj')));
    this.uomService.getTemplateId(user.userId).subscribe(res => {
      localStorage.setItem('templateId', res.data.id);
    });
  }
  sidenavToggle() {
    this.headerDTO.toggleSideBar = !this.headerDTO.toggleSideBar;
    this.headerService.sendToggleFlag(this.headerDTO.toggleSideBar);


    const mainContainer: HTMLElement = document.querySelector('.main-container');
    const sidebarContainer: HTMLElement = document.querySelector('.sidebar');
    const appSidebarContainer: HTMLElement = document.querySelector('app-sidebar');
    const parentEle1 = (appSidebarContainer.parentNode as HTMLElement);
    sidebarContainer.classList.remove('remove-hover-navbar');
    
    sidebarContainer.classList.remove('mini-navbar');

    if (!this.headerDTO.toggleSideBar) {
      if (sidebarContainer.style.width = '60px') {
        mainContainer.style.marginLeft = '230px';
        mainContainer.style.width = 'calc(100% - 230px)';
        sidebarContainer.style.width = '230px';
        parentEle1.classList.remove('app-mini-sidebar');

      }
    }

    if (this.headerDTO.toggleSideBar) {
      if (sidebarContainer.style.width = '230px') {
        mainContainer.style.marginLeft = '60px';
        mainContainer.style.width = 'calc(100% - 60px)';
        sidebarContainer.style.width = '60px';
        parentEle1.classList.add('app-mini-sidebar');
      } else {
        mainContainer.style.marginLeft = '60px';
        mainContainer.style.width = 'calc(100% - 60px)';
        sidebarContainer.style.width = '60px';
      }
    }
  }



  mobileSidenavToggle() {
    if (window.screen.width < 768) {


      this.headerDTO.mobileToggleSideBar = !this.headerDTO.mobileToggleSideBar;
      this.headerService.sendToggleFlag(this.headerDTO.mobileToggleSideBar);


      const mainContainer: HTMLElement = document.querySelector('.main-container');
      const sidebarContainer: HTMLElement = document.querySelector('.sidebar');

      mainContainer.style.marginLeft = '0px';
      mainContainer.style.width = 'calc(100% - 0px)';
      sidebarContainer.style.width = '230px';

      if (this.headerDTO.mobileToggleSideBar) {
        if (sidebarContainer.style.width = '-230px') {
          mainContainer.style.marginLeft = '0px';
          mainContainer.style.width = 'calc(100% - 0px)';
          sidebarContainer.style.width = '230px';
          sidebarContainer.style.marginLeft = '0px';
        }
      }

      if (!this.headerDTO.mobileToggleSideBar) {
        if (sidebarContainer.style.width = '0px') {
          mainContainer.style.marginLeft = '00px';
          mainContainer.style.width = 'calc(100% - 0px)';
          sidebarContainer.style.width = '230px';
          sidebarContainer.style.marginLeft = '-230px';
        }
      }

    }
  }
  logout() {
    this.loginSerivce.logout().subscribe(logoutResponse => {
      localStorage.clear();
      sessionStorage.clear();
      this.dashboardService.sendTechnologyFlag(false);
      this.headerService.sendSideMenuFlag(false);
      this.dashboardService.technologyId = null;
    }, error => {
      this.notify.showError('Something went wrong, try again later');
    });

  }

  loadSideMenu() {
    this.headerService.sendSideMenuFlag(true);
  }
  onTechnologySelect() {
    this.dashboardService.currentTechnology.subscribe(selectedTechnology => {
      this.headerDTO.selectedTechnologyId = selectedTechnology;
    });
  }
}
