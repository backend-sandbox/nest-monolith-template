import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { isLocal } from 'src/common/utils';
import { PrismaQueryEvent } from './types';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    /**
     * @description Debug mode can be enabled only for local development
     * change to true to enable debug mode
     */
    const debugMode = isLocal && false;

    super({
      log: [
        // { emit: 'stdout', level: 'query' },
        // { emit: 'stdout', level: 'info' },
        // { emit: 'stdout', level: 'warn' },
        // { emit: 'stdout', level: 'error' },
        { emit: 'event', level: debugMode ? 'query' : 'info' },
      ],
      errorFormat: 'pretty',
    });

    if (debugMode) {
      const handler = (e: PrismaQueryEvent) => {
        Logger.debug(PrismaService, `[PRISMA INTERPOLATED QUERY] ${this.interpolateQuery(e.query, e.params)}`);
        Logger.debug(PrismaService, `[PRISMA QUERY] ${e.query}`);
        Logger.debug(PrismaService, `[PRISMA PARAMS] ${e.params}`);
      };
      this.$on('query' as never, handler);
    }
  }

  /**
   * @description Converts Prisma's parameterized queries
   * (e.g., `"SELECT * FROM User WHERE id = $1 AND name = $2"`)
   * into readable, executable SQL statements by replacing parameter
   * placeholders with their corresponding values from the parameters array.
   *
   * @example
   * ```typescript
   * const query = "SELECT * FROM User WHERE id = $1 AND name = $2";
   * const params = '[123, "John Doe"]';
   * const result = this.interpolateQuery(query, params);
   * // Returns: "SELECT * FROM User WHERE id = 123 AND name = 'John Doe'"
   * ```
   */
  private interpolateQuery(query: string, paramsJson: string): string {
    const params = JSON.parse(paramsJson);

    return query.replace(/\$(\d+)/g, (_, indexStr) => {
      const index = parseInt(indexStr, 10) - 1;
      const value = params[index];

      if (value === null || value === undefined) return 'NULL';

      if (typeof value === 'number') return value.toString();

      if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';

      if (typeof value === 'string') {
        if (/^\d+ [a-z]+$/i.test(value) || /^-?\d{4}-\d{2}-\d{2}/.test(value)) {
          return `'${value}'`;
        }

        const escaped = value.replace(/'/g, "''");
        return `'${escaped}'`;
      }

      return `'${JSON.stringify(value)}'`;
    });
  }
}
