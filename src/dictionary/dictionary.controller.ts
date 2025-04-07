import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddWordDto } from './dto/add-word.dto';
import { RemovesWordsDto } from './dto/remove-words.dto';
import { CaptureErrors } from 'src/decorators/catchErrors.decorator';

@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) { }

  @CaptureErrors()
  @UseGuards(AuthGuard)
  @Post('add-word')
  async addWord(
    @Body() addWordData: AddWordDto,
    @Req() request
  ) {
    return this.dictionaryService.addWord(request, addWordData);
  }

  @CaptureErrors()
  @UseGuards(AuthGuard)
  @Get('get-words')
  async getWords(@Req() request) {
    return this.dictionaryService.getWords(request);
  }

  @CaptureErrors()
  @UseGuards(AuthGuard)
  @Delete('delete-word')
  async deleteWord(
    @Req() request
  ) {
    return this.dictionaryService.deleteWord(request);
  }

  @CaptureErrors()
  @UseGuards(AuthGuard)
  @Delete('delete-words')
  async deleteAllWords(
    @Req() request,
    @Body() removeWordsData: RemovesWordsDto
  ) {
    return this.dictionaryService.deleteAllWords(request, removeWordsData.wordsIds);
  }
}
