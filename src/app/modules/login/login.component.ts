import { Component, OnInit } from '@angular/core';
import { Login } from './login';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import { NotificationService } from '../../core/services/notification/notification-service.service';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { CacheService, LocalStorageSave } from '../../core/services/cache/cache.service';
import { HttpService } from '../../core/services/http/http.service';
import { UomTemplateService } from '../manage/uom-template/uom-template.service';
import { CommonService } from '../../shared/common-services/common.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Login = new Login();
  loginForm: FormGroup;
  loginObj: any;
  localStorageObject: LocalStorageSave = new LocalStorageSave();
  responsefromAws: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private notify: NotificationService,
    public loginService: LoginService,
    private cacheService: CacheService,
    private uomService: UomTemplateService,
    private http: HttpService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.loginFormControl();
    localStorage.clear();
  }

  loginFormControl() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required]))
    });
  }
  onSubmitAws() {
    const data = '';
    this.loginService.awsLogin(data).subscribe(user => {
      this.responsefromAws = user;
    }, (error) => {
      this.notify.showError(error.message);
    });
  }
  onSubmit(data: any) {
    this.loginService.loading = true;
    data.userName = data.userName.trim();
    this.loginService.login(data).subscribe(user => {
      this.loginService.loading = false;
      const userDetails = this.commonService.encrypt(JSON.stringify(user.body.data));
      localStorage.setItem('userObj', userDetails);
      this.router.navigate(['/dashboard']);

    }, (error) => {
      this.loginService.loading = false;
      this.router.navigate(['/login']);
      this.notify.showError(error.message);
      this.cacheService.cleanLocalStorage();
    });
  }


}
