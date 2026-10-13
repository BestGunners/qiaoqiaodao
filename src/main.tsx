/// <reference types="vite/client" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/baloo-2/latin-400.css'
import '@fontsource/baloo-2/latin-700.css'
import '@fontsource/baloo-2/latin-800.css'
import '@fontsource-variable/noto-sans-sc/index.css'
import App from '@/App'
import { applyDisplayPreferences } from '@/hooks/useDisplayPreferences'
import { useSettingsStore } from '@/store/settingsStore'
import '@/index.css'

// 渲染前先把「字体样式 / 字体大小」应用到 <html>，避免打开页面时闪一下默认字号
const initialSettings = useSettingsStore.getState()
applyDisplayPreferences(initialSettings.fontStyle, initialSettings.fontScale)

const container = document.getElementById('root')

if (!container) {
  throw new Error('找不到 #root 挂载节点')
}

// 部署到子路径（比如 GitHub Pages 的 /qiaoqiaodao/）时，
// 路由也要带上同样的前缀，否则直接访问 /map 这类地址会被弹回首页。
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
