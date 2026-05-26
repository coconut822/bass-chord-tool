export type ToolTabId = 'chords' | 'scales' | 'chordScale';

interface ToolTabsProps {
  activeTab: ToolTabId;
  onChange: (tab: ToolTabId) => void;
}

const TABS: Array<{ id: ToolTabId; label: string; hint: string }> = [
  { id: 'chords', label: '和弦内音', hint: '查询和弦组成音' },
  { id: 'scales', label: '音阶查询', hint: '查看音阶指板' },
  { id: 'chordScale', label: '和弦 + 音阶', hint: '稳定音与色彩音' },
];

export function ToolTabs({ activeTab, onChange }: ToolTabsProps) {
  return (
    <nav className="tool-tabs" aria-label="功能分类">
      {TABS.map((tab) => (
        <button className={activeTab === tab.id ? 'tool-tab active' : 'tool-tab'} key={tab.id} type="button" onClick={() => onChange(tab.id)}>
          <strong>{tab.label}</strong>
          <span>{tab.hint}</span>
        </button>
      ))}
    </nav>
  );
}
