import { getBusinesses } from "../services/businessApi";
import { setCurrentBusiness, clearCurrentBusiness } from "./businessSession";

export async function postAuthNavigation(navigate: (path: string) => void) {
  const businesses = await getBusinesses();

  if (businesses.length > 0) {
    const selected = businesses.find((x) => x.isDefault) ?? businesses[0];

    setCurrentBusiness({
      businessId: selected.businessId,
      businessName: selected.businessName,
    });

    navigate("/");
    return;
  }

  clearCurrentBusiness();
  navigate("/businesses/new");
}