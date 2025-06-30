import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumn1751270112211 implements MigrationInterface {
    name = 'AddNewColumn1751270112211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`role\` \`role\` varchar(255) NOT NULL`);
    }

}
