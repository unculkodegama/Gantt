import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GanttGraphComponent} from "../component/gantt-graph.component";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {GanttTimeComponent} from "../component/gantt-time.component";
import {GanttCellsComponent} from "../component/graph-cells.component";
import {GanttBarsComponent} from "../component/gantt-bars.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DialogModule} from "./dialog.module";
import {BrowserModule} from "@angular/platform-browser";
import {NewTaskDialog} from "../dialog/new-task-dialog.component";
import {UpdateTaskDialog} from "../dialog/update-task-dialog.component";
import {NewSubTaskDialog} from "../dialog/new-subtask-dialog.component";
import {DragulaModule , DragulaService} from "ng2-dragula/ng2-dragula"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    DialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DragulaModule,
  ],
  exports: [
    GanttGraphComponent,
    GanttTimeComponent,
    GanttCellsComponent,
    GanttBarsComponent,
    BrowserAnimationsModule,
  ],
  declarations: [
    GanttGraphComponent,
    GanttTimeComponent,
    GanttCellsComponent,
    GanttBarsComponent,
    NewTaskDialog,
    UpdateTaskDialog,
    NewSubTaskDialog,
  ],
  providers: [GanttCellsComponent, DragulaService],

  entryComponents: [NewTaskDialog,UpdateTaskDialog, NewSubTaskDialog],
  bootstrap: [
    GanttGraphComponent,
    GanttTimeComponent,
    GanttCellsComponent,
    GanttBarsComponent,
    NewTaskDialog,
    UpdateTaskDialog,
    NewSubTaskDialog,
  ],
})

export class GanttGraphModule {
}
