import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { image } from 'sanity'
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'insyto',
  title: 'IN SY TO CMS',
  projectId: 'fwnaiu91',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
})

