import {Component, Inject, Injectable} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'new-subtask-dialog',
  templateUrl: 'new-subtask-dialog.component.html',
  styleUrls: ['new-subtask-dialog.component.css'],
  providers: [],
})

@Injectable()
export class NewSubTaskDialog {

  constructor(public dialogRef: MatDialogRef<NewSubTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  today = new Date();
  parentName = this.data.task.name;

  onNoClick(): void {
    this.dialogRef.close();
  }

  dateCheck(begin: any,end: any): boolean {
    if(begin != null && end != null) {
      return begin.getTime() > end.getTime();
    }
  }
}
