import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1784743991179 implements MigrationInterface {
    name = 'InitSchema1784743991179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_2b26f37c948355fc254229ae4cf"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "adminId" TO "sellerId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_d5cac481d22dacaf4d53f900a3f" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_d5cac481d22dacaf4d53f900a3f"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME COLUMN "sellerId" TO "adminId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_2b26f37c948355fc254229ae4cf" FOREIGN KEY ("adminId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
