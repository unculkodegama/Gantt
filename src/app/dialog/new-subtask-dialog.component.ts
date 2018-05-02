import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";


@Component({
  selector: 'new-subtask-dialog',
  templateUrl: 'new-subtask-dialog.component.html',
  styleUrls: ['new-subtask-dialog.component.css'],
  providers: [],
})

export class NewSubTaskDialog {

  constructor(public dialogRef: MatDialogRef<NewSubTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  today = new Date();
  parentName = this.data.task.name;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
