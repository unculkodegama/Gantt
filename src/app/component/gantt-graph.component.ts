import {Component, OnInit, OnChanges, EventEmitter} from "@angular/core";
import {GanttComponentService} from "../services/gantt-component.service";
import {HttpService} from "../services/http-service";
import {Task} from "../model/task";
import  {MatDialog, MatDialogConfig, MatSnackBar, MatIconRegistry} from '@angular/material';
import {NewTaskDialog} from "../dialog/new-task-dialog.component";
import {UpdateTaskDialog} from "../dialog/update-task-dialog.component";
import {HttpGetProvider} from "../services/http-provider";
import {DomSanitizer} from "@angular/platform-browser";
import {Zooming} from "../model/interfaces";
import {NewSubTaskDialog} from "../dialog/new-subtask-dialog.component";
import {ParentTask} from "../model/parentTask";
import {DragulaModule} from 'ng2-dragula/ng2-dragula';
import {DragulaService} from 'ng2-dragula/components/dragula.provider';

@Component({
  selector: 'gantt-graph',
  templateUrl: '../html/gantt-graph.component.html',
  styleUrls: ['../css/gantt-graph.component.css'],
})

export class GanttGraphComponent implements OnInit {

  tasks: Task[];
  parentTasks: ParentTask[];

  private name: string;
  private dates: Date;
  private description: string;
  private colorPack: string;

  private containerHeight: any;
  private containerWidth: any;

  private graphContainerSizes: any;
  private ganttGraphHeight: any;
  private ganttGraphWidth: any;

  private zoom: EventEmitter<string> = new EventEmitter<string>();
  private zoomLevel: string = Zooming[Zooming.Out];

  toggle: any = {};

  private dimensions = {
    height: 0,
    width: 0
  };

  public gridColumns: any[] = [

    {name: '', left: 0, width: 30}, //offset
    {name: 'Úloha', left: 20, width: 220},
    {name: 'Hotovo(%)', left: 0, width: 90},
    {name: 'Trvanie', left: 20, width: 120},
    {name: '', left: 0, width: 50}

  ];

