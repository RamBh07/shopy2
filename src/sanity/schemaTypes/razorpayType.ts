import { defineType, defineField } from "sanity";

export const razorpayType= defineType({
  name: "razorpayorder",
  title: "Razorpayorder",
  type: "document",
  fields: [
    defineField({
      name: "orderId",
      title: "Order ID",
      type: "string",
    }),
    defineField({
      name: "paymentId",
      title: "Payment ID",
      type: "string",
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
    }),
    defineField({
      name: "amount",
      title: "Amount",
      type: "number",
    }),
    defineField({
      name: "productName",
      title: "Product Name",
      type: "string",
    }),
    defineField({
      name: "productCategory",
      title: "Product Category",
      type: "string",
    }),
    defineField({
      name: "productBrand",
      title: "Product Brand",
      type: "string",
    }),
    defineField({
      name: "productQuantity",
      title: "Product Quantity",
      type: "number",
    }),
defineField({
  name: "productImage",
  title: "Product Image",
  type: "image",
  options: {
    hotspot: true, // allows cropping/focus point
  },
}),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
    
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: new Date().toISOString(),
    }),
  ],
});
