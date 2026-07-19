import { createClient } from '@/utils/supabase/client'
import { Project, Slide, CarouselFormat, SlideImage, SlideStyles, SlideType, SlideTemplateId } from '@/types'
import { Database } from '@/types/supabase'

type DbProject = Database['public']['Tables']['projects']['Row']
type DbSlide = Database['public']['Tables']['slides']['Row']

function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

function mapDbToSlide(db: DbSlide): Slide {
  const styles = (db.styles || {}) as unknown as SlideStyles
  const image = db.image ? (db.image as unknown as SlideImage) : undefined

  return {
    id: db.id,
    order: db.position,
    type: db.type as SlideType,
    template: db.template_id as SlideTemplateId,
    title: db.title || undefined,
    subtitle: db.subtitle || undefined,
    body: db.body || undefined,
    highlight: db.highlight || undefined,
    cta: db.cta || undefined,
    listItems: db.list_items || undefined,
    image,
    styles: {
      backgroundColor: styles.backgroundColor || '#ffffff',
      textColor: styles.textColor || '#000000',
      accentColor: styles.accentColor || '#ff0000',
      fontFamily: styles.fontFamily || 'Inter',
      titleSize: styles.titleSize,
      bodySize: styles.bodySize,
      alignment: styles.alignment,
    },
  }
}

function mapDbToProject(db: DbProject, slides: Slide[]): Project {
  return {
    id: db.id,
    title: db.title,
    theme: db.theme,
    status: db.status as Project['status'],
    width: db.width,
    height: db.height,
    brandId: db.brand_id || '',
    caption: db.caption || '',
    hashtags: db.hashtags || [],
    format: db.format as CarouselFormat,
    creationMode: db.creation_mode as Project['creationMode'],
    updatedAt: db.updated_at,
    slides: slides.sort((a, b) => a.order - b.order),
    generationMetadata: db.generation_metadata
      ? (db.generation_metadata as unknown as Project['generationMetadata'])
      : undefined,
  }
}

