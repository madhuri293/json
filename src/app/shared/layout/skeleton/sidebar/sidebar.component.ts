import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderService } from '../header/service/header.service';
import { SidebarDTO } from './sidebar.model';
import { DashboadrdService } from '../../../../modules/dashboard/dashboadrd.service';
import $ from 'jquery';
import { UserService } from '../../../../modules/manage/user/user.service';
import { HttpService } from '../../../../core/services/http/http.service';
import { CommonService } from '../../../common-services/common.service';
import { ValueType } from '../../../enum/enum.model';
import { NotificationService } from '../../../../core/services/notification/notification-service.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  toggleSideBar = false;
  sideBarDTO: SidebarDTO = new SidebarDTO();
  constructor(private dashboardService: DashboadrdService,
    private http: HttpService,
    private headerService: HeaderService,
    public location: Location,
    public router: Router,
    private userService: UserService,
    private commonSerivce: CommonService,
    private notify: NotificationService,) {
    router.events.subscribe((val) => {
      this.sideBarDTO.route = location.path();
    });
    this.toggleSideNav();

  }

  ngOnInit() {
    this.commonSerivce.statusFlag = false;
    this.toggleSideNav();
    if (localStorage.getItem('technology')) {
      this.loadSideMenu();
    }
    this.refresh();
    this.loadMenuOnTechnologySelect();
    const selectedCollapse = sessionStorage.getItem('selectedCollapse');
    if (selectedCollapse !== null && selectedCollapse !== undefined) {
      $('.accordion .collapse').removeClass('show');
      $(selectedCollapse).addClass('show');
    }
    $('.accordion .collapsed').on('click', function () {
      const target = $(this).data('target');
      sessionStorage.setItem('selectedCollapse', target);
    });
  }

  onMouseEnter() {
    this.headerService.sendToggleFlag(this.toggleSideBar);
    const appMiniSidebar: HTMLElement = document.querySelector('.app-mini-sidebar');
    const mainContainer: HTMLElement = document.querySelector('.main-container');
    const sidebarContainer: HTMLElement = document.querySelector('.sidebar');
    const sideMinibarContainer: HTMLElement = document.querySelector('.mini-navbar');


    if (appMiniSidebar) {
      if (sideMinibarContainer.style.width = '60px') {
        mainContainer.style.marginLeft = '230px';
        mainContainer.style.width = 'calc(100% - 230px)';
        sideMinibarContainer.style.width = '230px';
        sidebarContainer.classList.remove('mini-navbar');
        sideMinibarContainer.classList.remove('remove-hover-navbar');
      }
    }
  }

  onMouseLeave() {
    this.headerService.sendToggleFlag(this.toggleSideBar);
    const appMiniSidebar: HTMLElement = document.querySelector('.app-mini-sidebar');
    const mainContainer: HTMLElement = document.querySelector('.main-container');
    const sidebarContainer: HTMLElement = document.querySelector('.sidebar');
    const sideExpandContainer: HTMLElement = document.querySelector('.expand-navbar');


    if (appMiniSidebar) {
      if (sideExpandContainer.style.width = '230px') {
        mainContainer.style.marginLeft = '60px';
        mainContainer.style.width = 'calc(100% - 60px)';
        sideExpandContainer.style.width = '60px';
        sideExpandContainer.classList.add('remove-hover-navbar');
        sidebarContainer.classList.add('mini-navbar');
      }
    }
  }

  toggleSideNav(): void {
    this.headerService.sendFlag.subscribe(flag => {
      this.sideBarDTO.hideSidebar = flag;
      this.sideBarDTO.mobileToggleSideBar = flag;
    });
  }



  onactive(activeroute: number) {
    this.sideBarDTO.activeval = activeroute;
    this.sideBarDTO.route = '';
  }

  onSubMenuClick(route: string) {
    this.sideBarDTO.currentRoute = '/' + route;
    this.router.navigate(['/' + route]);
  }

  loadSideMenu() {
    if (!this.commonSerivce.statusFlag) {
      this.sideBarDTO.loading = true;
    }
    this.http.get('./assets/path.json').subscribe(pathObject => {
      this.sideBarDTO.pathList = pathObject;
      const user = JSON.parse(this.commonSerivce.decrypt(localStorage.getItem('userObj')));
      const technology = localStorage.getItem('technology');
      const role = user.technologyRoles.filter(userTechnology => userTechnology.technologyId === technology);
      if(role.length > 0){
        this.userService.getSideMenu(technology, role[0].roleId).subscribe(result => {
          const pathList = new Array();
          const parentMenuList = new Array();
          result.data.forEach(element => {
            parentMenuList.push(element);
            pathList.push(element.children);
          });
          const menuArray = [].concat.apply([], pathList);
          this.commonSerivce.privilege = menuArray;
          localStorage.setItem('privilege', this.commonSerivce.encrypt(JSON.stringify(menuArray)));
          this.sideBarDTO.list = parentMenuList;
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE1).length) {
            this.sideBarDTO.menuName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE1))[0].label;
            this.sideBarDTO.manageMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE1))[0].children;
            this.sideBarDTO.manageMenuList.forEach(menuItem => {
              menuItem.path = this.sideBarDTO.pathList[menuItem.label];
            });
          }
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE2).length) {
            this.sideBarDTO.inventoryName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE2))[0].label;
            this.sideBarDTO.inventoryMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE2))[0].children;
            this.sideBarDTO.inventoryMenuList.forEach(res => {
              res.path = this.sideBarDTO.pathList[res.label];
            });
          }
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE3).length) {
            this.sideBarDTO.plantName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE3))[0].label;
            this.sideBarDTO.plantMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE3))[0].children;
            this.sideBarDTO.plantMenuList.forEach(menuItem => {
              menuItem.path = this.sideBarDTO.pathList[menuItem.label];
            });
          }
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE4).length) {
            this.sideBarDTO.feedName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE4))[0].label;
            this.sideBarDTO.feedMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE4))[0].children;
            this.sideBarDTO.feedMenuList.forEach(menuItem => {
              menuItem.path = this.sideBarDTO.pathList[menuItem.label];
            });
          }
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE5).length) {
            this.sideBarDTO.projectName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE5))[0].label;
            this.sideBarDTO.projectMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE5))[0].children;
            this.sideBarDTO.projectMenuList.forEach(menuItem => {
              menuItem.path = this.sideBarDTO.pathList[menuItem.label];
            });
          }
  
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE6).length) {
            this.sideBarDTO.catalystName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE6))[0].label;
            this.sideBarDTO.catalystMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE6))[0].children;
            this.sideBarDTO.catalystMenuList.forEach(menuItem => {
              menuItem.path = this.sideBarDTO.pathList[menuItem.label];
            });
          }
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE7).length) {
            this.sideBarDTO.limsName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE7))[0].label;
            this.sideBarDTO.limsMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE7))[0].children;
            this.sideBarDTO.limsMenuList.forEach(menuItem => {
              menuItem.path = this.sideBarDTO.pathList[menuItem.label];
            });
          }
          if (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE8).length) {
            this.sideBarDTO.reportsName = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE8))[0].label;
            this.sideBarDTO.reportMenuList = (parentMenuList.filter(res => res.functionOrderNumber === ValueType.TYPE8))[0].children;
            this.sideBarDTO.reportMenuList.forEach(menuItem => {
              menuItem.path = this.sideBarDTO.pathList[menuItem.label];
            });
          }
          this.sideBarDTO.loading = false;
        }, (error => {
          this.notify.showSuccess(error.message);
          this.sideBarDTO.loading = false;
        }));
      } else {
        this.sideBarDTO.loading = false;

      }
    
    });
  }

  refresh() {
    this.headerService.sendLoadMenuFlag.subscribe(flag => {
      if (flag) {
        this.sideBarDTO.manageMenuList = [];
        this.sideBarDTO.projectMenuList = [];
        this.sideBarDTO.catalystMenuList = [];
        this.sideBarDTO.feedMenuList = [];
        this.sideBarDTO.inventoryMenuList = [];
        this.sideBarDTO.limsMenuList = [];
        this.sideBarDTO.plantMenuList = [];
        this.sideBarDTO.reportMenuList = [];
        this.loadSideMenu();
      }
    });
  }

  loadMenuOnTechnologySelect() {
    this.dashboardService.isTechnologySelected.subscribe(flag => {
      if (flag) {
        this.loadSideMenu();
      }
    });
  }


}
