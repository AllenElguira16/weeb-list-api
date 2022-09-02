-- CreateEnum
CREATE TYPE "AnimeType" AS ENUM ('TV', 'MOVIE', 'OVA', 'SPECIAL', 'ONA');

-- CreateEnum
CREATE TYPE "AnimeRelationType" AS ENUM ('PREQUEL', 'SEQUEL', 'ALTERNATE_SETTING', 'ALTERNATE_VERSION', 'SIDE_STORY', 'SUMMARY', 'FULL_STORY', 'PARENT_STORY', 'SPIN_OFF', 'CHARACTERS', 'OTHERS');

-- CreateEnum
CREATE TYPE "AnimeStatus" AS ENUM ('AIRING', 'COMPLETE', 'UPCOMING');

-- CreateEnum
CREATE TYPE "AnimeSeason" AS ENUM ('SPRING', 'SUMMER', 'FALL', 'WINTER');

-- CreateEnum
CREATE TYPE "AnimeRating" AS ENUM ('G', 'PG', 'PG13', 'R', 'R18');

-- CreateTable
CREATE TABLE "Anime" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AnimeType",
    "episodes" INTEGER,
    "duration" TEXT,
    "rating" "AnimeRating",
    "status" "AnimeStatus",
    "season" "AnimeSeason",
    "synopsis" TEXT,
    "airtimeFrom" TIMESTAMP(3),
    "airtimeTo" TIMESTAMP(3),
    "picture" TEXT NOT NULL,
    "genres" TEXT[],
    "themes" TEXT[],
    "demographics" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "kanjiName" TEXT,
    "nicknames" TEXT[],
    "about" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "kanjiName" TEXT,
    "about" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterRole" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,

    CONSTRAINT "CharacterRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceActor" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,

    CONSTRAINT "VoiceActor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "positions" TEXT[],
    "personId" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Title" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "animeId" TEXT NOT NULL,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeRelations" (
    "id" TEXT NOT NULL,
    "type" "AnimeRelationType" NOT NULL,
    "animeId" TEXT NOT NULL,
    "relatedAnimeId" TEXT NOT NULL,

    CONSTRAINT "AnimeRelations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Anime_id_key" ON "Anime"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Character_id_key" ON "Character"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Person_id_key" ON "Person"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterRole_id_key" ON "CharacterRole"("id");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceActor_id_key" ON "VoiceActor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_id_key" ON "Staff"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Title_id_key" ON "Title"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeRelations_id_key" ON "AnimeRelations"("id");

-- AddForeignKey
ALTER TABLE "CharacterRole" ADD CONSTRAINT "CharacterRole_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterRole" ADD CONSTRAINT "CharacterRole_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceActor" ADD CONSTRAINT "VoiceActor_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceActor" ADD CONSTRAINT "VoiceActor_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceActor" ADD CONSTRAINT "VoiceActor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Title" ADD CONSTRAINT "Title_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRelations" ADD CONSTRAINT "AnimeRelations_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRelations" ADD CONSTRAINT "AnimeRelations_relatedAnimeId_fkey" FOREIGN KEY ("relatedAnimeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
