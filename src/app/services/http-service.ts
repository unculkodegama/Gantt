import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

import { Task } from '../model/task';
import {HttpClient} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HttpService {

  private taskUrl: string = "http://localhost:3000/tasks";
 //private sortTaskUrl: string = "http://localhost:3000/tasks?_sort=parentId,dateOfCreation&_order=asc";

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskUrl);
  }

  getTask(id:string): Observable<Task> {
    return this.http.get<Task>(this.taskUrl+ '/'+ id);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.taskUrl, task, httpOptions);
  }

  updateTask(task: Task): Observable<any> {
    const updateURL = `${this.taskUrl}/${task.id}`;
    return this.http.put<Task>(updateURL, task, httpOptions);

  }

  deleteTask(id: number): Observable<{}> {
    const deleteURL = `${this.taskUrl}/${id}`;
    return this.http.delete(deleteURL, httpOptions);
  }

}
