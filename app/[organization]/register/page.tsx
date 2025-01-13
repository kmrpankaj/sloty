"use client"

import { LoginForm } from '@/components/tenant-user-signup-form'
import React from 'react'

function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm />
          </div>
        </div>
  )
}

export default Register