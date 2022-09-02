import { PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

const prisma = new PrismaClient();

@Injectable()
export class CharacterService {
  async getCharacterByID(id: string) {
    return prisma.character.findFirstOrThrow({
      include: {
        anime: {
          include: {
            anime: true,
          },
        },
        voiceActors: {
          include: {
            person: true,
          },
        },
      },
      where: {
        id,
      },
    });
  }
}
