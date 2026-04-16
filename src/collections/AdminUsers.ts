import type { CollectionConfig } from "payload"

export const AdminUsers: CollectionConfig = {
  slug: "admin-users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      label: "Rôle",
      options: [
        { label: "Super Admin", value: "super_admin" },
        { label: "Éditeur", value: "editor" },
      ],
      access: {
        // Seul un super_admin peut modifier les rôles
        update: ({ req: { user } }) =>
          (user as { role?: string })?.role === "super_admin",
      },
    },
  ],
  access: {
    // Seuls les utilisateurs authentifiés Payload peuvent accéder
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) =>
      (user as { role?: string })?.role === "super_admin",
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) =>
      (user as { role?: string })?.role === "super_admin",
  },
}
