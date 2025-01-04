// app/[organization]/page.tsx
import { notFound } from "next/navigation";
import { validateDomain } from "@/actions/validate-domain";

// Next.js 13 server component
export default async function OrganizationPage({
  params,
}: {
  params: { organization: string };
}) {
  const { organization } = params;

  // Now "myorg" is available here
  const check = await validateDomain(organization);
  if (check.error) {
    notFound();
  }

  return (
    <div>
      <h1>Welcome to {organization}!</h1>
      <p>This is your organization-specific page.</p>
    </div>
  );
}
