// StampFilter が受け取る props の型定義
type Props = {
  stamps: string[];                      // 表示するスタンプの一覧（例：["⭐️", "✅", "⚠️"]）
  onSelect: (stamp: string) => void;     // スタンプ選択時に実行されるコールバック関数
};

// フィルターUIを表示するコンポーネント
export function StampFilter({ stamps, onSelect }: Props) {
  return (
    <div>
      {/* 「全て」ボタン：すべてのメモを表示 */}
      <button onClick={() => onSelect("")}>全て</button>

      {/* 各スタンプごとのフィルターボタン */}
      {stamps.map((s: string) => (
        <button
          key={s}
          onClick={() => onSelect(s)} // 選択スタンプをコールバックで親へ通知
        >
          {s} {/* 絵文字スタンプをそのまま表示 */}
        </button>
      ))}
    </div>
  );
}