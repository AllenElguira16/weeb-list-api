import { PrismaClient } from '@prisma/client';
import type { Anime as MALAnime, CharacterOnAnime } from 'mal-web-scraper';
import MalWebScraper from 'mal-web-scraper';
import getUuidByString from 'uuid-by-string';
import { main } from '..';
import { resolveImage } from './resolveImage';

const prisma = new PrismaClient();

const saveVoiceActors = async (
  characterID: string,
  animeID: string,
  malVoiceActors: CharacterOnAnime['voice_actors'],
) => {
  try {
    for (const malVoiceActor of malVoiceActors) {
      const personID = getUuidByString(malVoiceActor.person_id.toString());
      const personDB = await prisma.person.findFirst({
        where: { id: personID },
      });

      if (!personDB) {
        console.log(
          `(${new Date().toLocaleTimeString()}) Fetching Voice Actor: ${
            malVoiceActor.person_id
          }`,
        );
        const { data: person } = await MalWebScraper.person(
          malVoiceActor.person_id,
        );

        if (person.english_name === null) throw new Error('Empty Name');

        await prisma.person.create({
          data: {
            id: personID,
            englishName: person.english_name,
            kanjiName: person.kanji_name,
            picture: await resolveImage(person.picture),
            about: person.about,
          },
        });
      }

      const voiceActorsOnCharactersCount = await prisma.voiceActor.count({
        where: {
          language: malVoiceActor.language,
          animeId: animeID,
          characterId: characterID,
          personId: personID,
        },
      });

      if (voiceActorsOnCharactersCount === 0)
        await prisma.voiceActor.create({
          data: {
            language: malVoiceActor.language,
            animeId: animeID,
            characterId: characterID,
            personId: personID,
          },
        });
    }
  } catch (error) {
    console.error(error);
    console.log(`an error occured, restarting...`);
    await main();
  }
};

export const saveCharacters = async (
  animeID: string,
  characters: MALAnime['characters'],
) => {
  try {
    for (const malCharacter of characters) {
      const characterID = getUuidByString(malCharacter.character_id.toString());
      const characterDB = await prisma.character.findFirst({
        where: { id: characterID },
      });

      if (!characterDB) {
        console.log(
          `(${new Date().toLocaleTimeString()}) Fetching Character: ${
            malCharacter.character_id
          }`,
        );
        const { data: character } = await MalWebScraper.character(
          malCharacter.character_id,
        );

        if (character.english_name === null) throw new Error('Empty Name');

        await prisma.character.create({
          data: {
            id: characterID,
            picture: await resolveImage(character.picture),
            about: character.about,
            englishName: character.english_name,
            kanjiName: character.kanji_name,
            nicknames: character.nicknames,
          },
        });
      }

      const charactersOnAnimeCount = await prisma.characterRole.count({
        where: {
          role: malCharacter.role,
          characterId: characterID,
          animeId: animeID,
        },
      });

      if (charactersOnAnimeCount === 0)
        await prisma.characterRole.create({
          data: {
            role: malCharacter.role,
            characterId: characterID,
            animeId: animeID,
          },
        });

      await saveVoiceActors(characterID, animeID, malCharacter.voice_actors);
    }
  } catch (error) {
    console.error(error);
    console.log(`an error occured, restarting...`);
    await main();
  }
};
