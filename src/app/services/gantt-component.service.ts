import {Injectable} from "@angular/core";
import {GanttConfiguration} from "./gantt-configuration.service";
import {ITaskBarStyle} from "../model/interfaces";
import {v4 as uuid} from 'uuid';

import {Task} from '../model/task';
import {HttpService} from "./http-service";
import {ParentTask} from "../model/parentTask";

@Injectable()
export class GanttComponentService {
  public rowHeight: number = 0;
  public cellWidth: number = 0;
  public windowInnerWidth: number = 0;
  public activityHeight: number = 0;
  public barHeight: number = 0;
  public barLineHeight: number = 0;
  public barTop: number = 0;
  public gridWidth: number = 530; // šírka úloh (bar)

  public cellWidthIn: number; //šírka cellu pri zoomu !!! - o 40px menej nez original

  private barStyles: ITaskBarStyle[] = [
    {
      colorPack: 'Cyan',
      completedColor: "#0097A7",
      backgroundColor: "#26C6DA",
      border: "1px solid #0097A7",
      progressBackgroundColor: "#00BCD4"
    },
    {
      colorPack: 'Teal',
      completedColor: "#00796B",
      backgroundColor: "#4DB6AC",
      border: "1px solid #00796B",
      progressBackgroundColor: "#009688"
    },
    {
      colorPack: 'Brown',
      completedColor: "#795548",
      backgroundColor: "#D7CCC8",
      border: "1px solid #795548",
      progressBackgroundColor: "#A1887F"
    },
    {
      colorPack: 'BlueGray',
      completedColor: "#546E7A",
      backgroundColor: "#B0BEC5",
      border: "1px solid #546E7A",
      progressBackgroundColor: "#78909C"
    },
    {
      colorPack: 'LightBlue',
      completedColor: "#0288D1",
      backgroundColor: "#4FC3F7",
      border: "1px solid #0288D1",
      progressBackgroundColor: "#03A9F4"
    },
  ];

  public TIME_RANGE: any[];

  constructor(private httpService: HttpService) {

    let _ganttConfiguration = new GanttConfiguration();

    this.cellWidthIn = _ganttConfiguration.cellWidthIn;
    this.rowHeight = _ganttConfiguration.rowHeight;
    this.cellWidth = _ganttConfiguration.cellWidth;
    this.activityHeight = _ganttConfiguration.graphHeight;
    this.barHeight = _ganttConfiguration.barHeight;
    this.barLineHeight = _ganttConfiguration.barLineHeight;
    this.barTop = _ganttConfiguration.rowHeight;
  }

