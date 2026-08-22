import type { MagicEmbedWidgetConfig, WidgetDefinition } from "../models";
import type { WidgetRegistry } from "./WidgetRegistry";

export function registerEmbedWidgets(registry: WidgetRegistry): void {
  const definition: WidgetDefinition<MagicEmbedWidgetConfig> = {
    type: "magic-embed",
    name: "网页嵌入",
    description: "按需加载经过安全隔离的 HTTPS 或本地网页。",
    icon: "◇",
    defaultSize: { w: 8, h: 7 },
    minSize: { w: 5, h: 5 },
    settings: [
      {
        key: "url",
        type: "text",
        label: "嵌入 URL",
        description: "远程页面必须使用 HTTPS；本地开发可使用 localhost / 127.0.0.1 的 HTTP。",
        placeholder: "https://example.com",
      },
      {
        key: "allowForms",
        type: "toggle",
        label: "允许表单提交",
        description: "默认关闭。开启后只允许嵌入页面提交表单，仍不会获得同源访问权限。",
      },
    ],
    defaultConfig: (): MagicEmbedWidgetConfig => ({ url: "", allowForms: false }),
  };
  registry.register(definition);
}
