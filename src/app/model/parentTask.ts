import {Task} from "./task";

export class ParentTask {

  id: string;
  parentId: string;
  name: string;
  percentCompleted?: number;
  status?: string;
  created: Date;
  startOfTasks?: Date;
  endOfTasks?: Date;
  description?:string;
  family: string;
  tasks: Task[];
  show: boolean;
  colorPack: string;
  position: number;

  constructor(id:string, parId:string, name:string, start:Date, end:Date, description:string, percentCompleted:number, status:string, colorPack: string, pos: number) {
    this.id = id;
    this.parentId = parId;
    this.name = name;
    this.startOfTasks = new Date(start);
    this.endOfTasks = new Date(end);
    this.created = new Date();

    this.position = pos;

    this.show = false;

    this.colorPack = colorPack;

    this.tasks = [];

    if(description != null) {
      this.description = description;
    } else {
      this.description = '';
    }

    if(percentCompleted != null) {
      this.percentCompleted = percentCompleted;
    } else {
      this.percentCompleted = 0;
    }

    if(status != null) {
      this.status = status;
    } else {
      this.status = '';
    }

    this.family = 'parent';
  }

  pushTaskToParent(task:Task) {
    this.tasks.push(task);
  }

  setStart(start: Date) {
    this.startOfTasks = new Date(start);
  }

  setEnd(end : Date) {
    this.endOfTasks = new Date(end);
  }

  setPercent(percent: number) {
    this.percentCompleted = percent;
  }

  setShow(show: boolean) {
    this.show = show;
  }

}
