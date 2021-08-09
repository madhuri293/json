import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SharedModule } from './shared';
import { AppRoutingModule } from './app-routing.module';
import { TreeModule } from 'angular-tree-component';
import { ErrorInterceptor } from './core/services/Interceptors/error-interceptor';
import { FeedStackComponent } from './modules/feed-stack/feed-stack.component';
import { AppConfig } from './app-config';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap';
import { TokenInterceptor } from './core/services/Interceptors/token-interceptor';

export function initConfig(config: AppConfig) {
  return () => { config.load(); };
}

@NgModule({
  declarations: [
    AppComponent,
    FeedStackComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TreeModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [AppConfig,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true },
    BsModalRef, BsModalService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
