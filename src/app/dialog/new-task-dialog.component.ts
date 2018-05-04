import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {FormControl, Validators} from "@angular/forms";


@Component({
  selector: 'new-task-dialog',
  templateUrl: 'new-task-dialog.component.html',
  styleUrls: ['new-task-dialog.component.css'],
  providers: [],
})

export class NewTaskDialog {

  today = new Date();

  colorControl = new FormControl('', [Validators.required]);

  colors = [
    {name: 'Cyan', nameSk: 'Tyrkysová'},
    {name: 'Teal', nameSk: 'Modrozelená'},
    {name: 'Brown', nameSk: 'Hnedá'},
    {name: 'BlueGray', nameSk: 'Modrošedá'},
    {name: 'LightBlue', nameSk: 'Modrá'},
  ];

  constructor(public dialogRef: MatDialogRef<NewTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  dateCheck(begin: any,end: any): boolean {
    if(begin != null && end != null) {
      return begin.getTime() > end.getTime();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
