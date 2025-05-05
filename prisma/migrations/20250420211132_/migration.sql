-- CreateTable
CREATE TABLE "Tournament" (
    "tournament_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "location" VARCHAR(100) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "tournament_type" VARCHAR(50) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("tournament_id")
);

-- CreateTable
CREATE TABLE "Team" (
    "team_id" SERIAL NOT NULL,
    "team_name" VARCHAR(100) NOT NULL,
    "coach_name" VARCHAR(100) NOT NULL,
    "region" VARCHAR(100) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("team_id")
);

-- CreateTable
CREATE TABLE "Player" (
    "player_id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("player_id")
);

-- CreateTable
CREATE TABLE "Match" (
    "match_id" SERIAL NOT NULL,
    "tournament_id" INTEGER NOT NULL,
    "round" VARCHAR(50) NOT NULL,
    "match_date" TIMESTAMP(3) NOT NULL,
    "team1_id" INTEGER NOT NULL,
    "team2_id" INTEGER NOT NULL,
    "score_team1" INTEGER NOT NULL,
    "score_team2" INTEGER NOT NULL,
    "winner_team_id" INTEGER NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "venue_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(150) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("venue_id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "schedule_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "Official" (
    "official_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,

    CONSTRAINT "Official_pkey" PRIMARY KEY ("official_id")
);

-- CreateTable
CREATE TABLE "Match_Official" (
    "match_id" INTEGER NOT NULL,
    "official_id" INTEGER NOT NULL,

    CONSTRAINT "Match_Official_pkey" PRIMARY KEY ("match_id","official_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_match_id_key" ON "Schedule"("match_id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "Tournament"("tournament_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team1_id_fkey" FOREIGN KEY ("team1_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team2_id_fkey" FOREIGN KEY ("team2_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "Team"("team_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "Venue"("venue_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_Official" ADD CONSTRAINT "Match_Official_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match"("match_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match_Official" ADD CONSTRAINT "Match_Official_official_id_fkey" FOREIGN KEY ("official_id") REFERENCES "Official"("official_id") ON DELETE RESTRICT ON UPDATE CASCADE;
