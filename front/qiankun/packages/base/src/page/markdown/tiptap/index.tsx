import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Tag } from "antd";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useTiptapHighlight, HighlightMark, findRangeByText, isEditorReady } from "./hooks/useTiptapHighlight";
import { useHighlightBubbleMenu } from "./hooks/useHighlightBubbleMenu";
import ReactHighlightWidget, { registerHighlightBridge } from "./components/ReactHighlightWidget";
import { MyBlock } from "./extensions/MyBlock";
import "./styles.less";
import { Markdown } from "@tiptap/markdown";

const TextArea = Input.TextArea;

// 模拟：后端返回的富文本（HTML）内容，包含 <my-block>
const backendHtmlContent = `
  <p>这里是后端返回的 <strong>富文本 HTML</strong> 示例：</p>
  <my-block data-type="warning" data-title="HTML 模式的 my-block">
    <p>这是通过 <code>&lt;my-block&gt;</code> 标签包裹的一段内容（HTML）。</p>
  </my-block>
  <p>后面仍然可以是普通的段落和列表：</p>
  <ul>
    <li>支持加粗 / 斜体 / 列表等富文本格式</li>
    <li>也可以混用多个 <code>&lt;my-block&gt;</code></li>
  </ul>
`;

// 模拟：后端返回的 Markdown 内容，其中直接内嵌 <my-block>
const backendMarkdownContent = `
这里是后端返回的 **Markdown** 示例：

> 普通 markdown 语法照常写，比如引用、列表、标题等。

<my-block data-type="info" data-title="Markdown 模式的 my-block">
  在 Markdown 文本中直接写一段 &lt;my-block&gt; HTML，
  交给 TipTap 解析并由自定义节点渲染。
</my-block>

后面依然可以继续写普通 markdown：

- 任务一
- 任务二
`;

