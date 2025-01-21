'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
//import { LoginForm } from "@/components/tenant-user-login-form"

export default function OrganizationLoginPage() {
  const router = useRouter();
  const params = useParams();
  const organization = params.organization; // Access the dynamic 'organization' parameter

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        organization,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // Redirect to the organization's dashboard
      router.push(`/${organization}/dashboard`);
    } else {
      console.error('Login failed');
      // Handle errors (e.g., display a message)
    }
  };

  return (
    <div>
      <h1>Login to {organization}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>

    // <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
    //   <div className="w-full max-w-sm md:max-w-3xl">
    //     <LoginForm />
    //   </div>
    // </div>
  );
}
