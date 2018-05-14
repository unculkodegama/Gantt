import {Component, OnInit, Input, ViewChild, ElementRef, OnChanges} from '@angular/core';
import {GanttComponentService} from "../services/gantt-component.service";
import {Zooming} from "../model/interfaces";


@Component({
  selector: 'graph-cells',
  templateUrl: '../html/gantt-cells.component.html',
  styleUrls: ['../css/gantt-cells.component.css']
})
export class GanttCellsComponent implements OnInit, OnChanges {
  @Input() tasks: any;
  @Input() timeRange: any;
  @Input() zoom: any;
  @Input() zoomLevel: any;

  private iterable: any[] = [];
  
  private cells: any[] = [];

  constructor(private ganttComponentService: GanttComponentService) {
  }

  ngOnInit() {
    this.drawGrid();

    this.iterable = this.setIterable();

    this.zoom.subscribe((zoomLevel: string) => {
      this.zoomLevel = zoomLevel;
      this.drawGrid();
    });
  }

  ngOnChanges() {
    this.drawGrid();
  }

  isDayWeekend(date: Date): string {
    return this.ganttComponentService.isDayWeekend(date);
  }

  private setRowStyle() {
    return {
      'height': this.ganttComponentService.rowHeight + 'px'
    };
  }

  private setCellStyle() {
    var width = this.ganttComponentService.cellWidth;

    if (this.zoomLevel === Zooming[Zooming.In]) {
      width = this.ganttComponentService.cellWidthIn;
    }

    return {
      'width': width + 'px'
    };
  }

  setIterable(): any[] {
    let iterable: any[] = [];

    if (this.tasks.length < 11) {
      for (let i = 0; i < 11; i++) {
        iterable.push(i);
      }

      return iterable;
    } else {
      return this.tasks;
    }
  }

  private drawGrid(): void {
    this.cells = this.timeRange;
  }
}

