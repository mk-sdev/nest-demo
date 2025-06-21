import { Injectable } from '@nestjs/common';
import { TaskResponseDto } from './task-responce.dto';

@Injectable()
export class TasksService {
  private tasks: Array<TaskResponseDto> = [
    new TaskResponseDto(1, 'Task 1', false, 1),
    new TaskResponseDto(2, 'Task 2', true, 2),
    new TaskResponseDto(3, 'Task 3', false, 1),
  ];

  returnAll(): Array<TaskResponseDto> {
    return this.tasks;
  }

  returnForUser(userId: number): Array<TaskResponseDto> {
    return this.tasks.filter((task) => task.userId === userId);
  }

  addOne(title: string, userId: number): void {
    const newTask = new TaskResponseDto(
      this.tasks.length + 1,
      title,
      false,
      userId,
    );
    console.log(`Dodano task: "${title}" przez userId ${userId}`);

    this.tasks.push(newTask);
  }
}
