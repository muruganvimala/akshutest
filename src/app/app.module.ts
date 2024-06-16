import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Page Route
import { AppRoutingModule } from './app-routing.module';
import { LayoutsModule } from './layouts/layouts.module';
import { ToastrModule } from 'ngx-toastr';

// Laguage
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// component
import { AppComponent } from './app.component';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { ApiService } from './API/api.service';
import { LoadingSpinnerComponent } from './pages/menu/loading-spinner/loading-spinner.component';

// Services
import { EventService } from './core/services/event.service';

// Guards
import { AuthGuard } from './core/guards/auth.guard';

export function initializeApp(apiService: ApiService) {
  return (): Promise<any> => {
    return apiService.loadConfig();
  };
}

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    AuthlayoutComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutsModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
      TuiRootModule,
      TuiDialogModule,
      TuiAlertModule
],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ApiService],
      multi: true
    },
      {provide: TUI_SANITIZER, useClass: NgDompurifySanitizer},
      AuthGuard,
    EventService
],
  bootstrap: [AppComponent]

})
export class AppModule { }