export const projectsService = {
  async getProjects(): Promise<Project[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Puxa projetos
    const { data: dbProjects, error: errProjects } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (errProjects) throw errProjects
    if (!dbProjects || dbProjects.length === 0) return []

    // Puxa slides de todos os projetos carregados
    const projectIds = dbProjects.map((p) => p.id)
    const { data: dbSlides, error: errSlides } = await supabase
      .from('slides')
      .select('*')
      .in('project_id', projectIds)

    if (errSlides) throw errSlides

    const slidesMap: Record<string, Slide[]> = {}
    dbSlides?.forEach((dbSlide) => {
      const slide = mapDbToSlide(dbSlide)
      if (!slidesMap[dbSlide.project_id]) {
        slidesMap[dbSlide.project_id] = []
      }
      slidesMap[dbSlide.project_id].push(slide)
    })

    return dbProjects.map((dbProj) => mapDbToProject(dbProj, slidesMap[dbProj.id] || []))
  },

  async createProject(project: Omit<Project, 'id' | 'updatedAt'>): Promise<Project> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // 1. Insere o Projeto
    const projectInsert: Database['public']['Tables']['projects']['Insert'] = {
      user_id: user.id,
      title: project.title,
      theme: project.theme,
      status: project.status,
      width: project.width,
      height: project.height,
      brand_id: isUuid(project.brandId) ? project.brandId : null,
      caption: project.caption,
      hashtags: project.hashtags,
      format: project.format,
      creation_mode: project.creationMode || 'custom',
      generation_metadata: project.generationMetadata ? (project.generationMetadata as unknown as Database['public']['Tables']['projects']['Insert']['generation_metadata']) : null,
    }

    const { data: dbProj, error: errProj } = await supabase
      .from('projects')
      .insert(projectInsert)
      .select()
      .single()

    if (errProj) throw errProj

    // 2. Insere os slides vinculados
    const slidesInsert = project.slides.map((s) => ({
      project_id: dbProj.id,
      position: s.order,
      type: s.type,
      template_id: s.template,
      title: s.title || null,
      subtitle: s.subtitle || null,
      body: s.body || null,
      highlight: s.highlight || null,
      cta: s.cta || null,
      list_items: s.listItems || null,
      image: s.image ? (s.image as unknown as Database['public']['Tables']['slides']['Insert']['image']) : null,
      styles: s.styles as unknown as Database['public']['Tables']['slides']['Insert']['styles'],
    }))

    const { data: dbSlides, error: errSlides } = await supabase
      .from('slides')
      .insert(slidesInsert)
      .select()

    if (errSlides) throw errSlides

    const mappedSlides = (dbSlides || []).map(mapDbToSlide)
    return mapDbToProject(dbProj, mappedSlides)
  },

  async updateProject(projectId: string, updates: Partial<Omit<Project, 'id' | 'slides' | 'updatedAt'>>): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const dbUpdates: Database['public']['Tables']['projects']['Update'] = {}

    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.theme !== undefined) dbUpdates.theme = updates.theme
    if (updates.status !== undefined) dbUpdates.status = updates.status
    if (updates.width !== undefined) dbUpdates.width = updates.width
    if (updates.height !== undefined) dbUpdates.height = updates.height
    if (updates.brandId !== undefined) dbUpdates.brand_id = isUuid(updates.brandId) ? updates.brandId : null
    if (updates.caption !== undefined) dbUpdates.caption = updates.caption
    if (updates.hashtags !== undefined) dbUpdates.hashtags = updates.hashtags
    if (updates.format !== undefined) dbUpdates.format = updates.format
    if (updates.creationMode !== undefined) dbUpdates.creation_mode = updates.creationMode
    if (updates.generationMetadata !== undefined) dbUpdates.generation_metadata = updates.generationMetadata ? (updates.generationMetadata as unknown as Database['public']['Tables']['projects']['Update']['generation_metadata']) : null

    const { error } = await supabase
      .from('projects')
      .update(dbUpdates)
      .eq('id', projectId)

    if (error) throw error
  },

  async deleteProject(projectId: string): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (error) throw error
  },

  async addSlide(projectId: string, slide: Omit<Slide, 'id'>): Promise<Slide> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('slides')
      .insert({
        project_id: projectId,
        position: slide.order,
        type: slide.type,
        template_id: slide.template,
        title: slide.title || null,
        subtitle: slide.subtitle || null,
        body: slide.body || null,
        highlight: slide.highlight || null,
        cta: slide.cta || null,
        list_items: slide.listItems || null,
        image: slide.image ? (slide.image as unknown as Database['public']['Tables']['slides']['Insert']['image']) : null,
        styles: slide.styles as unknown as Database['public']['Tables']['slides']['Insert']['styles'],
      })
      .select()
      .single()

    if (error) throw error
    return mapDbToSlide(data)
  },

  async updateSlide(slideId: string, updates: Partial<Omit<Slide, 'id' | 'order'>>): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const dbUpdates: Database['public']['Tables']['slides']['Update'] = {}

    if (updates.type !== undefined) dbUpdates.type = updates.type
    if (updates.template !== undefined) dbUpdates.template_id = updates.template
    if (updates.title !== undefined) dbUpdates.title = updates.title || null
    if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle || null
    if (updates.body !== undefined) dbUpdates.body = updates.body || null
    if (updates.highlight !== undefined) dbUpdates.highlight = updates.highlight || null
    if (updates.cta !== undefined) dbUpdates.cta = updates.cta || null
    if (updates.listItems !== undefined) dbUpdates.list_items = updates.listItems || null
    if (updates.image !== undefined) dbUpdates.image = updates.image ? (updates.image as unknown as Database['public']['Tables']['slides']['Update']['image']) : null
    if (updates.styles !== undefined) dbUpdates.styles = updates.styles as unknown as Database['public']['Tables']['slides']['Update']['styles']

    const { error } = await supabase
      .from('slides')
      .update(dbUpdates)
      .eq('id', slideId)

    if (error) throw error
  },

  async deleteSlide(projectId: string, slideId: string): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Deleta o slide correspondente
    const { error } = await supabase
      .from('slides')
      .delete()
      .eq('id', slideId)

    if (error) throw error
  },

  async reorderSlides(projectId: string, slides: Slide[]): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    // Cria as atualizações em lote (upsert com IDs de slides e posições atualizadas)
    const upserts = slides.map((s) => ({
      id: s.id,
      project_id: projectId,
      position: s.order,
      type: s.type,
      template_id: s.template,
      title: s.title || null,
      subtitle: s.subtitle || null,
      body: s.body || null,
      highlight: s.highlight || null,
      cta: s.cta || null,
      list_items: s.listItems || null,
      image: s.image ? (s.image as unknown as Database['public']['Tables']['slides']['Insert']['image']) : null,
      styles: s.styles as unknown as Database['public']['Tables']['slides']['Insert']['styles'],
    }))

    const { error } = await supabase
      .from('slides')
      .upsert(upserts)

    if (error) throw error
  }
}
