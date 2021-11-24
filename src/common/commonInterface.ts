import { ObjectId } from "mongodb";

export interface IPagination<T> {
  data: T[];
  recordsPerPage: number,
  totalRecords: number;
}
  
export interface IPaginationFilter {
  select?: object,
  sort?: number,
  skip?: number,
  limit?: number,
  lean: boolean
}

export interface IDocumentUpdate {
  acknowledged: boolean,
  modifiedCount: number,
  upsertedId: ObjectId | null,
  upsertedCount: number,
  matchedCount: number
}