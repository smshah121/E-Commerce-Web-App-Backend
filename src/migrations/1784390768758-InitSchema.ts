import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1784390768758 implements MigrationInterface {
    name = 'InitSchema1784390768758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_paymentmethod_enum" AS ENUM('COD', 'ONLINE')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "paymentMethod" "public"."order_paymentmethod_enum" NOT NULL DEFAULT 'COD'`);
        await queryRunner.query(`CREATE TYPE "public"."order_paymentstatus_enum" AS ENUM('PENDING', 'PAID', 'FAILED')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "paymentStatus" "public"."order_paymentstatus_enum" NOT NULL DEFAULT 'PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "paymentMethod"`);
        await queryRunner.query(`DROP TYPE "public"."order_paymentmethod_enum"`);
    }

}
