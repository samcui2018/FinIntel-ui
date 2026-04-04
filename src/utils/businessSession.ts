export type CurrentBusiness = {
  businessId: string;
  businessName: string;
};

const CURRENT_BUSINESS_ID_KEY = "currentBusinessId";
const CURRENT_BUSINESS_NAME_KEY = "currentBusinessName";

export function setCurrentBusiness(value: CurrentBusiness) {
  localStorage.setItem(CURRENT_BUSINESS_ID_KEY, value.businessId);
  localStorage.setItem(CURRENT_BUSINESS_NAME_KEY, value.businessName);
}

export function getCurrentBusiness(): CurrentBusiness | null {
  const businessId = localStorage.getItem(CURRENT_BUSINESS_ID_KEY);
  const businessName = localStorage.getItem(CURRENT_BUSINESS_NAME_KEY);

  if (!businessId || !businessName) {
    return null;
  }

  return {
    businessId,
    businessName,
  };
}

export function getCurrentBusinessId(): string | null {
  return localStorage.getItem(CURRENT_BUSINESS_ID_KEY);
}

export function getCurrentBusinessName(): string | null {
  return localStorage.getItem(CURRENT_BUSINESS_NAME_KEY);
}

export function clearCurrentBusiness() {
  localStorage.removeItem(CURRENT_BUSINESS_ID_KEY);
  localStorage.removeItem(CURRENT_BUSINESS_NAME_KEY);
}

// export type CurrentBusiness = {
//   businessId: string;
//   businessName: string;
// };

// export function setCurrentBusiness(value: CurrentBusiness) {
//   localStorage.setItem("currentBusinessId", value.businessId);
//   localStorage.setItem("currentBusinessName", value.businessName);
// }

// export function getCurrentBusiness(): CurrentBusiness | null {
//   const businessId = localStorage.getItem("currentBusinessId");
//   const businessName = localStorage.getItem("currentBusinessName");

//   if (!businessId || !businessName) {
//     return null;
//   }

//   return {
//     businessId,
//     businessName,
//   };
// }

// export function clearCurrentBusiness() {
//   localStorage.removeItem("currentBusinessId");
//   localStorage.removeItem("currentBusinessName");
// }