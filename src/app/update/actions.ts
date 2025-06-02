'use server'

// サーバー側の処理なので、サーバー側のSupabaseクライアントを使用
import { createClient } from '../utils/supabase/server'

/**
 * データ更新
 * @param formData - フォームデータ
 */
export async function updateData(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const text = formData.get('text') as string
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('todos')
    .update({ text })
    .eq('id', id)
  
  if (error) {
    console.error('Error updating data:', error)
    throw error
  }
}