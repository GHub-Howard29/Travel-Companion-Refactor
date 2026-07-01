export interface LocalAttachmentRecord {
  id: string;
  expenseId: string;
  tripId: string;
  fileName: string;
  mimeType: string;
  size: number;
  blob: Blob;
  createdAt: string;
}
