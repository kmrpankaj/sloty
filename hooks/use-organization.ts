import { useParams } from "next/navigation";
import { validateDomain } from "@/actions/validate-domain";
import { useState, useEffect } from "react";

export function useOrganization() {
  const { organization } = useParams();
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    // Ensure organization is a string
    if (!organization || Array.isArray(organization)) {
        setError("Invalid organization");
        return;
      }

    //validate domain
    validateDomain(organization)
      .then((res) => {
        if (res.success) {
          setOrganizationId(res.success.organizationId);
        } else {
          setError(res.error || "Invalid organization");
        }
      })
      .catch(() => setError("Server error occurred"));
  }, [organization]);



  return { organizationId: organizationId!, error };
}