// 默认演示用文章内容，放在页面层而不是 Hook 内
const defaultArticle = `
根据您提供的企业信息，杭州特安建设有限公司为一家以“综合楼”为主要场所类型的企业，建筑总面积在40000平方米以下，建筑高度超过54米的住宅类高层建筑，涉及**特种设备（气瓶）**、**危险作业（临时用电、高处作业）**、**室外停车场**等功能区域和活动，并被标记为**消防安全重点部位（综合楼主要功能区）**。尽管其消防类型标注为“无”，但因其属于高层住宅且存在重点功能区，应从严开展消防安全监管。

以下为针对该企业的**安全检查策略表**，适用于现场或视频远程检查：

---

### **杭州特安建设有限公司安全检查策略表**

| 检查大类 | 检查子项 | 具体检查内容/标准要求 | 风险等级 | 备注/依据 |
|----------|----------|------------------------|-----------|------------|
| 消防安全管理 | 消防安全责任制落实 | 1. 是否明确消防安全责任人、管理人并公示；<br>2. 是否建立逐级消防安全责任制；<br>3. 是否签订年度消防工作目标责任书。 | 高 | 《中华人民共和国消防法》第十六条、第十七条 |
|  | 消防控制室管理 | 1. 是否设有消防控制室（建议核查）；<br>2. 值班人员是否持证上岗（中级以上操作证）；<br>3. 是否实行24小时双人值班制度；<br>4. 是否有值班记录、故障处理记录。 | 高 | 《建筑消防设施的维护管理》GB25201；高层民用建筑应设控制室 |
|  | 防火巡查与检查 | 1. 是否每日开展防火巡查并记录；<br>2. 是否每月组织一次防火检查；<br>3. 巡查记录是否完整可查。 | 中高 | 《机关、团体、企业、事业单位消防安全管理规定》（公安部令第61号）第二十五条 |
|  | 消防档案建立 | 1. 是否建立完整的消防档案；<br>2. 内容是否包括：建筑物基本情况、消防设施配置图、维保记录、演练记录、隐患整改记录等。 | 中 | 同上第六十一条 |
| 建筑与平面布局 | 高层建筑消防安全管理 | 1. 是否制定高层建筑火灾应急预案；<br>2. 是否设置避难层（高度＞54m住宅需设）；<br>3. 疏散楼梯是否采用防烟楼梯间；<br>4. 外保温材料是否符合A级或B1级要求（建议核实）。 | 高 | 《建筑设计防火规范》GB50016-2014（2018版）第5.5.23、6.4.12条 |
|  | 安全出口与疏散通道 | 1. 安全出口数量、宽度是否符合规范；<br>2. 疏散通道是否畅通，无锁闭、封堵现象；<br>3. 应急照明和疏散指示标志是否完好有效。 | 高 | GB50016 第10章；实地抽查不少于2处 |
|  | 防火分区与防火门 | 1. 防火分区划分是否合规；<br>2. 常闭式防火门是否保持关闭状态；<br>3. 防火卷帘下是否堆放物品。 | 中高 | 视频检查时注意电梯厅、楼梯间门口情况 |
| 消防设施设备 | 室内消火栓系统 | 1. 消火栓箱内组件是否齐全（水枪、水带、启泵按钮）；<br>2. 是否有明显标识；<br>3. 是否被遮挡；<br>4. 顶层最不利点静压是否达标（建议现场测试）。 | 高 | GB50974《消防给水及消火栓系统技术规范》 |
|  | 自动喷水灭火系统 | 1. 末端试水装置是否正常；<br>2. 报警阀组压力是否正常；<br>3. 是否有漏水、关闭现象；<br>4. 水流指示器、信号阀是否处于工作状态。 | 高 | GB50261《自动喷水灭火系统施工及验收规范》 |
|  | 火灾自动报警系统 | 1. 探测器是否被遮挡或拆除；<br>2. 手动报警按钮是否完好；<br>3. 控制器是否运行正常，有无故障或屏蔽点位。 | 高 | GB50166《火灾自动报警系统施工及验收规范》 |
|  | 应急照明与疏散指示 | 1. 走道、楼梯间、前室应急照明照度是否达标；<br>2. 疏散指示方向是否正确；<br>3. 断电后持续供电时间是否≥30分钟。 | 中高 | GB51309《消防应急照明和疏散指示系统技术标准》 |
| 特种设备管理 | 气瓶使用与存放 | 1. 是否设置专用气瓶储存间，通风良好；<br>2. 实瓶与空瓶是否分开存放；<br>3. 是否远离热源、明火；<br>4. 是否有防倾倒措施；<br>5. 是否超期未检或标识不清。 | 高 | 《气瓶安全技术规程》TSG23-2021 |
| 危险作业管理 | 临时用电作业 | 1. 是否办理临时用电审批手续；<br>2. 电气线路是否架空或穿管保护；<br>3. 使用设备是否具备漏电保护；<br>4. 是否由持证电工操作；<br>5. 是否配备灭火器材。 | 高 | 《施工现场临时用电安全技术规范》JGJ46 |
|  | 高处作业 | 1. 是否办理高处作业审批；<br>2. 作业人员是否佩戴安全带、安全帽；<br>3. 是否设置生命线或防护栏杆；<br>4. 是否有专人监护；<br>5. 风力六级以上是否停止作业。 | 高 | 《高处作业分级》GB/T3608；《安全生产法》第四十三条 |
| 电气安全 | 电气线路与设备 | 1. 配电箱是否张贴警示标志；<br>2. 是否存在私拉乱接现象；<br>3. 开关、插座是否破损；<br>4. 是否存在过载发热现象。 | 中高 | 《低压配电设计规范》GB50054 |
| 场所功能区管理 | 室外停车场 | 1. 是否划设停车位，通道畅通；<br>2. 是否存在电动车违规充电；<br>3. 是否配置灭火器（推荐ABC干粉型）；<br>4. 是否设置禁停禁放易燃物区域。 | 中 | 参照《汽车库、修车库、停车场设计防火规范》GB50067 |
| 应急管理 | 应急预案与演练 | 1. 是否制定灭火和应急疏散预案；<br>2. 是否每半年至少组织一次消防演练；<br>3. 是否有演练记录及评估报告。 | 高 | 《消防法》第十六条；61号令第三十九条 |
|  | 微型消防站建设 | 1. 是否建立微型消防站；<br>2. 人员是否到位、装备是否齐全；<br>3. 是否能实现“三知四会一联通”。 | 中 | 《关于加强城市消防站建设的意见》应急消〔2018〕115号 |
| 其他 | 视频检查补充要点 | 如通过远程视频方式检查：<br>1. 要求企业依次拍摄各楼层公共区域、机房、配电间、消防控制室、疏散通道、安全出口；<br>2. 实时展示消防主机运行界面；<br>3. 展示最近一次防火巡查记录；<br>4. 拍摄气瓶存放点现状。 | —— | 远程检查有效性依赖企业配合程度 |

---

### **专家备注与质疑说明：**
1. **消防类型标注为“无”存疑**：该企业属高度＞54米的住宅建筑，按照《消防法》和GB50016规定，**必须按一类高层住宅进行消防设计与管理**，建议主管机关重新核定其“消防类型”，极可能存在信息填报错误。
2. **未申报其他可能存在的设备或作业**：如是否存在柴油发电机房、锅炉房、配电房等关键设施？建议进一步排查。
3. **AI推荐启用标记为“是”**：可结合图像识别技术对视频检查中的消防设施状态进行辅助判断，提升效率。

建议下一步对企业提交资料进行核对，并安排一次全面的现场或视频联动检查，重点关注**高层建筑消防系统完整性**与**危险作业过程管控**。
`;

