import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BusinessForm from "../components/BusinessForm";
import { getBusiness, updateBusiness } from "../services/businessApi";
import type { BusinessDetail, CreateBusinessRequest } from "../types/business";

export default function EditBusinessPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<BusinessDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getBusiness(id);
        setBusiness(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load business.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  async function handleSubmit(request: CreateBusinessRequest) {
    if (!id || !business) return;

    await updateBusiness(id, {
      ...request,
      isActive: business.isActive,
    });

    if (localStorage.getItem("currentBusinessId") === id) {
      localStorage.setItem("currentBusinessName", request.businessName);
    }

    navigate("/businesses");
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;
  if (!business) return <div>Business not found.</div>;

  return (
    <div>
      <h1>Edit Business</h1>
      <BusinessForm
        submitText="Save Changes"
        onSubmit={handleSubmit}
        initialValue={{
          businessName: business.businessName,
          legalName: business.legalName,
          industry: business.industry,
          website: business.website,
          phone: business.phone,
          taxId: business.taxId,
          addressLine1: business.addressLine1,
          addressLine2: business.addressLine2,
          city: business.city,
          stateProvince: business.stateProvince,
          postalCode: business.postalCode,
          country: business.country,
        }}
      />
    </div>
  );
}