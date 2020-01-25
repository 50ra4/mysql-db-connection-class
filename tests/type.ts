export type TCommonProps = {
  createdAt: string;
  updatedAt: string;
};

export type TUser = {
  id: number;
  username: string;
  email: string;
} & TCommonProps;

export type TProject = {
  id: number;
  name: string;
  hasDeleted: boolean;
} & TCommonProps;

export type TIssue = {
  id: number;
  project: number;
  title?: string;
} & TCommonProps;
