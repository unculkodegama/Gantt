import { BrowserModule } from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {GanttGraphModule} from "./module/gantt-graph.module";
import {GanttComponentService} from "./services/gantt-component.service";
import {HttpService} from "./services/http-service";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import {HttpGetProvider} from "./services/http-provider";
import {DragulaModule , DragulaService} from "ng2-dragula/ng2-dragula"
import {CommonModule} from "@angular/common";

export function httpFactory(provider: HttpGetProvider) {
   return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    GanttGraphModule,
    HttpModule,
    HttpClientModule,
    DragulaModule,

  ],
  exports: [
    AppComponent
  ],
  providers: [GanttComponentService, DragulaService, HttpService, HttpGetProvider,
    { provide: APP_INITIALIZER, useFactory: httpFactory, deps:[HttpGetProvider], multi:true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
