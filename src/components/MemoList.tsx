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
  haiku?: string;     // ✅ 俳句を追加（空もあるのでoptionalにしておく）
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
          display: "flex",
          flexDirection: "column", // ✅ 縦並びに変更
          padding: "12px",
          borderBottom: "1px solid #eee"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{m.stamp}</span>
          <span style={{ flex: 1, marginLeft: 8 }}>{m.memoText}</span>
          <button onClick={() => remove(m.id)} style={{ marginLeft: 8 }}>
            削除
          </button>
        </div>

        {/* ✅ 俳句を表示（存在する場合のみ） */}
        {m.haiku && (
          <div style={{ marginTop: 6, fontStyle: "italic", color: "#555" }}>
            🌸 <strong>俳句：</strong>{m.haiku}
          </div>
        )}
      </li>
    ))}
  </ul>
  );
}