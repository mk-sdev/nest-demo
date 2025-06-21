export class TaskResponseDto {
  id: number;
  title: string;
  done: boolean;
  userId: number; // 👈 dodane

  constructor(id: number, title: string, done: boolean, userId: number) {
    this.id = id;
    this.title = title;
    this.done = done;
    this.userId = userId;
  }
}
