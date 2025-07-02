import { useState } from "react";
import { MemoInput } from "./components/MemoInput";
import { StampFilter } from "./components/StampFilter";
import { MemoList } from "./components/MemoList";
import { StampChart } from "./components/StampChart";

const stamps = ["⭐️", "✅", "⚠️","🥵"];

function App() {
  const [selectedStamp, setSelectedStamp] = useState<string>("");

  return (
  <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
    <h2>スタンプメモ</h2>
    <MemoInput stamps={stamps}/>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 24 }}>
      {/* 左側：メモリスト */}
      <div style={{ flex: 1, minWidth: 280 }}>
        <h2>メモリスト</h2>
        <p>ソートボタン</p>
        <StampFilter stamps={stamps} onSelect={setSelectedStamp} />
        <MemoList selectedStamp={selectedStamp} />
      </div>

      {/* 右側：グラフ */}
      <div style={{ width: 360, flexShrink: 0 }}>
        <h2 style={{ fontSize: "1.2em" }}>スタンプ頻度グラフ</h2>
        <StampChart />
      </div>
    </div>
  </div>
);
}

export default App;


