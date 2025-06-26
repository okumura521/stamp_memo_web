import { useEffect, useState } from "react"; // Reactのフックをインポート
import {
  memosCol,       // Firestoreのコレクション参照
  query,          // クエリ生成
  where,          // クエリ条件追加（フィルター）
  orderBy,        // 並び順指定
  onSnapshot,     // リアルタイム監視
  deleteDoc,      // ドキュメント削除
  doc             // ドキュメント参照を作る関数
} from "../firebase";

// Firestoreから取得するメモの型定義
type Memo = {
  id: string;         // FirestoreのドキュメントID
  memoText: string;   // メモの本文
  stamp: string;      // 選択したスタンプ（例: "⭐️"）
  createdAt: any;     // 作成日時（timestamp 型）
};

// 親コンポーネントから渡される props 型
type Props = {
  selectedStamp: string; // 抽出対象のスタンプ（空文字ならすべて表示）
};

export function MemoList({ selectedStamp }: Props) {
  const [memos, setMemos] = useState<Memo[]>([]); // メモ一覧を保持する state

  // メモ削除処理
  const remove = async (id: string) => {
    const ref = doc(memosCol, id);   // 対象ドキュメントを参照
    await deleteDoc(ref);            // Firestore から削除
  };

  // Firestoreのデータをリアルタイム取得する useEffect
  useEffect(() => {
    // スタンプ指定がある場合は where で絞り込み
    const q = selectedStamp
      ? query(
          memosCol,
          where("stamp", "==", selectedStamp),
          orderBy("createdAt", "desc")
        )
      : query(memosCol, orderBy("createdAt", "desc")); // すべて取得（新しい順）

    // onSnapshot でリアルタイム購読
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => {
        return {
          id: d.id,
          ...(d.data() as Omit<Memo, "id">) // Firestoreのデータにidを追加
        };
      });
      setMemos(list); // state更新
    });

    return () => unsub(); // クリーンアップ（購読解除）
  }, [selectedStamp]); // スタンプが変わるたび再取得

  // メモ一覧の表示
  return (
    <ul>
      {memos.map(m => (
        <li
          key={m.id}
          style={{
            display: "flex",               // 横並び
            alignItems: "center",         // 垂直中央揃え
            justifyContent: "space-between", // 左右に均等配置
            padding: "8px 12px",          // 内側マージン
            borderBottom: "1px solid #eee" // 下線で区切る
          }}
        >
          <span>{m.stamp}</span> {/* スタンプ表示 */}
          <span style={{ flex: 1, marginLeft: 8 }}>{m.memoText}</span> {/* メモ本文 */}
          <button
            onClick={() => remove(m.id)} // 削除ボタン
            style={{ marginLeft: 8 }}
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}