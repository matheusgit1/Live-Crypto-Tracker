import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateHypertable1777723691746 implements MigrationInterface {
  name = 'CreateHypertable1777723691746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Habilitar extensão TimescaleDB
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS timescaledb`);
  }
}
