import { AppPage } from './app.po';

import { GanttComponentService } from '../src/app/services/gantt-component.service';
import {Task} from "../src/app/model/task";
import {HttpService} from "../src/app/services/http-service";
import {HttpClient} from "@angular/common/http";
import {browser} from "protractor";

describe('gantt-component App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should test add task and delete task', () => {
    page.navigateTo();
    page.getNewTaskClicked();
  });

  it('should test zoom in/out', () => {
    page.navigateTo();
    page.zoom();
  });

  it('should create task and test its atributes', () => {
    const date: Date = new Date();
    const task: Task = new Task(1,1,'uloha 1',date, date, 'desc', 5, '', 'parent', 'cyan');

    const id = task.id;
    const parentId = task.parentId;
    const name = task.name;
    const start = task.start;
    const end = task.end;
    const desc = task.description;
    const percent = task.percentCompleted;
    const status = task.status;
    const family = task.family;
    const color = task.colorPack;


    expect(id).toEqual(1);
    expect(parentId).toEqual(1);
    expect(name).toEqual('uloha 1');
    expect(start).toEqual(date);
    expect(end).toEqual(date);
    expect(desc).toEqual('desc');
    expect(percent).toEqual(5);
    expect(status).toEqual('');
    expect(family).toEqual('parent');
    expect(color).toEqual('cyan');
  });

  it('should return the style from getBarProgressStyle()', () => {
    let ganttComp = new GanttComponentService();
    let style = ganttComp.getBarProgressStyle('cyan', 'completed');

    expect(style).toEqual({ 'background-color': '#0097A7' });
  });

  it('should test is the given day is weekend', () => {
    let ganttComp = new GanttComponentService();

    let day:string = ganttComp.isDayWeekend(new Date(2018, 4, 13));
    let expectedResult = 'weekend';

    expect(day).toBe(expectedResult);
  });

  it('should test the length of TimeRange', () => {
    let ganttComp = new GanttComponentService();

    let days: any[] = ganttComp.calculateRange(new Date(2018, 4, 1), new Date(2018, 4, 10));

    expect(days.length).toEqual(37);
  });



});