  constructor(private dragulaService: DragulaService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private snackBar: MatSnackBar, private ganttComponentService: GanttComponentService, private httpService: HttpService, private dialog: MatDialog, private provider: HttpGetProvider) {
    this.tasks = this.provider.httpGetTasks();
    this.parentTasks = this.ganttComponentService.reconstuctSQLLikeSomething(this.tasks);

    dragulaService.drop.subscribe(value => this.onDrop());
    dragulaService.setOptions('parent', {
      invalid: () => false,
      revertOnSpill: true
    });

    dragulaService.setOptions('child', {
      invalid: () => false,
      revertOnSpill: true
    });

    iconRegistry.addSvgIcon(
      'zoomIn',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/search-plus.svg'));

    iconRegistry.addSvgIcon(
      'zoomOut',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/search-minus.svg'));

    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/add.svg'));

    iconRegistry.addSvgIcon(
      'right',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/caret-right.svg'));

    iconRegistry.addSvgIcon(
      'down',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/caret-down.svg'));
  }

  onDrop() {
    this.ganttComponentService.setPosition(this.parentTasks, this.tasks)
  }

  ngOnInit() {

    this.ganttComponentService.TIME_RANGE = this.ganttComponentService.calculateRange(this.ganttComponentService.getAllTasksStartDate(this.tasks), this.ganttComponentService.getAllTasksEndDate(this.tasks));
    this.containerWidth = this.calculateContainerWidth();
    this.containerHeight = this.calculateContainerHeight();
    this.graphContainerSizes = this.ganttComponentService.calculateGraphContainerDimensions();

    this.setDimensions();
    this.setSizes();
  }

  resetTimeRange() {
    this.ganttComponentService.TIME_RANGE = this.ganttComponentService.calculateRange(this.ganttComponentService.getAllTasksStartDate(this.tasks), this.ganttComponentService.getAllTasksEndDate(this.tasks));
    this.containerWidth = this.calculateContainerWidth();
    this.containerHeight = this.calculateContainerHeight();
    this.graphContainerSizes = this.ganttComponentService.calculateGraphContainerDimensions();

    this.setDimensions();
    this.setSizes();

    this.getTasks();

    for (let i = 0; i < this.tasks.length; i++) {
      this.ganttComponentService.setPercentCompleted(this.tasks[i]);
      this.ganttComponentService.controlPercentShift(this.tasks[i]);
    }
  }

  setGridScaleStyle() {
    let height = this.ganttComponentService.rowHeight;

    return {
      'height': height + 2 + 'px',
      'line-height': height + 'px',
      'width': this.ganttComponentService.gridWidth + 'px',
    };
  }

  setGridRowStyle(isParent: boolean): any {
    if (isParent) {
      return {
        'height': this.ganttComponentService.rowHeight + 'px',
        'line-height': this.ganttComponentService.rowHeight + 'px',
        'font-weight': 'bold',
      };
    }

    return {
      'height': this.ganttComponentService.rowHeight + 'px',
      'line-height': this.ganttComponentService.rowHeight + 'px'
    };
  }

  setDimensions() {
    this.dimensions.height = this.containerHeight;
    this.dimensions.width = this.containerWidth;
  }

  private calculateContainerHeight(): number {
    if (this.tasks != null) {
      return this.tasks.length * this.ganttComponentService.rowHeight;
    }
  }

  /* Nastavevie šírky Containeru v diagrame */
  private calculateContainerWidth(): number {
    if (this.zoomLevel === Zooming[Zooming.In]) {
      return this.ganttComponentService.TIME_RANGE.length * this.ganttComponentService.cellWidthIn + 45; // 45 je kvoli offsetu z prava -> pekne vykreslenie uloh na pravom konci.
    } else {
      return this.ganttComponentService.TIME_RANGE.length * this.ganttComponentService.cellWidth + 45; // 45 je kvoli offsetu z prava -> pekne vykreslenie uloh na pravom konci.
    }
  }

  public calculateTasksHeight(): string {
    if (this.tasks != null) {
      return `${this.tasks.length * this.ganttComponentService.rowHeight + 10}px`;
    }
  }

  public calculateTasksHeightField(): string {
    if (this.tasks != null) {
      if (this.tasks.length < 11) {
        return `${11 * this.ganttComponentService.rowHeight + 10}px`;
      } else {
        return `${this.tasks.length * this.ganttComponentService.rowHeight + 10}px`;
      }
    }
  }

  onResize(event: any): void {
    let activityContainerSizes = this.ganttComponentService.calculateGraphContainerDimensions();
    this.ganttGraphWidth = activityContainerSizes.width;
  }

  private setSizes(): void {
    this.ganttGraphHeight = this.graphContainerSizes.height + 'px';
    this.ganttGraphWidth = this.graphContainerSizes.width;
  }

  submitTask(name: string, start: Date, end: Date, description: string, percent: number, family: string, colorPack: string, parentID?: string) {
    let parent: string;
    let UUID = this.ganttComponentService.createUUID();

    if (parentID == null) {
      parent = UUID;
    } else {
      parent = parentID;
    }

    let priorModel = new Task(UUID, parent, name, start, end, description, null, null, family, colorPack);
    this.httpService.createTask(priorModel).subscribe();
    setTimeout(() => {
      this.resetTimeRange()
    }, 1000);
  }

  updateTask(id: string, parentId: string, name: string, start: Date, end: Date, description: string, percent: number, family: string, colorPack: string, posit?: number) {

    let priorModel = new Task(id, parentId, name, start, end, description, percent, null, family, colorPack, posit);
    this.httpService.updateTask(priorModel).subscribe();
    setTimeout(() => {
      this.resetTimeRange()
    }, 1000);
  }

  getTasks(): void {
    this.httpService.getTasks().subscribe(tasks => this.tasks = tasks);
    this.parentTasks = this.ganttComponentService.reconstuctSQLLikeSomething(this.tasks);

  }

  openNewTaskDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      name: this.name,
      dates: {
        begin: null,
        end: null,
      },
      description: this.description,
      colour: this.colorPack,
    };

    let dialogRef = this.dialog.open(NewTaskDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(results1 => {
      if (results1 != null) {
        if (results1.name != null) {

          this.submitTask(results1.name, results1.dates.begin, results1.dates.end, results1.description, null, 'parent', results1.colour.name);
          setTimeout(() => {
            this.getTasks()
          }, 500);

          this.snackBar.open('Úloha bola úspešne vytvorená.', null, {duration: 2000});
        }
      }
    })
  }

  openNewSubTaskDialog(task: Task): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      name: this.name,
      dates: {
        begin: null,
        end: null,
      },
      description: this.description,
      task: task,
    };

    let dialogRef = this.dialog.open(NewSubTaskDialog, dialogConfig);
    let dateEnd: Date;

    dialogRef.afterClosed().subscribe(results2 => {
      if (results2 != null) {
        if (results2.name != null && results2.dates.begin != null && results2.dates.end != null) {

          dateEnd = results2.dates.end;

          if (results2.dates.begin.toDateString() === results2.dates.end.toDateString()) {
            dateEnd = this.ganttComponentService.addDays(results2.dates.end, 1);
          }

          this.submitTask(results2.name, results2.dates.begin, dateEnd, results2.description, null, 'child', task.colorPack, task.id);
          setTimeout(() => {
            this.getTasks()
          }, 500);
          this.snackBar.open('Úloha bola úspešne vytvorená.', null, {duration: 2000});
        }
      }
    })
  }

  openUpdateTaskDialog(task: any): void {
    let start: any;
    let end: any;
    let numberOfChild: number = 0;
    let some = task.parentId;
    let parentTask = this.tasks.filter(parent => {
      return parent.id == some && task.family == 'child'
    });

    if (task.family == 'parent') {
      start = task.startOfTasks;
      end = task.endOfTasks;
    } else {
      start = task.start;
      end = task.end;
    }

    if (task.family == 'parent' && task.tasks.length > 0) {
      numberOfChild = task.tasks.length;
    }

    if (task.family == 'child') {
      numberOfChild = 0;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      name: task.name,
      id: task.id,
      dates: {
        begin: start,
        end: end,
      },
      description: task.description,
      parentName: parentTask,
      task: task,
      colour: task.colorPack,
      number: numberOfChild,
    };

    let dialogRef = this.dialog.open(UpdateTaskDialog, dialogConfig);
    let dateEnd: Date;

    dialogRef.beforeClose().subscribe(() => {
      setTimeout(() => {
        this.getTasks()
      }, 500);
      setTimeout(() => {
        this.resetTimeRange()
      }, 1000);
    });

    dialogRef.afterClosed().subscribe(results => {
      if (results != null) {
        if (task.family == 'parent') {
          if (results.name != task.name || results.colour != task.colorPack || results.dates.begin != task.startOfTasks || results.dates.end != task.endOfTasks) {

            this.updateTask(task.id, task.parentId, results.name, results.dates.begin, results.dates.end, results.description, task.percentCompleted, task.family, results.colour, task.position);

            this.setChildrenColor(task, results.colour);

            setTimeout(() => {
              this.getTasks()
            }, 500);

            this.snackBar.open('Úloha bola úspešne upravená.', null, {duration: 2000});
          }

        } else {
          if (results.name != task.name || results.dates.begin != task.start || results.dates.end != task.end) {

            dateEnd = results.dates.end;

            if (results.dates.begin.toDateString() === results.dates.end.toDateString()) {
              dateEnd = this.ganttComponentService.addDays(results.dates.end, 1);
            }

            this.updateTask(task.id, task.parentId, results.name, results.dates.begin, dateEnd, results.description, task.percentCompleted, task.family, parentTask[0].colorPack);

            setTimeout(() => {
              this.getTasks()
            }, 500);
            this.snackBar.open('Úloha bola úspešne upravená.', null, {duration: 2000});
          }
        }
      }
    })
  }

  setChildrenColor(task: any, color: string) {

    if (task.tasks.length != 0) {
      for (let i = 0; i < task.tasks.length; i++) {
        this.updateTask(task.tasks[i].id, task.tasks[i].parentId, task.tasks[i].name, task.tasks[i].start, task.tasks[i].end, task.tasks[i].description, task.tasks[i].percentCompleted, task.tasks[i].family, color);
      }
    }
  }

  zoomTasks() {
    if (this.zoomLevel === 'Out') {
      this.zoomLevel = 'In';
    } else {
      this.zoomLevel = 'Out';
    }

    this.zoom.emit(this.zoomLevel);
    this.containerWidth = this.calculateContainerWidth();
    this.setDimensions();
  }

  setZoomIcon(): string {
    if (this.zoomLevel === 'Out') {
      return `zoomIn`;
    } else {
      return `zoomOut`;
    }
  }

  setShowLevel(i) {
    this.toggle[i] = !this.toggle[i];

    if (this.toggle[i] == true) {
      this.parentTasks[i].setShow(true);
    } else {
      this.parentTasks[i].setShow(false);
    }

  }

  onVerticalScroll(verticalScroll: any, ganttGridData: any, ganttGraphArea: any): void {
    this.ganttComponentService.scrollTops(verticalScroll, ganttGridData, ganttGraphArea);
  }

  /** for future use - to make it without constant http get
   *
   createNewParentTask(UUID: string, parent: string, name: string, start: Date, end: Date, description: string, family: string, colorPack: string) {
   let parentTaskModel: ParentTask;

   parentTaskModel = new ParentTask(UUID, parent, name, start, end, description, null, family, colorPack);

   this.parentTasks.push(parentTaskModel);
   }

   */

}
