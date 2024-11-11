import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddWordDto } from './dto/add-word.dto';
import { DeleteWordDto } from './dto/delete-word.dto';

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

  @UseGuards(AuthGuard)
  @Get('get-words')
  async getWords(@Req() request) {
    return this.dictionaryService.getWords(request);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-word')
  async deleteWord(
    @Body() deleteWordData: DeleteWordDto,
    @Req() request
  ) {
    return this.dictionaryService.deleteWord(request, deleteWordData);
  }
}
