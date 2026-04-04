export type Business = {
  businessId: string;
  businessName: string;
  legalName?: string;
  industry?: string;
  website?: string;
  phone?: string;
  roleName: string;
  isDefault: boolean;
  isActive: boolean;
};

export type BusinessDetail = {
  businessId: string;
  businessName: string;
  legalName?: string;
  industry?: string;
  website?: string;
  phone?: string;
  taxId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
  roleName: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
};

export type CreateBusinessRequest = {
  businessName: string;
  legalName?: string;
  industry?: string;
  website?: string;
  phone?: string;
  taxId?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
};

export type UpdateBusinessRequest = CreateBusinessRequest & {
  isActive: boolean;
};