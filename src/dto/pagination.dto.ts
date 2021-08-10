export class PaginationDto<T> {
  constructor(public totalSize: number, public results: T[]) {}
}
