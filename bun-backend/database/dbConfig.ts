import Knex from "knex";
import knexConfig from "./knexfile";
import { Knex as KnexType } from "knex";

const dbInstances: { [key: string]: KnexType } = {
  auth: Knex(knexConfig.auth),
  core: Knex(knexConfig.core),
  tenant1: Knex(knexConfig.tenant1),
  tenant2: Knex(knexConfig.tenant2),
  tenant3: Knex(knexConfig.tenant3),
};

let tenantDb: KnexType | null = null;

export const getDbInstance = (tenant: string): KnexType => {
  return dbInstances[tenant];
};

export const setTenantDb = (dbName: string): void => {
  tenantDb = getDbInstance(dbName);
};

export const getTenantDb = (): KnexType | null => {
  return tenantDb;
};
