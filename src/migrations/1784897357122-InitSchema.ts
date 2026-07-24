import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1784897357122 implements MigrationInterface {
    name = 'InitSchema1784897357122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
  ALTER TABLE "product"
  ALTER COLUMN "price" TYPE numeric(10,2)
  USING "price"::numeric
`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "price" integer NOT NULL`);
    }

}
