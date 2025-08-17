// types/roleTypes.ts

export type Permission = {
  _id: string;
  name: string;
};

export type Role = {
  _id: string;
  name: string;
  description: string;
  status: string;
  permissions: Permission[]; // Not string[]
};
