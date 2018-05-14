import {Component, Inject, Injectable} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from "@angular/material";
import {HttpService} from "../services/http-service";
import {FormControl, Validators} from "@angular/forms";

@Injectable()
@Component({
  selector: 'update-task-dialog',
  templateUrl: 'update-task-dialog.component.html',
  styleUrls: ['update-task-dialog.component.css'],
  providers: [],
})

export class UpdateTaskDialog {

  constructor(private snackBar: MatSnackBar, private httpService: HttpService, public dialogRef: MatDialogRef<UpdateTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  today = new Date();
  name: string = this.data.name;

  task = this.data.task;

  colorControl = new FormControl('', [Validators.required]);

  colors = [
    {name: 'Cyan', nameSk: 'Tyrkysová', hex:'#00BCD4'},
    {name: 'Teal', nameSk: 'Modrozelená', hex:'#009688'},
    {name: 'Brown', nameSk: 'Hnedá', hex:'#A1887F'},
    {name: 'BlueGray', nameSk: 'Modrošedá', hex:'#78909C'},
    {name: 'LightBlue', nameSk: 'Modrá', hex:'#03A9F4'},
  ];

  onNoClick(): void {
    this.dialogRef.close();
  }

  returnName(): string {

    if (this.data.parentName.length == 0) {
      return null;
    } else {
      return this.data.parentName[0].name;
    }
  }

  dateCheck(begin: any,end: any): boolean {
    if(begin != null && end != null) {
      return begin.getTime() > end.getTime();
    }
  }

  deleteTask(id: number) {

    if (this.data.task.family == 'parent') {
      if (id == this.data.task.id && this.data.task.tasks.length > 0) {
        for (let i = 0; i < this.data.task.tasks.length; i++) {
          this.httpService.deleteTask(this.data.task.tasks[i].id).subscribe();
        }

        this.httpService.deleteTask(id).subscribe();
        this.dialogRef.close();
        this.snackBar.open('Úloha bola úspešne zmazaná.', null, {duration: 2000});
      } else {

        this.httpService.deleteTask(id).subscribe();
        this.dialogRef.close();
        this.snackBar.open('Úloha bola úspešne zmazaná.', null, {duration: 2000});
      }
    } else {

      this.httpService.deleteTask(id).subscribe();
      this.dialogRef.close();
      this.snackBar.open('Úloha bola úspešne zmazaná.', null, {duration: 2000});
    }
  }
}
