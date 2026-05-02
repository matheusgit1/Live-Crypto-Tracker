import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialEntities1777726579017 implements MigrationInterface {
    name = 'InitialEntities1777726579017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "candles" ("id" uuid NOT NULL, "symbol" character varying NOT NULL, "interval" character varying NOT NULL, "open" numeric(20,8) NOT NULL, "high" numeric(20,8) NOT NULL, "low" numeric(20,8) NOT NULL, "close" numeric(20,8) NOT NULL, "volume" numeric(20,8) NOT NULL, "timestamp" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_51487d0946f705bd3df19d2f04e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_257e116b194cd95e68452505eb" ON "candles" ("symbol", "interval", "timestamp") `);
        await queryRunner.query(`CREATE TABLE "prices" ("id" uuid NOT NULL, "symbol" character varying NOT NULL, "price" numeric(20,8) NOT NULL, "change24h" numeric(10,2) NOT NULL, "volume24h" numeric(20,2) NOT NULL, "high24h" numeric(20,8) NOT NULL, "low24h" numeric(20,8) NOT NULL, "open24h" numeric(20,8) NOT NULL, "timestamp" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2e40b9e4e631a53cd514d82ccd2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d07bbf006535aa39b467300ec7" ON "prices" ("symbol", "timestamp") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d07bbf006535aa39b467300ec7"`);
        await queryRunner.query(`DROP TABLE "prices"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_257e116b194cd95e68452505eb"`);
        await queryRunner.query(`DROP TABLE "candles"`);
    }

}
