# 贝斯和弦内音查询器

一个面向贝斯手的和弦内音查询网页应用。当前版本聚焦写歌时的快速查询：识别单个和弦或一组和弦、显示组成音、提示相邻共同音，并在标准四弦贝斯指板上标出当前聚焦和弦的内音。

## 启动

```bash
npm install
npm run dev
```

然后打开终端里显示的本地地址。

## 项目结构

```text
src/
  lib/
    musicTheory.ts          # 和弦解析、组成音、贝斯指板音位生成
  components/
    ChordInput.tsx          # 和弦名输入
    ChordSelector.tsx       # 根音与和弦类型按钮选择
    ChordInfo.tsx           # 查询结果信息
    ChordProgression.tsx    # 多和弦结果与共同音提示
    BassFretboard.tsx       # 标准四弦贝斯指板
    Legend.tsx              # 音程角色图例
    RecentQueries.tsx       # 最近查询记录
  App.tsx                   # 页面状态与组件组合
  main.tsx                  # React 入口
  styles.css                # 全局样式与响应式布局
```

## 当前支持的输入

- 单个和弦：`Em`、`Cmaj7`、`C大三和弦`、`F#sus4`
- 多个和弦：`Em | B | A | G`
- 空格分隔：`Em B A G`
- 大三和弦：`C`、`Cmaj`、`C major`、`C大三和弦`
- 小三和弦：`Cm`、`Cmin`、`C minor`、`C小三和弦`
- 减三和弦：`Cdim`、`C减三和弦`
- 增三和弦：`Caug`、`C增三和弦`
- 挂二和弦：`Csus2`
- 挂四和弦：`Csus4`
- 属七和弦：`C7`、`C属七和弦`
- 大七和弦：`Cmaj7`、`C大七和弦`
- 小七和弦：`Cm7`、`C小七和弦`
- 升降根音：`C#`、`Db`、`F#`、`Gb` 等

## 未来扩展方向

后续如果要扩展成写歌辅助器，建议优先加入“把位范围筛选”和“相邻和弦指板连接视图”。它比自动生成贝斯线更基础，也更贴近真实写作流程：先看每个和弦的根音、三音、五音、七音在附近品位如何连接，再让用户自己形成线条。
