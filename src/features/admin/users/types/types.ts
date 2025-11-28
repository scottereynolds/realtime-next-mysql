// Keep in sync with your app's role concept (auth.ts uses "user" | "administrator").
export type AdminRole = "user" | "administrator";

export interface AdminUser {
  id: string;               // Prisma User.id is String (cuid())
  name: string | null;
  email: string;
  role: AdminRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUserFormValues {
  name: string;
  email: string;
  role: AdminRole;
  /**
   * Optional. Required for create, optional for edit (password reset).
   * If left empty on edit, password is unchanged.
   */
  password: string;
}

export type AdminUserFormMode = "create" | "edit";
