import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {GanttComponentService} from "../services/gantt-component.service";
import {Zooming} from "../model/interfaces";


@Component({
  selector: 'graph-bars',
  templateUrl: '../html/gantt-bars.component.html',
  styleUrls: ['../css/gantt-bars.component.css'],
  providers: [
    GanttComponentService
  ]
})
export class GanttBarsComponent implements OnInit, OnChanges {
  @Input() timeRange: any;
  @Input() dimensions: any;
  @Input() parentTasks: any;
  @Input() zoom: any;
  @Input() zoomLevel: any;

  private containerHeight: number = 0;
  private containerWidth: number = 0;

  constructor(private ganttComponentService: GanttComponentService) {
  }

  ngOnInit() {
    this.containerHeight = this.dimensions.height;
    this.containerWidth = this.dimensions.width;

    this.zoom.subscribe((zoomLevel: string) => {
      this.zoomLevel = zoomLevel;
    });;
  }

  ngOnChanges() {
    this.containerHeight = this.dimensions.height;
    this.containerWidth = this.dimensions.width;
  }

  private drawBar(task: any, index: number) {
    let style = {};

    if (this.zoomLevel === Zooming[Zooming.In]) {
      style = this.ganttComponentService.calculateBar(task, index, this.timeRange, this.parentTasks, true);
    } else {
      style = this.ganttComponentService.calculateBar(task, index, this.timeRange, this.parentTasks, false);
    }

    return style;
  }

  private drawProgress(task: any, bar: any): any {
    var barStyle = this.ganttComponentService.getBarProgressStyle(task.colorPack, task.status);
    var width = this.ganttComponentService.calculateBarProgress(this.ganttComponentService.getComputedStyle(bar, 'width'), task.percentCompleted);

    return {
      'height': this.ganttComponentService.barHeight - 1 + 'px',
      'width': width,
      'background-color': barStyle["background-color"],
    };
  }
}
