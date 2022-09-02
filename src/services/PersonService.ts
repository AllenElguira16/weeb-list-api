import { PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

const prisma = new PrismaClient();

@Injectable()
export class PersonService {
  async getPersonByID(id: string) {
    return prisma.person.findFirstOrThrow({
      include: {
        staffPositions: {
          include: {
            anime: true,
          },
        },
        voiceActingRoles: {
          where: {
            personId: id,
          },
          include: {
            character: {
              include: {
                anime: {
                  include: {
                    anime: true,
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id,
      },
    });
  }
}
