import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddWordDto } from './dto/add-word.dto';
import { RemovesWordsDto } from './dto/remove-words.dto';
import { CaptureErrors } from 'src/decorators/catchErrors.decorator';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) { }

  @UseGuards(AuthGuard)
  @Post('add-word')
  @CaptureErrors()
  async addWord(
    @Body() addWordData: AddWordDto,
    @Req() request
  ) {
    return this.dictionaryService.addWord(request, addWordData);
  }

  @UseGuards(AuthGuard)
  @Get('get-words')
  @CaptureErrors()
  async getWords(@Req() request) {
    return this.dictionaryService.getWords(request);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-word')
  @CaptureErrors()
  async deleteWord(
    @Req() request
  ) {
    return this.dictionaryService.deleteWord(request);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-words')
  @CaptureErrors()
  async deleteAllWords(
    @Req() request,
    @Body() removeWordsData: RemovesWordsDto
  ) {
    return this.dictionaryService.deleteAllWords(request, removeWordsData.wordsIds);
  }
}
