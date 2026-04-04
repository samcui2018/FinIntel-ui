// export type UploadResponse = {
//   loadId: string;
//   rowsInFile: number;
//   rowsInserted: number;
//   status: string;
// };
export interface UploadCsvResponse {
  message: string;
  loadId: string;
  businessId: string;
  rowsInFile: number;
  rowsStaged: number;
  rowsInserted: number;
  rowsSkippedAsDuplicates: number;
  status: string;
  insightCount: number;
}