import { useState } from "react"; // Reactの状態管理フック
import { memosCol, addDoc, ts } from "../firebase"; // Firebaseのコレクション参照、追加関数、タイムスタンプ関数

// スタンプ定義を受け取る
  type Props = {
    stamps: string[];
  };


export function MemoInput({ stamps }: Props) {
  // メモ本文（テキスト）の状態
  const [text, setText] = useState("");

  // 選択中のスタンプ
  const [stamp, setStamp] = useState(stamps[0]);

  // メモを送信（Firestoreに追加）する関数
  const submit = async () => {
    if (!text) return; // 空のテキストは無視
    await addDoc(memosCol, {
      memoText: text,     // メモ本文
      stamp,              // 選択されたスタンプ
      createdAt: ts()     // 作成日時（サーバータイムスタンプ）
    });
    setText(""); // 投稿後は入力欄をリセット
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* メモ入力欄 */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)} // 入力文字を状態に反映
        placeholder="メモを入力…"
        rows={3}
      />

      {/* スタンプ選択ドロップダウン */}
      <div style={{ margin: "8px 0" }}>
        <select
          value={stamp}
          onChange={(e) => setStamp(e.target.value)} // 選択スタンプを更新
          style={{ fontSize: 16 }}
        >
          {stamps.map((s) => (
            <option key={s} value={s}>
              {s} {/* ⭐️など絵文字をそのまま表示 */}
            </option>
          ))}
        </select>
      </div>

      {/* 追加ボタン */}
      <button onClick={submit}>追加</button>
    </div>
  );
}