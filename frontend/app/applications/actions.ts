"use server";

import { StepStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { computeFinalStatus } from "@/lib/status/status";
import { getCurrentUser } from "@/lib/auth/server";

export async function createApplicationAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const company = String(formData.get("company") ?? "").trim();
  const roleTitle = String(formData.get("roleTitle") ?? "").trim();
  const dateApplied = new Date(String(formData.get("dateApplied") ?? new Date().toISOString()));

  if (!company || !roleTitle) {
    throw new Error("Company and role title are required.");
  }

  const step1Status = (formData.get("step1Status") as StepStatus) ?? StepStatus.Pending;
  const step2Status = (formData.get("step2Status") as StepStatus) ?? StepStatus.Pending;
  const step3Status = (formData.get("step3Status") as StepStatus) ?? StepStatus.Pending;

  await prisma.application.create({
    data: {
      userId: user.id,
      company,
      roleTitle,
      location: String(formData.get("location") ?? "") || null,
      applicationLink: String(formData.get("applicationLink") ?? "") || null,
      dateApplied,
      contactPerson: String(formData.get("contactPerson") ?? "") || null,
      contactInfo: String(formData.get("contactInfo") ?? "") || null,
      salary: String(formData.get("salary") ?? "") || null,
      step1Status,
      step2Status,
      step3Status,
      finalStatus: computeFinalStatus({
        step1Status,
        step2Status,
        step3Status,
        dateApplied
      }),
      notes: String(formData.get("notes") ?? "") || null,
      source: String(formData.get("source") ?? "") || null,
      nextFollowUp: formData.get("nextFollowUp") ? new Date(String(formData.get("nextFollowUp"))) : null
    }
  });

  revalidatePath("/applications");
  redirect("/applications");
}
