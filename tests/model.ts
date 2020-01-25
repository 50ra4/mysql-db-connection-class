import { SqlQueryFactory } from 'sql-query-builder-like-firestore';
//
import { toRowDataPacket, IMySqlPoolConnection, toInsertId } from '../src';
//
import { PROJECT_MAPPING_CONFIG, ISSUE_MAPPING_CONFIG } from './lookups';
import { TProject } from './type';

const toProjects = toRowDataPacket(PROJECT_MAPPING_CONFIG);
const toIssues = toRowDataPacket(ISSUE_MAPPING_CONFIG);

export class TestClass {
  private readonly connection: IMySqlPoolConnection;
  constructor(connection: IMySqlPoolConnection) {
    this.connection = connection;
  }

  async insert(projectName: string) {
    return await this.connection.executeWithTransaction<TProject>(async (connection) => {
      const insertId =
        (await this.connection
          .execute(
            connection,
            SqlQueryFactory.insert('projects').column({
              columnName: 'name',
              value: projectName,
            }).query,
          )
          .then(toInsertId)
          .catch((err) => {
            throw err;
          })) || 0;

      const projects = await this.connection
        .execute(connection, SqlQueryFactory.select('projects').where('id', '=', insertId).query)
        .then(toProjects);

      return projects[0];
    });
  }

  async select() {
    const issues = await this.connection.executeReadOnly(SqlQueryFactory.select('issues').query).then(toIssues);
    const projects = await this.connection
      .executeReadOnly(SqlQueryFactory.select('projects').where('id', '=', issues[0].project).query)
      .then(toProjects);
    return { projects, issues };
  }

  async update(projectId: number, projectName: string) {
    return await this.connection.executeWithTransaction(async (connection) => {
      await this.connection.execute(
        connection,
        SqlQueryFactory.update('projects')
          .column({ columnName: 'name', value: projectName })
          .where('id', '=', projectId).query,
      );
      const projects = await this.connection
        .execute(connection, SqlQueryFactory.select('projects').where('id', '=', projectId).query)
        .then(toProjects);
      return projects[0];
    });
  }

  async delete(projectId: number) {
    return await this.connection.executeWithTransaction(async (connection) => {
      await this.connection.execute(connection, SqlQueryFactory.delete('projects').where('id', '=', projectId).query);

      return await this.connection
        .execute(connection, SqlQueryFactory.select('projects').where('id', '=', projectId).query)
        .then(toProjects);
    });
  }
}
