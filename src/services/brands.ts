import { createClient } from '@/utils/supabase/client'
import { Brand } from '@/types'
import { Database } from '@/types/supabase'

type DbBrand = Database['public']['Tables']['brands']['Row']

function mapDbToBrand(db: DbBrand): Brand {
  return {
    id: db.id,
    name: db.name,
    logoUrl: db.logo_url || undefined,
    logoText: db.logo_text || undefined,
    primaryColor: db.primary_color,
    secondaryColor: db.secondary_color,
    accentColor: db.accent_color,
    backgroundColor: db.background_color,
    textColor: db.text_color,
    fontFamily: db.font_family,
    secondaryFontFamily: db.secondary_font_family || undefined,
    instagramHandle: db.instagram_handle || '',
    website: db.website || undefined,
    phone: db.phone || undefined,
    defaultCta: db.default_cta || '',
    projectCount: 0, // Será calculado em consultas agregadas se necessário
  }
}

export const brandsService = {
  async getBrands(): Promise<Brand[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return (data || []).map(mapDbToBrand)
  },

  async createBrand(brand: Omit<Brand, 'id' | 'projectCount'>): Promise<Brand> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { data, error } = await supabase
      .from('brands')
      .insert({
        user_id: user.id,
        name: brand.name,
        logo_url: brand.logoUrl || null,
        logo_text: brand.logoText || null,
        primary_color: brand.primaryColor,
        secondary_color: brand.secondaryColor,
        accent_color: brand.accentColor,
        background_color: brand.backgroundColor,
        text_color: brand.textColor,
        font_family: brand.fontFamily,
        secondary_font_family: brand.secondaryFontFamily || null,
        instagram_handle: brand.instagramHandle || null,
        website: brand.website || null,
        phone: brand.phone || null,
        default_cta: brand.defaultCta || null,
        settings: {},
      })
      .select()
      .single()

    if (error) throw error
    return mapDbToBrand(data)
  },

  async updateBrand(brandId: string, updates: Partial<Omit<Brand, 'id' | 'projectCount'>>): Promise<Brand> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const dbUpdates: Database['public']['Tables']['brands']['Update'] = {}

    if (updates.name !== undefined) dbUpdates.name = updates.name
    if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl || null
    if (updates.logoText !== undefined) dbUpdates.logo_text = updates.logoText || null
    if (updates.primaryColor !== undefined) dbUpdates.primary_color = updates.primaryColor
    if (updates.secondaryColor !== undefined) dbUpdates.secondary_color = updates.secondaryColor
    if (updates.accentColor !== undefined) dbUpdates.accent_color = updates.accentColor
    if (updates.backgroundColor !== undefined) dbUpdates.background_color = updates.backgroundColor
    if (updates.textColor !== undefined) dbUpdates.text_color = updates.textColor
    if (updates.fontFamily !== undefined) dbUpdates.font_family = updates.fontFamily
    if (updates.secondaryFontFamily !== undefined) dbUpdates.secondary_font_family = updates.secondaryFontFamily || null
    if (updates.instagramHandle !== undefined) dbUpdates.instagram_handle = updates.instagramHandle || null
    if (updates.website !== undefined) dbUpdates.website = updates.website || null
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone || null
    if (updates.defaultCta !== undefined) dbUpdates.default_cta = updates.defaultCta || null

    const { data, error } = await supabase
      .from('brands')
      .update(dbUpdates)
      .eq('id', brandId)
      .select()
      .single()

    if (error) throw error
    return mapDbToBrand(data)
  },

  async deleteBrand(brandId: string): Promise<void> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandId)

    if (error) throw error
  }
}
