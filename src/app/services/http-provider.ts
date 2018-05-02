import {Injectable} from "@angular/core";
import { Task } from '../model/task';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Http} from "@angular/http";
import {GanttComponentService} from "./gantt-component.service";

@Injectable()
export class HttpGetProvider {

  private tasks: Task[] = null;

  private taskUrl: string = "http://localhost:3000/tasks";

  constructor(private http: Http, private ganttComponentService: GanttComponentService){}

  load() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.taskUrl)
        .map(res => res.json())
        .subscribe(response => {
          this.tasks = response;
          resolve(true);
        })
    })
  }

  public httpGetTasks(): Task[] {

    for(let i = 0; i < this.tasks.length; i++) {
      this.ganttComponentService.setPercentCompleted(this.tasks[i]);
      this.ganttComponentService.controlPercentShift(this.tasks[i]);
    }

    return this.tasks;
  }

}
