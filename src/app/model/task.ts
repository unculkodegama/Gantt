export class Task {

  id: string;
  parentId: string;
  name: string;
  percentCompleted?: number;
  status?: string;
  created: Date;
  start: Date;
  end: Date;
  description?: string;
  family: string;
  colorPack: string;
  position?: number;

  constructor(id: string, parId: string, name: string, start: Date, end: Date, description: string, percentCompleted: number, status: string, family: string, color: string, posit? :number) {
    this.id = id;
    this.parentId = parId;
    this.name = name;
    this.start = start;
    this.end = end;
    this.created = new Date();
    this.colorPack = color;
    this.position = posit;

    if (description != null) {
      this.description = description;
    } else {
      this.description = '';
    }

    if (percentCompleted != null) {
      this.percentCompleted = percentCompleted;
    } else {
      this.percentCompleted = 0;
    }

    if (status != null) {
      this.status = status;
    } else {
      this.status = '';
    }

    this.family = family;
  }

}
