import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddWordDto } from './dto/add-word.dto';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) { }

  @UseGuards(AuthGuard)
  @Post('add-word')
  async addWord(
    @Body() addWordData: AddWordDto,
    @Req() request
  ) {
    return this.dictionaryService.addWord(request, addWordData);
  }
}
