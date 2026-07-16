import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1784216074374 implements MigrationInterface {
    name = 'InitSchema1784216074374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."seller_application_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "seller_application" ("id" SERIAL NOT NULL, "storeName" character varying(100) NOT NULL, "storeDescription" text NOT NULL, "phone" character varying(20) NOT NULL, "address" text NOT NULL, "status" "public"."seller_application_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_2b147d05a2ffe6c478dd5c7a26" UNIQUE ("userId"), CONSTRAINT "PK_8d689b9539fa71271d9bf31881f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "seller_application" ADD CONSTRAINT "FK_2b147d05a2ffe6c478dd5c7a269" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "seller_application" DROP CONSTRAINT "FK_2b147d05a2ffe6c478dd5c7a269"`);
        await queryRunner.query(`DROP TABLE "seller_application"`);
        await queryRunner.query(`DROP TYPE "public"."seller_application_status_enum"`);
    }

}