  reconstuctSQLLikeSomething(tasks: Task[]): ParentTask[] {
    let parentTasks: ParentTask[] = [];
    let parentTaskModel: ParentTask;
    let percentTotal: number = 0;

    if (tasks != null) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].family == 'parent') {

          parentTaskModel = new ParentTask(tasks[i].id, tasks[i].parentId, tasks[i].name, tasks[i].start, tasks[i].end, tasks[i].description, null, null, tasks[i].colorPack, tasks[i].position);

          for (let i = 0; i < tasks.length; i++) {

            if (tasks[i].family == 'child' && parentTaskModel.id == tasks[i].parentId) {
              parentTaskModel.pushTaskToParent(tasks[i]);
            }

            if (tasks[i].family == 'child' && parentTaskModel.id == tasks[i].parentId && tasks[i].percentCompleted > 0) {
              percentTotal += tasks[i].percentCompleted;
            }
          }

          if (parentTaskModel.tasks.length != 0) {
            parentTaskModel.setStart(this.getStartDate(parentTaskModel.tasks));
            parentTaskModel.setEnd(this.getEndDate(parentTaskModel.tasks));
            if (percentTotal > 0) {
              parentTaskModel.setPercent(Math.round(percentTotal / parentTaskModel.tasks.length));
            }
          }

          parentTasks.push(parentTaskModel);
          percentTotal = 0;
        }
      }
    }

    for (let i = 0; i < parentTasks.length; i++) {
      if (parentTasks[i].tasks.length > 1) {
        parentTasks[i].tasks.sort((a, b): number => {
          if (a.start.getTime() < b.start.getTime()) return -1;
          if (a.start.getTime() > b.start.getTime()) return 1;
          return 0;
        });
      }
    }

    parentTasks.sort((a, b): number => {
      if (a.position < b.position) return -1;
      if (a.position > b.position) return 1;
      return 0;
    });

    return parentTasks;
  }

  setIndex(parentTasks: any[], id: string): number {
    let index: number = 0;

    for (let i = 0; i < parentTasks.length; i++) {
      if (parentTasks[i].id == id) {
        return index;
      } else {
        index++;
      }

      if (parentTasks[i].show == false) {
        for (let j = 0; j < parentTasks[i].tasks.length; j++) {
          if (parentTasks[i].tasks[j].id == id) {
            return index;
          } else {
            index++;
          }
        }
      }
    }
  }

  calculateBarWidth(start: Date, end: Date, zoomIn?: boolean): number {

    if (typeof start === "string") {
      start = new Date(start);
    }

    if (typeof end === "string") {
      end = new Date(end);
    }

    if (start.getFullYear() != 1970 && end.getFullYear() != 1970) {
      let days = this.calculateDifferenceOfDays(start, end);
      if (days == 0) {
        days = 1;
      }
      let width: number = days * this.cellWidth;
      if (zoomIn) {
        width = days * this.cellWidthIn;
      }
      return width;
    } else {
      return 0;
    }
  }

  calculateDifferenceOfDays(start: Date, end: Date): number {
    try {
      let oneDay = 24 * 60 * 60 * 1000;
      let diffDays = Math.abs((start.getTime() - end.getTime()) / (oneDay));
      let days = diffDays;

      return days;
    } catch (err) {
      return 0;
    }
  }

  calculateTotalDuration(tasks: any[]): string {

    if (tasks != null) {

      let oneHour = 60 * 60 * 1000;
      let today: Date = new Date();
      let hoursToComplete: number = 0;

      for (let i = 0; i < tasks.length; i++) {
        tasks[i].startOfTasks = new Date(tasks[i].startOfTasks);
        tasks[i].endOfTasks = new Date(tasks[i].endOfTasks);

        let diffHours = (Math.abs((tasks[i].startOfTasks.getTime() - tasks[i].endOfTasks.getTime()) / oneHour));
        let duration = diffHours;

        if (today.getTime() >= tasks[i].startOfTasks.getTime()) {
          duration = Math.round(this.calculateDifferenceOfDays(today, tasks[i].endOfTasks) * 24);
        }

        if (today.getTime() >= tasks[i].endOfTasks.getTime()) {
          duration = 0;
        }

        hoursToComplete += duration;
      }

      if (hoursToComplete === 0) {
        return '0';
      }

      if (hoursToComplete > 24) {
        return `${Math.round((hoursToComplete) / 24)} dní`; // total duration in days
      } else if (hoursToComplete >= 1) {
        return `${Math.round(hoursToComplete)} hodín`; // total duration in hours
      }
    }
  }

  calculateParentDuration(tasks: any): string {

    let start: Date;
    let end: Date;

    let oneHour = 60 * 60 * 1000;
    let today: Date = new Date();
    let hoursToComplete: number = 0;

    if (tasks.tasks.length != 0) {
      start = this.getStartDate(tasks.tasks);
      end = this.getEndDate(tasks.tasks);
    } else {
      start = new Date(tasks.startOfTasks);
      end = new Date(tasks.endOfTasks);
    }
    let diffHours = (Math.abs((start.getTime() - end.getTime()) / oneHour));
    let duration = diffHours;

    if (today.getTime() >= start.getTime()) {
      duration = Math.round(this.calculateDifferenceOfDays(today, end) * 24);
    }

    if (today.getTime() >= end.getTime()) {
      duration = 0;
    }

    hoursToComplete += duration;

    if (hoursToComplete === 0) {
      return '0';
    }

    if (hoursToComplete > 24) {
      return `${Math.round((hoursToComplete) / 24)} dní`; // total duration in days
    } else if (hoursToComplete >= 1) {
      return `${Math.round(hoursToComplete)} hodín`; // total duration in hours
    }

  }

  calculateChildDuration(task: Task): string {
    if (task.start != null && task.end != null) {
      task.start = new Date(task.start);
      task.end = new Date(task.end);

      let today: Date = new Date();
      let oneHour = 60 * 60 * 1000;
      let diffHours = (Math.abs((task.start.getTime() - task.end.getTime()) / oneHour));
      let duration = diffHours;

      if (duration == 0) {
        duration = 24;
      }

      if (today.getTime() >= task.start.getTime()) {
        duration = Math.round(this.calculateDifferenceOfDays(today, task.end) * 24);
      }

      if (today.getTime() >= task.end.getTime()) {
        duration = 0;
      }

      if (duration > 24) {
        return `${Math.round(duration / 24)} dní`; // partial task duration in days
      } else if (duration >= 1) {
        return `${Math.round(duration)} hodín`; // partial task duration in hours
      }
    }
    return '0';
  }

  isDayWeekend(date: Date): string {
    let day = date.getDay();
    let today: Date = new Date();
    let whatDay: string = '';

    if (day === 6 || day === 0) {
      whatDay = 'weekend';
    }

    if (date.toDateString() === today.toDateString()) {
      whatDay = 'today';
    }
    return whatDay;
  }

  calculateRange(start: Date, end: Date) {

    let range: any[] = [];

    let startDate: Date;
    let endDate: Date;

    let today = new Date();

    if (today.getTime() <= start.getTime()) {
      startDate = today;
    } else {
      startDate = start;
    }

    endDate = this.addDays(end, 27); // nastavenie datumu zobrazenia od posledneho datumu !!!

    while (startDate.getTime() <= endDate.getTime()) {
      range.push(startDate);
      startDate = this.addDays(startDate, 1);
    }
    return range;
  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  getAllTasksStartDate(tasks: Task[]): Date {
    let firstDate: Date;

    if (tasks.length != 0) {
      firstDate = new Date(tasks[0].start);
      for (let i = 0; i < tasks.length; i++) {
        tasks[i].start = new Date(tasks[i].start);
        if (tasks[i].start < firstDate) {
          firstDate = tasks[i].start;
        }
      }
      return firstDate;
    } else {
      firstDate = new Date();
      return firstDate;
    }
  }

  getAllTasksEndDate(tasks: Task[]): Date {
    let firstDate: Date;

    if (tasks.length != 0) {
      firstDate = new Date(tasks[0].end);
      for (let i = 0; i < tasks.length; i++) {
        tasks[i].end = new Date(tasks[i].end);
        if (tasks[i].end > firstDate) {
          firstDate = tasks[i].end;
        }
      }
      return firstDate;
    } else {
      let secondDate = this.addDays(this.getStartDate(tasks), 30);
      return secondDate;
    }
  }

  getStartDate(task: Task[]): Date {
    let firstDate: Date;

    let subTasks: any[] = [];

    for (let j = 0; j < task.length; j++) {
      if (task[j].family == 'child') {
        subTasks.push(task[j]);
      }
    }

    if (subTasks.length != 0) {
      firstDate = new Date(subTasks[0].start);
      for (let i = 0; i < subTasks.length; i++) {
        subTasks[i].start = new Date(subTasks[i].start);
        if (subTasks[i].start < firstDate) {
          firstDate = subTasks[i].start;
        }
      }
      return firstDate;
    } else {
      firstDate = new Date();
      return firstDate;
    }
  }

  getEndDate(task: Task[]): Date {
    let firstDate: Date;

    let subTasks: any[] = [];

    for (let j = 0; j < task.length; j++) {
      if (task[j].family == 'child') {
        subTasks.push(task[j]);
      }
    }

    if (subTasks.length != 0) {
      firstDate = new Date(subTasks[0].end);
      for (let i = 0; i < subTasks.length; i++) {
        if (subTasks[i].family == 'child') {
          subTasks[i].end = new Date(subTasks[i].end);
          if (subTasks[i].end > firstDate) {
            firstDate = subTasks[i].end;
          }
        }
      }
      return firstDate;
    } else {
      let secondDate = this.addDays(this.getStartDate(task), 30);
      return secondDate;
    }
  }

  private calculateBarLeft(start: Date, scale: any[], zoomIn: boolean): number {
    let left: number = 0;

    for (let i = 0; i < scale.length; i++) {
      if (start.getDate() === scale[i].getDate() && start.getMonth() === scale[i].getMonth() && start.getFullYear() === scale[i].getFullYear()) {

        if (zoomIn) {
          left = i * this.cellWidthIn + 4;
        } else {
          left = i * this.cellWidth + 4;
          //break;
        }
      }
    }
    return left;
  }

  public calculateGraphContainerDimensions(): any {
    let scrollWidth: number = 18;
    /* šírka skrolovníka */
    this.windowInnerWidth = window.innerWidth;
    let width = this.windowInnerWidth - this.gridWidth - scrollWidth;
    /* započítaná magická konštanta ScrollWidth */
    return {height: this.activityHeight, width: width};
  }

  public getBarProgressStyle(taskStatus: string = "", taskRealStatus: string = ""): any {
    var style = {};

    try {
      taskStatus = taskStatus.toLowerCase();
    } catch (err) {
      taskStatus = "";
    }

    try {
      taskRealStatus = taskRealStatus.toLowerCase();
    } catch (err) {
      taskRealStatus = "";
    }

    switch (taskStatus) {
      case "cyan":
        if (taskRealStatus == 'completed') {
          style["background-color"] = this.barStyles[0].completedColor;
        } else {
          style["background-color"] = this.barStyles[0].progressBackgroundColor;
        }
        break;
      case "teal":
        if (taskRealStatus == 'completed') {
          style["background-color"] = this.barStyles[1].completedColor;
        } else {
          style["background-color"] = this.barStyles[1].progressBackgroundColor;
        }
        break;
      case "brown":
        if (taskRealStatus == 'completed') {
          style["background-color"] = this.barStyles[2].completedColor;
        } else {
          style["background-color"] = this.barStyles[2].progressBackgroundColor;
        }
        break;
      case "bluegray":
        if (taskRealStatus == 'completed') {
          style["background-color"] = this.barStyles[3].completedColor;
        } else {
          style["background-color"] = this.barStyles[3].progressBackgroundColor;
        }
        break;
      case "lightblue":
        if (taskRealStatus == 'completed') {
          style["background-color"] = this.barStyles[4].completedColor;
        } else {
          style["background-color"] = this.barStyles[4].progressBackgroundColor;
        }
        break;
      default:
        style["background-color"] = this.barStyles[0].progressBackgroundColor;
        break;
    }

    return style;
  }

  private getBarStyle(taskStatus: string = ""): any {
    var style = {};

    try {
      taskStatus = taskStatus.toLowerCase();
    } catch (err) {
      taskStatus = "";
    }

    switch (taskStatus) {
      case "cyan":
        style["background-color"] = this.barStyles[0].backgroundColor;
        style["border"] = this.barStyles[0].border;
        break;
      case "teal":
        style["background-color"] = this.barStyles[1].backgroundColor;
        style["border"] = this.barStyles[1].border;
        break;
      case "brown":
        style["background-color"] = this.barStyles[2].backgroundColor;
        style["border"] = this.barStyles[2].border;
        break;
      case "bluegray":
        style["background-color"] = this.barStyles[3].backgroundColor;
        style["border"] = this.barStyles[3].border;
        break;
      case "lightblue":
        style["background-color"] = this.barStyles[4].backgroundColor;
        style["border"] = this.barStyles[4].border;
        break;
      default:
        style["background-color"] = "rgb(18,195, 244)";
        style["border"] = "1px solid #2196F3";
        break;
    }

    return style;
  }

  public calculateBar(task: any, index: number, scale: any, parent: any[], zoomIn?: boolean) {
    var barStyle = this.getBarStyle(task.colorPack);

    if (task.family == 'parent') {
      return {
        'top': this.barTop * this.setIndex(parent, task.id) + 2 + 'px',
        'left': this.calculateBarLeft(task.startOfTasks, scale, zoomIn) + 'px',
        'height': this.barHeight + 'px',
        'line-height': this.barLineHeight + 'px',
        'width': this.calculateBarWidth(task.startOfTasks, task.endOfTasks, zoomIn) + 'px',
        'background-color': barStyle["background-color"],
        'border': barStyle["border"]
      }
    } else if (task.family == 'child') {

      return {
        'top': this.barTop * this.setIndex(parent, task.id) + 2 + 'px',
        'left': this.calculateBarLeft(task.start, scale, zoomIn) + 'px',
        'height': this.barHeight + 'px',
        'line-height': this.barLineHeight + 'px',
        'width': this.calculateBarWidth(task.start, task.end, zoomIn) + 'px',
        'background-color': barStyle["background-color"],
        'border': barStyle["border"]
      }
    }
  }

  public getComputedStyle(element: any, attribute: any) {
    return parseInt(document.defaultView.getComputedStyle(element)[attribute], 10);
  }

  public calculateBarProgress(width: number, percent: number): string {
    if (typeof percent === "number") {
      if (percent > 100) {
        percent = 100;
      }
      let progress: number = (width / 100) * percent - 2;

      return `${progress}px`;
    }
    return `${0}px`;
  }

  private setScrollTop(scrollTop: number, element: any): void {
    if (element !== null && element !== undefined) {
      element.scrollTop = scrollTop;
    }
  }

  setPercentCompleted(task: Task) {
    let date: Date = new Date();
    let startTask: Date = new Date(task.start);
    let endTask: Date = new Date(task.end);
    let hours: number;
    let percent: number;
    let hoursToComplete: number;
    let percentToComplete: number;

    if (date.getTime() >= startTask.getTime() && task.status !== 'completed') {
      hours = this.calculateDifferenceOfDays(startTask, endTask) * 24;

      if (hours === 0 && startTask.getDate() === endTask.getDate()) {
        hours = 24;
      }

      percent = 100 / hours;

      hoursToComplete = Math.round(this.calculateDifferenceOfDays(date, endTask) * 24);

      percentToComplete = Math.round(hoursToComplete * percent);

      if (task.percentCompleted < 100 - percentToComplete) {
        this.updatePercentTask(null, 100 - percentToComplete, task);
      } else {
        if (date.getTime() >= endTask.getTime()) {
          this.updatePercentTask('completed', 100, task);
        }

        if (task.percentCompleted > 100 - percentToComplete && date.getTime <= endTask.getTime) {
          this.updatePercentTask(null, 100 - percentToComplete, task);
        }
      }

    }
  }

  controlPercentShift(task: Task) {
    let date: Date = new Date();
    let startTask: Date = new Date(task.start);
    let endTask: Date = new Date(task.end);

    if (date.getTime() <= startTask.getTime() && task.percentCompleted > 0) {
      this.updatePercentTask(null, 0, task);
    }

  }

  updatePercentTask(completed: string, percent: number, task: Task) {
    let priorModel = new Task(task.id, task.parentId, task.name, task.start, task.end, task.description, percent, completed, task.family, task.colorPack, task.position);
    this.httpService.updateTask(priorModel).subscribe();
  }

  public scrollTops(verticalScroll: any, ganttGridData: any, ganttGraphArea: any) {
    let verticalScrollTop = verticalScroll.scrollTop;
    let scroll = this.setScrollTop;

    // debounce
    if (verticalScrollTop !== null && verticalScrollTop !== undefined) {
      setTimeout(() => {
        scroll(verticalScrollTop, ganttGridData);
        scroll(verticalScrollTop, ganttGraphArea);
      }, 50);
    }
  }

  createUUID(): string {
    return uuid().toString();
  }

  setPosition(parentTasks: any[], tasks: any[]) {
    let taskModel: Task = null;


    if (parentTasks.length > 0 && tasks.length > 0) {

      for (let i = 0; i < parentTasks.length; i++) {
        for (let j = 0; j < tasks.length; j++) {

          if (tasks[j].id === parentTasks[i].id) {

            taskModel = new Task(tasks[j].id, tasks[j].parentId, tasks[j].name, tasks[j].start, tasks[j].end, tasks[j].description, tasks[j].percentCompleted, tasks[j].status, tasks[j].family, tasks[j].colorPack, i);

            this.httpService.updateTask(taskModel).subscribe();
          }

        }
      }
    }

  }

}
