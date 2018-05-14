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
    {name: 'Cyan', nameSk: 'Tyrkysová', hex:'#00BCD4'},
    {name: 'Teal', nameSk: 'Modrozelená', hex:'#009688'},
    {name: 'Brown', nameSk: 'Hnedá', hex:'#A1887F'},
    {name: 'BlueGray', nameSk: 'Modrošedá', hex:'#78909C'},
    {name: 'LightBlue', nameSk: 'Modrá', hex:'#03A9F4'},
  ];

  constructor(public dialogRef: MatDialogRef<NewTaskDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  dateCheck(begin: Date,end: Date): boolean {
    if(begin != null && end != null) {
      return begin.getTime() > end.getTime();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
