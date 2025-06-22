import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Render,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // lub ścieżka do Twojego guardu
import { CreateTaskDto } from './create-task.dto';
import { NotFoundExceptionFilter } from './not-found.filter';
import { TaskResponseDto } from './task-responce.dto';
import { TasksService } from './tasks.service';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {
    console.log('👉 TasksController initialized');
  }

  @Get()
  @Render('index')
  getIndex(@Request() req) {
    const userId = req.user.userId;
    return { tasks: this.tasksService.returnForUser(userId) };
  }

  @Post()
  // @Redirect('/tasks')
  create(@Body() body: CreateTaskDto, @Request() req) {
    const userId = req.user.userId;
    console.log('first');
    this.tasksService.addOne(body.title, userId);
  }

  @Get(':id')
  @UseFilters(new NotFoundExceptionFilter())
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): TaskResponseDto {
    const task = this.tasksService
      .returnForUser(req.user.userId)
      .find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }
}
