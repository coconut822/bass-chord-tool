import { useState } from 'react';
import { ChordScaleTool } from './components/ChordScaleTool';
import { ChordTool } from './components/ChordTool';
import { ScaleTool } from './components/ScaleTool';
import { ToolTabId, ToolTabs } from './components/ToolTabs';

function App() {
  const [activeTab, setActiveTab] = useState<ToolTabId>('chords');

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Bass Writing Toolkit</p>
          <h1>贝斯和弦内音查询器</h1>
          <p className="hero-copy">输入和弦与音阶，查看组成音、共同音与四弦贝斯指板位置。</p>
        </div>
      </header>

      <ToolTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'chords' ? <ChordTool /> : null}
      {activeTab === 'scales' ? <ScaleTool /> : null}
      {activeTab === 'chordScale' ? <ChordScaleTool /> : null}

      <footer className="corner-signature" aria-label="版本与作者">
        <span>v1</span>
        <span>作者：保湿乳</span>
      </footer>
    </main>
  );
}

export default App;
