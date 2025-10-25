import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const newAddressType = defineType({
  name: "newaddress",
  title: "New Address",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Address Title",
      type: "string",
      description: "A friendly name for this address (e.g. Home, Work)",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "email",
      title: "User Email",
      type: "email",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "number",
    }),


    
    defineField({
      name: "fulladdress",
      title: "Full Address",
      type: "string",
      description: "The street address including apartment/unit number",
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      description: "Two letter state code (e.g. NY, CA)",
      validation: (Rule) => Rule.required().length(2).uppercase(),
    }),
  
defineField({
  name: "pin",
  title: "PIN Code",
  type: "string",
  description: "Enter a valid 6-digit PIN code (e.g. 110001)",
  validation: (Rule) =>
    Rule.required()
      .regex(/^\d{6}$/, {
        name: "pinCode",
        invert: false,
      })
      .error("Please enter a valid 6-digit PIN code (e.g. 110001)")
      .custom((pin) => {
        if (!pin) {
          return "PIN code is required";
        }
        if (!/^\d{6}$/.test(pin)) {
          return "Please enter a valid 6-digit PIN code (e.g. 110001)";
        }
        return true;
      }),
}),




    defineField({
      name: "default",
      title: "Default Address",
      type: "boolean",
      description: "Is this the default shipping address?",
      initialValue: false,
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "fulladdress",
      city: "city",
      state: "state",
      isDefault: "default",
    },
    prepare({ title, subtitle, city, state, isDefault }) {
      return {
        title: `${title} ${isDefault ? "(Default)" : ""}`,
        subtitle: `${subtitle}, ${city}, ${state}`,
      };
    },
  },
});
