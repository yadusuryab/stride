export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      validation: (Rule: any) => Rule.required().min(10),
    },
    {
      name: 'alternatePhone',
      title: 'Alternate Phone',
      type: 'string',
    },
    {
      name: 'instagramId',
      title: 'Instagram ID',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'district',
      title: 'District',
      type: 'string',
    },
    {
      name: 'state',
      title: 'State',
      type: 'string',
    },
    {
      name: 'pincode',
      title: 'Pincode',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'landmark',
      title: 'Landmark',
      type: 'string',
    },
    {
      name: 'products',
      title: 'Ordered Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(1),
            },
            {
              name: 'size',
              title: 'Selected Size',
              type: 'string',
            },
            {
              name: 'color',
              title: 'Selected Color',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'paymentMode',
      title: 'Payment Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Online Payment', value: 'online' },
          { title: 'Cash on Delivery', value: 'cod' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'transactionId',
      title: 'Transaction ID',
      type: 'string',
    },
    {
      name: 'shippingCharges',
      title: 'Shipping Charges',
      type: 'number',
    },
    {
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0),
    },
    {
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
    },
    {
      name: 'orderedAt',
      title: 'Ordered At',
      type: 'datetime',
      initialValue: new Date().toISOString(),
      readOnly: true,
    },
  ],
};
