import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor() { }

}
