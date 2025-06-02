'use server'

// サーバー側の処理なので、サーバー側のSupabaseクライアントを使用
import { createClient } from '../utils/supabase/server'

/**
 * データ挿入
 * @param formData - フォームデータ
 */
export async function insertData(formData: FormData) {
  const text = formData.get('text') as string
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('todos')
    .insert([{ text }])
  
  if (error) {
    console.error('Error inserting data:', error)
    throw error
  }
}