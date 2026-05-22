export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      description: 'Enter the name of the category (e.g., Shoes, Watches)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      description:
        'This is used in the website link (URL). It will be created automatically from the category name.',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Category Image',
      description: 'Upload a photo that represents this category',
      type: 'image',
      options: { hotspot: true },
    },
  ],
};
