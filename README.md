# @ckpack/midway-plugin-sequelize

Midway plugin for Sequelize V7

## 安装依赖

```shell
npm i @ckpack/midway-plugin-sequelize @sequelize/core --save
```

## 启用组件

```ts
import { join } from 'node:path';
import { Configuration, ILifeCycle } from '@midwayjs/core';
import * as sequelize from '@midwayjs/sequelize';

@Configuration({
  imports: [
    // ...
    sequelize,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration implements ILifeCycle {
  // ...
}
```

## 模型定义

详细参考<https://sequelize.org/docs/v7/models/defining-models/>

```ts
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from '@sequelize/core';
import { Attribute, NotNull } from '@sequelize/core/decorators-legacy';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @Attribute(DataTypes.STRING)
  @NotNull
  declare firstName: string;

  @Attribute(DataTypes.STRING)
  declare lastName: string | null;
}
```

## 数据源配置

```ts
import { Person } from '../entity/person';

export default {
  // ...
  sequelize: {
    dataSource: {
      // 第一个数据源，数据源的名字可以完全自定义, 具体参数与new Sequelize()构造函数参数一致
      default: {
        dialect: 'postgres',
        database: 'test4',
        username: 'root',
        models: [Person], // 注意此处与@midwayjs/sequelize不同
      },
      // 第二个数据源
      default2: {
        // ...
      },
    },
  },
};
```

## 使用方法

详细参考<https://sequelize.org/docs/v7/category/querying/>

```ts
import { Provide } from '@midwayjs/core';
import { Person } from '../entity/person';

@Provide()
export class PersonService {
  async createPerson() {
    const person = new Person({ name: 'bob', age: 99 });
    await person.save();
  }
}
```

## 获取数据源

数据源即创建出的 sequelize 对象，我们可以通过注入内置的数据源管理器来获取。

```ts
import { InjectDataSource } from '@ckpack/midway-plugin-sequelize';
import { Sequelize } from '@sequelize/core';
import { Person } from '../entity/person';

export class UserService {
  // 注入默认数据源
  @InjectDataSource()
  defaultDataSource: Sequelize;

  // 注入自定义数据源
  @InjectDataSource('default2')
  customDataSource: Sequelize;

  async getUser() {
    console.log(await this.defaultDataSource.models.Person.findAll());
  }
}
```
