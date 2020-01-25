import { format } from 'date-fns';
import * as R from 'ramda';

import { TMapDBColumnToPropertyConfig } from '../src';
import { TUser, TCommonProps, TIssue, TProject } from './type';

const DATE_FORMAT = 'yyyy/MM/dd';
const toDateString = R.partialRight(format, [DATE_FORMAT, undefined]);
const COMMON_MAPPING_CONFIG: TMapDBColumnToPropertyConfig<TCommonProps> = [
  {
    dbColumnName: 'created_at',
    propertyName: 'createdAt',
    to: toDateString,
  },
  {
    dbColumnName: 'updated_at',
    propertyName: 'updatedAt',
    to: toDateString,
  },
];

export const USER_MAPPING_CONFIG: TMapDBColumnToPropertyConfig<TUser> = [
  ...COMMON_MAPPING_CONFIG,
  {
    dbColumnName: 'id',
    propertyName: 'id',
  },
  {
    dbColumnName: 'username',
    propertyName: 'username',
  },
  {
    dbColumnName: 'email',
    propertyName: 'email',
  },
];

export const ISSUE_MAPPING_CONFIG: TMapDBColumnToPropertyConfig<TIssue> = [
  ...COMMON_MAPPING_CONFIG,
  {
    dbColumnName: 'id',
    propertyName: 'id',
  },
  {
    dbColumnName: 'title',
    propertyName: 'title',
  },
  {
    dbColumnName: 'project_id',
    propertyName: 'project',
  },
];

export const PROJECT_MAPPING_CONFIG: TMapDBColumnToPropertyConfig<TProject> = [
  ...COMMON_MAPPING_CONFIG,
  {
    dbColumnName: 'id',
    propertyName: 'id',
  },
  {
    dbColumnName: 'name',
    propertyName: 'name',
  },
  {
    dbColumnName: 'deleted',
    propertyName: 'hasDeleted',
    to: (v: any) => v === 1,
  },
];
