import { validateDomain } from "@/actions/validate-domain";
import { notFound } from "next/navigation";

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

  const check = await validateDomain(organization);
  console.log("Layout → Validation Result:", check);

  if (check.error) {
    notFound();
  }

  return (
    <div>
      <header>
        <h1>Welcome to {organization}!</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
