import { validateDomain } from "@/actions/validate-domain";
import { notFound } from "next/navigation";
import React from "react";

export default async function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { organization: string };
}) {
  const { organization } = params;

  console.log("Layout → Detected Organization:", organization);

  if (!organization) {
    notFound();
  }

  const validation = await validateDomain(organization);
  console.log("Layout → Validation Result:", validation);

  if (validation.error || !validation.success) {
    notFound();
  }
  const { organizationId } = validation.success;
  console.log("OrganizationLayout → organizationId:", organizationId);
  console.log("OrganizationLayout → organizationId:", organization);

  
  return (
    <div>
      <header>
        {/* <h1>Welcome to {organization}!</h1> */}
      </header>
      <main>{React.cloneElement(children as React.ReactElement, { organization, organizationId })}</main>
    </div>
  );
}
