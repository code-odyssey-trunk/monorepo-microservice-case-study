import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUser1751214043989 implements MigrationInterface {
    name = 'AddRoleToUser1751214043989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`role\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
    }

}
