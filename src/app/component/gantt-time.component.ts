import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {GanttComponentService} from "../services/gantt-component.service";
import {Zooming} from "../model/interfaces";

@Component({
  selector: 'time-range',
  templateUrl: '../html/gantt-time.component.html',
  styleUrls: ['../css/gantt-time.component.css'],
  providers: [
    GanttComponentService
  ]
})
export class GanttTimeComponent implements OnInit, OnChanges {
  @Input() timeRange: any;
  @Input() dimensions: any;
  @Input() zoom: any;
  @Input() zoomLevel: any;

  constructor(private ganttComponentService: GanttComponentService) {
  }

  ngOnInit() {
    this.zoom.subscribe((zoomLevel: string) => {
      this.zoomLevel = zoomLevel;
    });;
  }

  ngOnChanges() {
    this.setTimeRangeStyle();
  }

  private setTimeRangeStyle() {
    return {
      'width': this.dimensions.width + 'px'
    };
  }

  private setTimeRangeLineStyle() {
    return {
      'height': this.ganttComponentService.rowHeight + 'px',
      'line-height': this.ganttComponentService.rowHeight + 'px',
      'position': 'relative',
      'border-top': 'none,'
    };
  }

  private setTimeRangeCellStyle() {
    var width = this.ganttComponentService.cellWidth;

    if(this.zoomLevel ===  Zooming[Zooming.In]) {
      width = this.ganttComponentService.cellWidthIn;
    }

    return {
      'width': width + 'px'
    };
  }

  private isDayWeekend(date: Date): string {
    return this.ganttComponentService.isDayWeekend(date);
  }

  setDateLengthPipe(): string {

    if(this.zoomLevel ===  Zooming[Zooming.In]) {
     return 'dd.MM';
    } else {
      return 'dd.MM.yyyy';
    }
  }

}
