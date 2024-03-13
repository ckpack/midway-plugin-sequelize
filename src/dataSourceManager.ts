import {
  Config,
  DataSourceManager,
  ILogger,
  Init,
  Inject,
  Logger,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { Sequelize } from '@sequelize/core';

@Provide()
@Scope(ScopeEnum.Singleton)
export class SequelizeDataSourceManager extends DataSourceManager<Sequelize> {
  @Config('sequelize')
  sequelizeConfig;

  @Logger('coreLogger')
  coreLogger: ILogger;

  @Inject()
  baseDir: string;

  @Init()
  async init() {
    await this.initDataSource(this.sequelizeConfig, this.baseDir);
  }

  getName(): string {
    return 'sequelize';
  }

  protected async createDataSource(
    config: any,
    dataSourceName: string,
  ): Promise<Sequelize> {
    const client = new Sequelize(config);
    const entities = config.entities;
    if (entities && entities.length > 0) {
      client.addModels(entities);
    }

    await client.authenticate();

    this.coreLogger.info('[midway:sequelize] connecting and start');
    return client;
  }

  protected async checkConnected(dataSource: Sequelize) {
    try {
      await dataSource.authenticate();
      return true;
    } catch (err) {
      this.coreLogger.error(err);
      return false;
    }
  }

  protected async destroyDataSource(dataSource: Sequelize) {
    if (await this.checkConnected(dataSource)) {
      await dataSource.close();
    }
  }
}
