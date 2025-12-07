import { serializeDto } from '@common/serialization';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Max, Min } from 'class-validator';

export type TDto<T = object> = new (...args: unknown[]) => T;

export type TPagination = {
  take: number;
  page: number;
};

export class PaginatedQuery {
  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Max(Number.MAX_SAFE_INTEGER)
  @Min(1)
  page: number = 1;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Max(30)
  @Min(1)
  take: number = 20;
}

export class PaginationUtils {
  static getSkip(query: TPagination) {
    return (query.page - 1) * query.take;
  }
}

export class BasePaginatedDto<T> {
  @IsInt()
  take: number;

  @IsInt()
  page: number;

  @IsInt()
  total: number;

  @IsInt()
  totalPages: number;

  @IsArray()
  @ApiProperty({ type: () => Array })
  data: Array<T>;
}

export class PaginatedDto<T extends object, S extends object = object> extends BasePaginatedDto<T> {
  @Exclude()
  classType: TDto<S>;

  constructor(data: T[], total: number, paginatedQuery: PaginatedQuery | null, classType: TDto<S>) {
    super();
    this.take = paginatedQuery?.take ?? total;
    this.page = paginatedQuery?.page ?? 1;
    this.total = total;
    this.totalPages = paginatedQuery ? Math.ceil(total / paginatedQuery.take) : 1;
    this.data = data;
    this.classType = classType;
  }

  /**
   * @param classType - Class type to serialize data to.
   * If not provided, the class type is set before will be used.
   */
  as<SNew extends object = object>(classType: TDto<SNew>): PaginatedDto<T, SNew> {
    return new PaginatedDto<T, SNew>(this.data, this.total, { take: this.take, page: this.page }, classType);
  }

  serialize(): BasePaginatedDto<S>;

  /**
   * @param classType - Class type to serialize data to.
   * If not provided, the class type is set before will be used.
   */
  serialize<SNew extends object = object>(classType?: TDto<SNew>): BasePaginatedDto<SNew> {
    return {
      take: this.take,
      page: this.page,
      total: this.total,
      totalPages: this.totalPages,
      data: serializeDto<object, object>(classType ?? this.classType, this.data) as SNew[],
    };
  }
}
