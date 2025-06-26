import { useEffect, useState } from "react"; // Reactのフック
import { memosCol, onSnapshot } from "../firebase"; // Firestoreのメモコレクションとリアルタイム購読

// Recharts のグラフ描画コンポーネントたち
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// スタンプ頻度グラフコンポーネント
export function StampChart() {
  // グラフ用のデータ構造（スタンプ＋件数）
  type ChartData = {
    stamp: string;
    count: number;
  };

  // Firestoreから集計されたスタンプデータを保持
  const [data, setData] = useState<ChartData[]>([]);

  // 現在表示中のグラフ種別（棒 or 円）
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  // Firestoreからリアルタイムでメモを購読し、集計
  useEffect(() => {
    const unsub = onSnapshot(memosCol, snap => {
      const counts: Record<string, number> = {}; // スタンプごとのカウント用
      snap.docs.forEach(d => {
        const s = d.data().stamp; // メモからスタンプだけ取り出す
        counts[s] = (counts[s] || 0) + 1; // 件数をカウント
      });

      // Object.entriesで配列化し、データとしてセット
      setData(
        Object.entries(counts).map(([stamp, count]) => ({ stamp, count }))
      );
    });
    return unsub; // アンマウント時に購読解除
  }, []);

  // グラフ用のカラーパレット（円グラフで使用）
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8c91", "#6ab7ff"];

  return (
    <div>
      {/* グラフ切り替えボタン */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setChartType("bar")}
          style={{
            padding: "6px 12px",
            border: "1px solid #888",
            borderRadius: 4,
            backgroundColor: chartType === "bar" ? "#4CAF50" : "#f0f0f0",
            color: chartType === "bar" ? "#fff" : "#333",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          棒グラフ
        </button>
        <button
          onClick={() => setChartType("pie")}
          style={{
            padding: "6px 12px",
            border: "1px solid #888",
            borderRadius: 4,
            backgroundColor: chartType === "pie" ? "#2196F3" : "#f0f0f0",
            color: chartType === "pie" ? "#fff" : "#333",
            fontWeight: "bold",
            cursor: "pointer",
            marginLeft: 8
          }}
        >
          円グラフ
        </button>
      </div>

      {/* グラフ本体（選択タイプに応じて切り替え） */}
      <ResponsiveContainer width="100%" height={250}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="stamp" />               {/* 横軸：スタンプ */}
            <YAxis allowDecimals={false} />         {/* 縦軸：件数（整数のみ） */}
            <Tooltip />                             {/* ホバー時の詳細表示 */}
            <Bar dataKey="count" fill="#8884d8" />  {/* 棒の描画 */}
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="stamp"
              cx="50%"          // 中央配置X
              cy="50%"          // 中央配置Y
              outerRadius={80}  // 円グラフのサイズ
              label             // ラベル表示（スタンプ名）
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.stamp}
                  fill={colors[index % colors.length]} // 色割り当て
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}