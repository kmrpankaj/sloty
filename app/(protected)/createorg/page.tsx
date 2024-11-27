"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import { createOrganization } from "@/actions/create-organization";

// Import the Organization Schema
import { CreateOrganizationSchema } from "@/schemas";

type OrganizationFormValues = z.infer<typeof CreateOrganizationSchema>;

const CreateOrganizationForm = ({ tenantId }: { tenantId: string }) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Record<string, string[]> | string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: {
      name: "",
      planType: "",
      subdomain: "",
      domain: "",
    },
    shouldUnregister: false,
  });

  const onSubmit = (values: OrganizationFormValues) => {
    console.log("onSubmit triggered with values:", values);
    setError("");
    setSuccess("");

    startTransition(() => {
      createOrganization(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.success) {
            setSuccess(data.success);
            form.reset(); // Reset form on success
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };


  return (
    <Card className="w-full max-w-[600px] mx-auto p-4 sm:p-6 md:p-8">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🏢 Create Organization</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, (e) => { console.log(e) })}>
            <div className="space-y-4">
              {/* Organization Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter organization name"
                        disabled={isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plan Type */}
              <FormField
                control={form.control}
                name="planType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Type</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subdomain */}
              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subdomain</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter subdomain (e.g., myorg)"
                        disabled={isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Domain (Optional) */}
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Domain (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter custom domain (e.g., customdomain.com)"
                        disabled={isPending}
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Form feedback */}
            {error && typeof error === "string" && <FormError message={error} />}
            {error && typeof error === "object" && (
              <div className="text-red-500">
                {Object.entries(error).map(([field, messages]) => (
                  <div key={field}>
                    <strong>{field}:</strong> {messages.join(", ")}
                  </div>
                ))}
              </div>
            )}
            {success && <FormSuccess message={success} />}

            {/* Submit Button */}
            <Button type="submit" disabled={isPending}>
              Create Organization
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateOrganizationForm;
