import { Controller } from '@tsed/di';
import { PathParams } from '@tsed/platform-params';
import { ContentType, Get, Status } from '@tsed/schema';
import { CharacterService } from 'src/services/CharacterService';

@Controller('/character')
export class CharacterController {
  constructor(private characterService: CharacterService) {}

  @Get('/:id')
  @ContentType('application/json')
  @Status(200)
  async getAnime(@PathParams('id') id: string) {
    return {
      status: 200,
      data: {
        character: await this.characterService.getCharacterByID(id),
      },
    };
  }
}
