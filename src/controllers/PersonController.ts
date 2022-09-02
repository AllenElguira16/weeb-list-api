import { Controller } from '@tsed/di';
import { PathParams } from '@tsed/platform-params';
import { ContentType, Get, Status } from '@tsed/schema';
import { PersonService } from 'src/services/PersonService';

@Controller('/person')
export class PersonController {
  constructor(private personService: PersonService) {}

  @Get('/:id')
  @ContentType('application/json')
  @Status(200)
  async getPersonByID(@PathParams('id') id: string) {
    return {
      status: 200,
      data: {
        person: await this.personService.getPersonByID(id),
      },
    };
  }
}
