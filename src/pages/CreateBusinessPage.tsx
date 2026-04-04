import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BusinessForm from "../components/BusinessForm";
import { createBusiness, getBusinesses } from "../services/businessApi";
import { setCurrentBusiness } from "../utils/businessSession";
import type { CreateBusinessRequest } from "../types/business";

export default function CreateBusinessPage() {
  const navigate = useNavigate();
  const [pageError, setPageError] = useState("");

  async function handleSubmit(request: CreateBusinessRequest) {
    setPageError("");

    const created = await createBusiness(request);

    const businesses = await getBusinesses();
    const createdBusiness = businesses.find(b => b.businessId === created.businessId);

    if (createdBusiness) {
      setCurrentBusiness({
        businessId: createdBusiness.businessId,
        businessName: createdBusiness.businessName,
      });
    } else {
      setCurrentBusiness({
        businessId: created.businessId,
        businessName: request.businessName,
      });
    }

    navigate("/");
  }

  return (
    <div>
      <h1>Create Business</h1>
      <p>Add your first business to continue.</p>
      {pageError ? <div style={{ color: "crimson" }}>{pageError}</div> : null}
      <BusinessForm submitText="Create Business" onSubmit={handleSubmit} />
    </div>
  );
}