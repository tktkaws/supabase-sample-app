import { deleteData } from './actions' // 後で作るので今はエラーになる
// サーバー側の処理なので、サーバー側のSupabaseクライアントを使用
import { createClient } from '../utils/supabase/server'

// このページをSSRにする（App Routerの仕様で、これがないと本番環境でこのページはSSGになる。その結果データベースを更新しても反映されなくなる。）
export const revalidate = 0;

const Page = async () => {
  // Supabaseクライアントを作成
  const supabase = await createClient();

  // Todoのリストを取得
  const { data: todos, error } = await supabase
    .from('todos')
    .select()

  // エラーが発生した場合
  if (error) {
    return <div>Todoの取得でエラーが発生しました</div>
  }
  
  return (
    <main>
      {todos.length > 0 &&
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              <form action={deleteData}>
                <input type="hidden" name="id" value={todo.id} />
                <span>{todo.text}</span>
                <button type="submit">削除</button>
              </form>
            </li>
          ))}
        </ul>
      }
    </main>
  );
}

export default Page