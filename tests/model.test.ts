import { format } from 'date-fns';

import { MySqlPoolConnection } from '../src';
import { mysqlPoolConfig } from './private/config';
import { TestClass } from './model';

let testInstance: TestClass;
beforeAll(() => {
  testInstance = new TestClass(new MySqlPoolConnection(mysqlPoolConfig, true));
});

describe('executeWithTransaction', () => {
  it('insert => update => delete', async (done) => {
    const name = `${format(new Date(), 'yyyy-MM-dd HHmmss')}テスト`;
    const insertedName = `insert ${name}`;
    const updatedName = `update ${name}`;

    const project = await testInstance.insert(insertedName);
    expect(project.name).toBe(insertedName);

    const updatedProject = await testInstance.update(project.id, updatedName);
    expect(updatedProject.name).toBe(updatedName);

    const res = await testInstance.delete(project.id);
    expect(res.length).toBe(0);
    done();
  });
});

describe('executeReadOnly', () => {
  it('select all', async (done) => {
    const { projects, issues } = await testInstance.select();
    expect(issues.length !== 0).toBeTruthy();
    expect(projects.length).toBe(1);
    done();
  });
});
