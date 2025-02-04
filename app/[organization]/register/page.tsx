"use client"

import { RegisterTenantUserForm } from '@/components/auth/register-form-tenant-user';
import { useOrganization } from '@/hooks/use-organization';
import React from 'react'


function Register() {
  const { organizationId, organizationName, error } = useOrganization();

    // Handle error state
    if (error) {
      return <div>Error: {error}</div>;
    }
  
    // Handle loading state
    if (!organizationId || !organizationName) {
      return <div>Loading...</div>;
    }

  console.log("RegisterPage → organizationId:", organizationId); // Log this
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <RegisterTenantUserForm organizationName={organizationName} organizationId = {organizationId} />
          </div>
        </div>
  )
}

export default Register