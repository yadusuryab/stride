export default {
  name: 'banner' as const,
  type: 'document' as const,
  title: 'Banner',
  fields: [
    {
      name: 'title',
      type: 'string' as const,
      title: 'Banner Title',
      description: 'Main headline for the banner',
    },
    {
      name: 'subtitle',
      type: 'string' as const,
      title: 'Subtitle',
      description: 'Secondary text or tagline',
    },
    {
      name: 'mediaType',
      type: 'string' as const,
      title: 'Media Type',
      description: 'Choose between image or video for the banner background',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio' as const,
      },
      initialValue: 'image',
    },
    {
      name: 'image',
      type: 'image' as const,
      title: 'Banner Image',
      description: 'Main banner image (recommended size: 1920x600px)',
      options: {
        hotspot: true,
      },
      hidden: ({ parent }: { parent: any }) => parent?.mediaType === 'video',
    },
    {
      name: 'video',
      type: 'file' as const,
      title: 'Banner Video',
      description: 'Main banner video (recommended: MP4 format, max 30MB)',
      options: {
        accept: 'video/mp4,video/webm,video/ogg',
      },
      hidden: ({ parent }: { parent: any }) => parent?.mediaType === 'image',
    },
    {
      name: 'videoPoster',
      type: 'image' as const,
      title: 'Video Poster',
      description: 'Thumbnail image for the video (displayed before video loads)',
      hidden: ({ parent }: { parent: any }) => parent?.mediaType === 'image',
    },
    {
      name: 'buttonText',
      type: 'string' as const,
      title: 'Button Text',
      description: 'Text displayed on the call-to-action button',
    },
    {
      name: 'buttonLink',
      type: 'string' as const,
      title: 'Button Link',
      description: 'URL or path where the button should lead',
    },
    {
      name: 'textPosition',
      type: 'string' as const,
      title: 'Text Position',
      description: 'Position of the text content on the banner',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio' as const,
      },
      initialValue: 'center',
    },
    {
      name: 'textColor',
      type: 'string' as const,
      title: 'Text Color',
      description: 'Color scheme for the text content',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio' as const,
      },
      initialValue: 'dark',
    },
    {
      name: 'active',
      type: 'boolean' as const,
      title: 'Active',
      description: 'Toggle to show/hide this banner',
      initialValue: true,
    },
    {
      name: 'order',
      type: 'number' as const,
      title: 'Order',
      description: 'Display order (lower numbers appear first)',
      initialValue: 0,
    },
    {
      name: 'startDate',
      type: 'datetime' as const,
      title: 'Start Date',
      description: 'When this banner should start appearing',
    },
    {
      name: 'endDate',
      type: 'datetime' as const,
      title: 'End Date',
      description: 'When this banner should stop appearing',
    },
  ],
};