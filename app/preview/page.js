"use client";

import { useEffect, useState } from "react";
import HomePage from "../page";

export default function PreviewPage() {
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    // 添加自定义滚动条样式
    const style = document.createElement('style');
    style.textContent = `
      * {
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) #0a0a0a !important;
      }

      html::-webkit-scrollbar,
      body::-webkit-scrollbar,
      *::-webkit-scrollbar {
        width: 10px !important;
        background: #0a0a0a !important;
      }

      html::-webkit-scrollbar-track,
      body::-webkit-scrollbar-track,
      *::-webkit-scrollbar-track {
        background: #0a0a0a !important;
      }

      html::-webkit-scrollbar-thumb,
      body::-webkit-scrollbar-thumb,
      *::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2) !important;
        border-radius: 5px !important;
      }

      html::-webkit-scrollbar-thumb:hover,
      body::-webkit-scrollbar-thumb:hover,
      *::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3) !important;
      }

      body {
        background: #0a0a0a;
      }
    `;
    document.head.appendChild(style);

    // 监听来自后台管理页面的消息
    function handleMessage(event) {
      console.log("Preview received message:", event.data);
      if (event.data.type === "PREVIEW_UPDATE") {
        console.log("Updating preview with:", event.data.data);
        setPreviewData(event.data.data);
      }
    }

    window.addEventListener("message", handleMessage);

    // 通知父窗口预览页面已准备好
    console.log("Preview page ready");
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    // 设置 body 背景
    document.body.style.background = '#0a0a0a';

    return () => {
      window.removeEventListener("message", handleMessage);
      if (style && style.parentNode) {
        document.head.removeChild(style);
      }
    };
  }, []);

  console.log("Current preview data:", previewData);

  // 如果有预览数据，使用预览数据；否则使用真实数据
  return <HomePage previewData={previewData} />;
}