/**
 * TipTap 富文本编辑与高亮演示主组件
 */
const Tiptap: React.FC = () => {
  const [manualText, setManualText] = useState("");
  const [label, setLabel] = useState("");
  const bridgeRef = useRef<HTMLElement | null>(null);
  const defaultSeededRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "开始输入内容，或粘贴一段文本..." }),
      HighlightMark,
      MyBlock,
      Markdown.configure({
        markedOptions: {
          breaks: true,
        },
      }),
    ],
    contentType: 'markdown', 
    content: defaultArticle,
  });
  const {
    highlights,
    createHighlight,
    handleHighlightSelection,
    handleJumpToHighlight,
    handleRemoveHighlight,
    handleClearHighlights,
  } = useTiptapHighlight(editor as any);

  // 模拟：从“后端”加载富文本 HTML
  const loadHtmlFromBackend = () => {
    if (!isEditorReady(editor)) return;
    (editor as any).commands.setContent(backendHtmlContent, {
      parseOptions: { preserveWhitespace: "full" },
    });
  };

  // 模拟：从“后端”加载 Markdown
  const loadMarkdownFromBackend = () => {
    if (!isEditorReady(editor)) return;
    (editor as any).commands.setContent(backendMarkdownContent, {
      parseOptions: { preserveWhitespace: "full" },
    });
  };

  // 根据当前选区，找到其中所有带 highlight id 的 mark，对应删除高亮记录
  const handleClearSelectionHighlight = () => {
    if (!isEditorReady(editor)) return;
    const highlightType = (editor as any).schema.marks.highlight;
    if (!highlightType) return;
    const { from, to } = (editor as any).state.selection;
    if (from === to) return;

    const ids = new Set<string>();
    (editor as any).state.doc.nodesBetween(from, to, (node: any) => {
      if (!node.isText || !node.marks?.length) return;
      node.marks.forEach((mark: any) => {
        if (mark.type === highlightType && mark.attrs?.id) {
          ids.add(mark.attrs.id as string);
        }
      });
    });

    ids.forEach((id) => handleRemoveHighlight(id));

    // 取消高亮后将选区收起到末尾，避免整行一直处于选中态
    (editor as any).chain().focus().setTextSelection({ from: to, to }).run();
  };

  // 选中文本时显示的气泡高亮菜单
  const highlightBubbleMenu = useHighlightBubbleMenu({
    editor: editor as any,
    onHighlightSelection: handleHighlightSelection,
    onClearSelectionHighlight: handleClearSelectionHighlight,
  });

  useEffect(() => {
    registerHighlightBridge();
  }, []);

  // 初始化默认高亮关键字（演示用），依赖核心 createHighlight 能力
  useEffect(() => {
    if (!isEditorReady(editor) || defaultSeededRef.current) return;
    const keywords = ["高亮", "组件", "React", "Vue", "联动", "定位"];
    const matches = keywords
      .map((keyword) => {
        const range = findRangeByText(editor.state.doc, keyword);
        if (!range) return null;
        return { keyword, range };
      })
      .filter((item) => item !== null) as {
        keyword: string;
        range: { from: number; to: number };
      }[];
    console.log('matches', matches);
    if (!matches.length) {
      defaultSeededRef.current = true;
      return;
    }
    const randomTwo = matches
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, matches.length));
    console.log('randomTwo', randomTwo);
    randomTwo.forEach((item, index) => {
      createHighlight(item.range, item.keyword, {
        label: `默认标注 ${index + 1}`,
      });
    });
    defaultSeededRef.current = true;
  }, [editor, createHighlight]);

  // 将高亮数据同步到 window 与 WebComponent（业务集成逻辑）
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__TIPTAP_HIGHLIGHTS__ = highlights;
      window.dispatchEvent(
        new CustomEvent("tiptap-highlight-change", { detail: { highlights } })
      );
    }
    if (bridgeRef.current) {
      (bridgeRef.current as any).highlights = highlights;
    }
  }, [highlights]);

  // 通过输入的关键字在文档中检索并高亮首次匹配（业务层逻辑）
  const handleHighlightByText = () => {
    if (!isEditorReady(editor)) return;
    const keyword = manualText.trim();
    if (!keyword) return;
    const range = findRangeByText(editor.state.doc, keyword);
    if (!range) return;
    createHighlight(range, keyword, { label });
    setManualText("");
  };

  return (
    <div className="tiptap-demo">
      <section className="tiptap-demo__editor-card">
        <header className="tiptap-demo__toolbar">
          <div className="tiptap-demo__toolbar-main">
            <h3>富文本编辑区</h3>
            <p>所见即所得，可在 PC / Mobile 自适应布局下使用。</p>
          </div>
          <Space wrap>
            <Button onClick={loadMarkdownFromBackend}>
              加载 Markdown（含 my-block）
            </Button>
            <Button onClick={loadHtmlFromBackend}>
              加载 HTML 富文本（含 my-block）
            </Button>
            <Button
              type="primary"
              onClick={handleHighlightSelection}
            >
              高亮选中文本
            </Button>
            <Button onClick={handleHighlightByText}>
              高亮指定文本
            </Button>
            <Button danger ghost onClick={handleClearHighlights}>
              清空全部高亮
            </Button>
          </Space>
        </header>

        <div className="tiptap-demo__editor">
          {highlightBubbleMenu}
          <EditorContent editor={editor} />
        </div>

        <div className="tiptap-demo__form">
          {/* <Input
            placeholder="标注标签（可选）"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            maxLength={20}
          /> */}
          <TextArea
            rows={3}
            placeholder="输入要自动定位并高亮的关键字，例如：高亮 / 组件"
            value={manualText}
            onChange={(event) => setManualText(event.target.value)}
          />
          <p className="tiptap-demo__form-tip">
            * 支持多次高亮，系统会自动轮换颜色；也可以通过右侧列表定位/删除。
          </p>
        </div>
      </section>

      <aside className="tiptap-demo__sidebar">
        <div className="tiptap-demo__panel">
          <div className="tiptap-demo__panel-header">
            <h4>高亮列表</h4>
            <span className="tiptap-demo__panel-sub">点击“定位”快速滚动</span>
          </div>
          <div className="tiptap-demo__highlight-list">
            {highlights.length ? (
              highlights.map((item) => (
                <div
                  key={item.id}
                  className="tiptap-demo__highlight-item"
                  style={{ borderLeftColor: item.color }}
                >
                  <div className="tiptap-demo__highlight-meta">
                    <Tag color={item.color}>{item.label}</Tag>
                    <span className="tiptap-demo__highlight-text">{item.text}</span>
                  </div>
                  <Space size="small">
                    <Button type="link" size="small" onClick={() => handleJumpToHighlight(item)}>
                      定位
                    </Button>
                    <Button
                      type="link"
                      size="small"
                      danger
                      onClick={() => handleRemoveHighlight(item.id)}
                    >
                      删除
                    </Button>
                  </Space>
                </div>
              ))
            ) : (
              <p className="tiptap-demo__empty">暂无数据，先在左侧创建一条高亮。</p>
            )}
          </div>
        </div>

        <div className="tiptap-demo__panel">
          <div className="tiptap-demo__panel-header">
            <h4>跨框架组件联动</h4>
            <span className="tiptap-demo__panel-sub">React & Vue 同步消费</span>
          </div>
          <ReactHighlightWidget highlights={highlights} />
          <div className="tiptap-demo__web-component">
            <highlight-bridge ref={bridgeRef as any}></highlight-bridge>
            <small>
              Vue 侧只需引入 Web Component：<code>&lt;highlight-bridge /&gt;</code>
            </small>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Tiptap;