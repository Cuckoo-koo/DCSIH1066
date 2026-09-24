import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url');

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Storage Bucket Helper for Media Uploads
 */
export async function uploadMediaFile(file: File, folder: 'audio' | 'images' | 'video' = 'images') {
  if (!supabase) {
    // Provide a rich local object URL when offline/mock mode
    return {
      url: URL.createObjectURL(file),
      type: folder === 'audio' ? 'audio' : folder === 'video' ? 'video' : 'image',
      caption: file.name
    };
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('cultural-media')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    return {
      url: URL.createObjectURL(file),
      type: folder === 'audio' ? 'audio' : folder === 'video' ? 'video' : 'image',
      caption: file.name
    };
  }

  const { data } = supabase.storage
    .from('cultural-media')
    .getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    type: folder === 'audio' ? 'audio' : folder === 'video' ? 'video' : 'image',
    caption: file.name
  };
}
