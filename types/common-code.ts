export interface CommonCodeType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface CommonCodeDetail {
  id: string;
  typeId: string;
  code: string;
  label: string;
  sortOrder: number;
  isActive: boolean;
}
