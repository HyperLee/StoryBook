#!/usr/bin/env python3
"""
生成可愛風格的水族館動物 SVG 圖片
適用於童話故事書
"""

import os

# 輸出目錄
OUTPUT_DIR = "/Users/qiuzili/StoryBook/StoryBook/wwwroot/images/aquarium"

# 15 隻水族館動物的 SVG 設計（可愛童話風格）
ANIMALS = {
    "clownfish": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg)"/>
  
  <!-- 氣泡 -->
  <circle cx="50" cy="50" r="8" fill="#fff" opacity="0.4"/>
  <circle cx="350" cy="100" r="12" fill="#fff" opacity="0.3"/>
  <circle cx="100" cy="250" r="6" fill="#fff" opacity="0.5"/>
  
  <!-- 海葵 -->
  <ellipse cx="200" cy="280" rx="60" ry="20" fill="#9370DB" opacity="0.6"/>
  <path d="M160,280 Q160,200 170,180" stroke="#DA70D6" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M180,280 Q180,200 185,175" stroke="#DA70D6" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M200,280 Q200,190 200,170" stroke="#DA70D6" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M220,280 Q220,200 215,175" stroke="#DA70D6" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M240,280 Q240,200 230,180" stroke="#DA70D6" stroke-width="8" fill="none" stroke-linecap="round"/>
  
  <!-- 小丑魚身體 -->
  <ellipse cx="200" cy="150" rx="50" ry="35" fill="#FF6B35"/>
  
  <!-- 白色條紋 -->
  <ellipse cx="170" cy="150" rx="12" ry="35" fill="#fff"/>
  <ellipse cx="210" cy="150" rx="12" ry="35" fill="#fff"/>
  
  <!-- 尾巴 -->
  <path d="M250,150 Q280,130 285,140 Q280,150 285,160 Q280,170 250,150" fill="#FF6B35"/>
  
  <!-- 背鰭 -->
  <path d="M200,115 Q210,100 215,115" fill="#FF4500"/>
  
  <!-- 眼睛 -->
  <circle cx="185" cy="145" r="8" fill="#fff"/>
  <circle cx="185" cy="145" r="5" fill="#000"/>
  <circle cx="187" cy="143" r="2" fill="#fff"/>
  
  <!-- 嘴巴（微笑）-->
  <path d="M165,155 Q170,160 175,155" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
  
  <!-- 胸鰭 -->
  <ellipse cx="175" cy="165" rx="15" ry="8" fill="#FF8C66" opacity="0.8"/>
</svg>"""
    },
    
    "dolphin": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg2)"/>
  
  <!-- 氣泡 -->
  <circle cx="60" cy="80" r="10" fill="#fff" opacity="0.4"/>
  <circle cx="340" cy="120" r="8" fill="#fff" opacity="0.3"/>
  <circle cx="150" cy="50" r="12" fill="#fff" opacity="0.5"/>
  
  <!-- 海豚身體 -->
  <ellipse cx="200" cy="150" rx="70" ry="40" fill="#708090"/>
  
  <!-- 海豚頭部 -->
  <ellipse cx="140" cy="145" rx="40" ry="35" fill="#778899"/>
  
  <!-- 嘴喙 -->
  <ellipse cx="105" cy="148" rx="20" ry="12" fill="#778899"/>
  
  <!-- 背鰭 -->
  <path d="M200,110 Q210,80 215,110" fill="#556B7D"/>
  
  <!-- 尾鰭 -->
  <path d="M270,145 Q300,130 310,145 Q300,160 270,155 Z" fill="#556B7D"/>
  
  <!-- 胸鰭 -->
  <ellipse cx="160" cy="170" rx="25" ry="12" fill="#556B7D" transform="rotate(-20 160 170)"/>
  
  <!-- 眼睛 -->
  <circle cx="125" cy="140" r="6" fill="#fff"/>
  <circle cx="125" cy="140" r="4" fill="#000"/>
  <circle cx="126" cy="139" r="2" fill="#fff"/>
  
  <!-- 嘴巴（微笑）-->
  <path d="M90,150 Q95,158 100,155" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
  
  <!-- 肚子 -->
  <ellipse cx="180" cy="165" rx="45" ry="25" fill="#D3D3D3" opacity="0.6"/>
</svg>"""
    },
    
    "sea-turtle": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg3)"/>
  
  <!-- 氣泡 -->
  <circle cx="70" cy="60" r="10" fill="#fff" opacity="0.4"/>
  <circle cx="330" cy="90" r="12" fill="#fff" opacity="0.3"/>
  
  <!-- 海龜殼（背甲）-->
  <ellipse cx="200" cy="160" rx="80" ry="60" fill="#6B8E23"/>
  
  <!-- 龜殼花紋 -->
  <circle cx="170" cy="140" r="15" fill="#556B2F"/>
  <circle cx="210" cy="135" r="18" fill="#556B2F"/>
  <circle cx="230" cy="160" r="16" fill="#556B2F"/>
  <circle cx="200" cy="180" r="17" fill="#556B2F"/>
  <circle cx="165" cy="175" r="14" fill="#556B2F"/>
  
  <!-- 龜殼邊緣 -->
  <ellipse cx="200" cy="160" rx="80" ry="60" fill="none" stroke="#8FBC8F" stroke-width="4"/>
  
  <!-- 頭部 -->
  <ellipse cx="110" cy="150" rx="25" ry="20" fill="#9ACD32"/>
  
  <!-- 眼睛 -->
  <circle cx="105" cy="145" r="5" fill="#fff"/>
  <circle cx="105" cy="145" r="3" fill="#000"/>
  
  <!-- 嘴巴（微笑）-->
  <path d="M95,155 Q100,160 105,155" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
  
  <!-- 前鰭 -->
  <ellipse cx="140" cy="180" rx="35" ry="15" fill="#8FBC8F" transform="rotate(-30 140 180)"/>
  <ellipse cx="140" cy="130" rx="35" ry="15" fill="#8FBC8F" transform="rotate(30 140 130)"/>
  
  <!-- 後鰭 -->
  <ellipse cx="260" cy="180" rx="30" ry="12" fill="#8FBC8F" transform="rotate(30 260 180)"/>
  <ellipse cx="260" cy="140" rx="30" ry="12" fill="#8FBC8F" transform="rotate(-30 260 140)"/>
  
  <!-- 尾巴 -->
  <path d="M280,160 L300,155 L300,165 Z" fill="#8FBC8F"/>
</svg>"""
    },
    
    "jellyfish": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg4" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#191970;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000080;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="jellyGlow">
      <stop offset="0%" style="stop-color:#FFB6C1;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:0.3" />
    </radialGradient>
  </defs>
  
  <!-- 深海背景 -->
  <rect width="400" height="300" fill="url(#oceanBg4)"/>
  
  <!-- 發光水母頭部 -->
  <ellipse cx="200" cy="120" rx="60" ry="50" fill="url(#jellyGlow)"/>
  
  <!-- 水母圓頂 -->
  <path d="M140,120 Q200,60 260,120" fill="#FFB6C1" opacity="0.6"/>
  
  <!-- 水母內部花紋 -->
  <ellipse cx="200" cy="110" rx="30" ry="25" fill="#FF1493" opacity="0.4"/>
  <circle cx="200" cy="100" r="10" fill="#FF1493" opacity="0.6"/>
  
  <!-- 觸手 -->
  <path d="M170,160 Q165,200 170,240" stroke="#FFB6C1" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>
  <path d="M185,165 Q180,210 185,260" stroke="#FFB6C1" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>
  <path d="M200,170 Q200,220 195,270" stroke="#FFB6C1" stroke-width="5" fill="none" opacity="0.7" stroke-linecap="round"/>
  <path d="M215,165 Q220,210 215,260" stroke="#FFB6C1" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>
  <path d="M230,160 Q235,200 230,240" stroke="#FFB6C1" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>
  
  <!-- 發光點 -->
  <circle cx="180" cy="100" r="4" fill="#fff" opacity="0.9"/>
  <circle cx="220" cy="105" r="3" fill="#fff" opacity="0.9"/>
  <circle cx="200" cy="130" r="5" fill="#fff" opacity="0.8"/>
  
  <!-- 氣泡 -->
  <circle cx="100" cy="100" r="8" fill="#fff" opacity="0.2"/>
  <circle cx="300" cy="150" r="10" fill="#fff" opacity="0.2"/>
</svg>"""
    },
    
    "seahorse": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg5" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg5)"/>
  
  <!-- 海草 -->
  <path d="M80,280 Q90,200 85,150 Q80,100 90,50" stroke="#2E8B57" stroke-width="6" fill="none"/>
  <path d="M320,280 Q310,220 315,170 Q320,120 310,70" stroke="#3CB371" stroke-width="6" fill="none"/>
  
  <!-- 氣泡 -->
  <circle cx="120" cy="80" r="8" fill="#fff" opacity="0.4"/>
  <circle cx="280" cy="120" r="10" fill="#fff" opacity="0.3"/>
  
  <!-- 海馬身體 -->
  <path d="M200,80 Q205,90 205,110 Q205,150 200,180 Q195,210 200,240" 
        stroke="#FFD700" stroke-width="25" fill="none" stroke-linecap="round"/>
  
  <!-- 海馬頭部 -->
  <circle cx="200" cy="75" r="18" fill="#FFD700"/>
  
  <!-- 海馬嘴部 -->
  <ellipse cx="188" cy="75" rx="8" ry="5" fill="#FFA500"/>
  
  <!-- 海馬眼睛 -->
  <circle cx="205" cy="72" r="5" fill="#fff"/>
  <circle cx="205" cy="72" r="3" fill="#000"/>
  
  <!-- 海馬冠 -->
  <path d="M200,57 Q205,50 208,57" fill="#FFA500"/>
  <path d="M205,60 Q210,53 213,60" fill="#FFA500"/>
  
  <!-- 背鰭 -->
  <path d="M205,100 Q220,105 205,110 Q220,115 205,120 Q220,125 205,130" 
        stroke="#FFA500" stroke-width="3" fill="none"/>
  
  <!-- 尾巴（捲曲）-->
  <path d="M200,240 Q210,250 215,260 Q218,270 210,275" 
        stroke="#FFD700" stroke-width="20" fill="none" stroke-linecap="round"/>
  
  <!-- 腹部花紋 -->
  <circle cx="200" cy="120" r="4" fill="#FFA500"/>
  <circle cx="198" cy="150" r="4" fill="#FFA500"/>
  <circle cx="200" cy="180" r="4" fill="#FFA500"/>
  <circle cx="198" cy="210" r="4" fill="#FFA500"/>
</svg>"""
    },
    
    "octopus": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg6" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg6)"/>
  
  <!-- 氣泡 -->
  <circle cx="80" cy="70" r="10" fill="#fff" opacity="0.4"/>
  <circle cx="320" cy="100" r="12" fill="#fff" opacity="0.3"/>
  
  <!-- 章魚頭部 -->
  <ellipse cx="200" cy="110" rx="55" ry="50" fill="#FF6347"/>
  
  <!-- 章魚眼睛 -->
  <ellipse cx="180" cy="100" rx="12" ry="15" fill="#fff"/>
  <ellipse cx="220" cy="100" rx="12" ry="15" fill="#fff"/>
  <circle cx="180" cy="102" r="7" fill="#000"/>
  <circle cx="220" cy="102" r="7" fill="#000"/>
  <circle cx="182" cy="100" r="3" fill="#fff"/>
  <circle cx="222" cy="100" r="3" fill="#fff"/>
  
  <!-- 章魚嘴巴（微笑）-->
  <path d="M190,120 Q200,128 210,120" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
  
  <!-- 8 隻腕足 -->
  <!-- 左側 4 隻 -->
  <path d="M160,140 Q140,180 130,220 Q125,240 135,250" 
        stroke="#FF6347" stroke-width="18" fill="none" stroke-linecap="round"/>
  <path d="M170,145 Q150,190 145,230 Q143,250 150,260" 
        stroke="#FF6347" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M180,150 Q165,200 165,240 Q165,260 170,270" 
        stroke="#FF6347" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M190,152 Q185,205 188,245 Q190,265 195,275" 
        stroke="#FF6347" stroke-width="15" fill="none" stroke-linecap="round"/>
  
  <!-- 右側 4 隻 -->
  <path d="M210,152 Q215,205 212,245 Q210,265 205,275" 
        stroke="#FF6347" stroke-width="15" fill="none" stroke-linecap="round"/>
  <path d="M220,150 Q235,200 235,240 Q235,260 230,270" 
        stroke="#FF6347" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M230,145 Q250,190 255,230 Q257,250 250,260" 
        stroke="#FF6347" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M240,140 Q260,180 270,220 Q275,240 265,250" 
        stroke="#FF6347" stroke-width="18" fill="none" stroke-linecap="round"/>
  
  <!-- 吸盤（部分腕足上）-->
  <circle cx="140" cy="200" r="4" fill="#FF4500" opacity="0.6"/>
  <circle cx="135" cy="220" r="4" fill="#FF4500" opacity="0.6"/>
  <circle cx="260" cy="200" r="4" fill="#FF4500" opacity="0.6"/>
  <circle cx="265" cy="220" r="4" fill="#FF4500" opacity="0.6"/>
</svg>"""
    },
    
    "penguin": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="iceBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#B0E0E6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#87CEEB;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 冰雪背景 -->
  <rect width="400" height="300" fill="url(#iceBg)"/>
  
  <!-- 冰山 -->
  <polygon points="50,250 120,180 190,250" fill="#F0F8FF" opacity="0.8"/>
  <polygon points="280,250 330,200 380,250" fill="#F0F8FF" opacity="0.8"/>
  
  <!-- 雪花 -->
  <text x="80" y="80" font-size="25" fill="#fff" opacity="0.6">❄</text>
  <text x="300" y="120" font-size="20" fill="#fff" opacity="0.6">❄</text>
  <text x="150" y="50" font-size="22" fill="#fff" opacity="0.6">❄</text>
  
  <!-- 企鵝身體 -->
  <ellipse cx="200" cy="180" rx="50" ry="70" fill="#000"/>
  
  <!-- 企鵝肚子 -->
  <ellipse cx="200" cy="190" rx="35" ry="55" fill="#fff"/>
  
  <!-- 企鵝頭部 -->
  <ellipse cx="200" cy="110" rx="40" ry="45" fill="#000"/>
  
  <!-- 臉部 -->
  <ellipse cx="200" cy="120" rx="28" ry="32" fill="#fff"/>
  
  <!-- 眼睛 -->
  <circle cx="188" cy="110" r="6" fill="#000"/>
  <circle cx="212" cy="110" r="6" fill="#000"/>
  <circle cx="189" cy="109" r="2" fill="#fff"/>
  <circle cx="213" cy="109" r="2" fill="#fff"/>
  
  <!-- 嘴巴 -->
  <ellipse cx="200" cy="128" rx="8" ry="6" fill="#FFA500"/>
  
  <!-- 腮紅 -->
  <ellipse cx="175" cy="125" rx="8" ry="5" fill="#FFB6C1" opacity="0.5"/>
  <ellipse cx="225" cy="125" rx="8" ry="5" fill="#FFB6C1" opacity="0.5"/>
  
  <!-- 翅膀（鰭狀肢）-->
  <ellipse cx="150" cy="160" rx="15" ry="50" fill="#000" transform="rotate(-20 150 160)"/>
  <ellipse cx="250" cy="160" rx="15" ry="50" fill="#000" transform="rotate(20 250 160)"/>
  
  <!-- 腳 -->
  <ellipse cx="180" cy="250" rx="18" ry="10" fill="#FFA500"/>
  <ellipse cx="220" cy="250" rx="18" ry="10" fill="#FFA500"/>
</svg>"""
    },
    
    "shark": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg7" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg7)"/>
  
  <!-- 氣泡 -->
  <circle cx="70" cy="70" r="10" fill="#fff" opacity="0.4"/>
  <circle cx="330" cy="110" r="12" fill="#fff" opacity="0.3"/>
  <circle cx="150" cy="250" r="8" fill="#fff" opacity="0.5"/>
  
  <!-- 鯊魚身體 -->
  <ellipse cx="220" cy="150" rx="90" ry="45" fill="#708090"/>
  
  <!-- 鯊魚頭部 -->
  <path d="M130,150 Q100,145 90,150 Q100,155 130,150" fill="#778899"/>
  
  <!-- 背鰭 -->
  <path d="M220,105 Q235,70 240,105" fill="#556B7D"/>
  
  <!-- 尾鰭 -->
  <path d="M310,145 Q350,120 360,140 Q350,145 340,150 Q350,160 310,155 Z" fill="#556B7D"/>
  
  <!-- 胸鰭 -->
  <ellipse cx="170" cy="175" rx="30" ry="15" fill="#556B7D" transform="rotate(-15 170 175)"/>
  
  <!-- 腹鰭 -->
  <path d="M240,180 Q245,200 250,180" fill="#556B7D"/>
  
  <!-- 眼睛（友善的）-->
  <circle cx="120" cy="140" r="8" fill="#fff"/>
  <circle cx="120" cy="140" r="5" fill="#000"/>
  <circle cx="122" cy="138" r="2" fill="#fff"/>
  
  <!-- 嘴巴（微笑但有牙齒）-->
  <path d="M85,153 Q100,162 115,153" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
  <line x1="92" y1="157" x2="92" y2="162" stroke="#fff" stroke-width="2"/>
  <line x1="100" y1="159" x2="100" y2="164" stroke="#fff" stroke-width="2"/>
  <line x1="108" y1="157" x2="108" y2="162" stroke="#fff" stroke-width="2"/>
  
  <!-- 肚子 -->
  <ellipse cx="200" cy="165" rx="60" ry="30" fill="#D3D3D3" opacity="0.5"/>
  
  <!-- 鰓 -->
  <path d="M150,145 Q148,150 150,155" stroke="#556B7D" stroke-width="2" fill="none"/>
  <path d="M160,145 Q158,150 160,155" stroke="#556B7D" stroke-width="2" fill="none"/>
  <path d="M170,145 Q168,150 170,155" stroke="#556B7D" stroke-width="2" fill="none"/>
</svg>"""
    },
    
    "manta-ray": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg8" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg8)"/>
  
  <!-- 氣泡 -->
  <circle cx="80" cy="80" r="10" fill="#fff" opacity="0.4"/>
  <circle cx="320" cy="120" r="12" fill="#fff" opacity="0.3"/>
  
  <!-- 鬼蝠魟身體（翼展）-->
  <path d="M200,150 Q150,120 80,140 Q60,145 70,155 Q90,165 130,170 Q160,172 200,175 Z" 
        fill="#2F4F4F"/>
  <path d="M200,150 Q250,120 320,140 Q340,145 330,155 Q310,165 270,170 Q240,172 200,175 Z" 
        fill="#2F4F4F"/>
  
  <!-- 身體中央 -->
  <ellipse cx="200" cy="160" rx="40" ry="30" fill="#36454F"/>
  
  <!-- 頭部角（cephalic fins）-->
  <ellipse cx="175" cy="145" rx="10" ry="20" fill="#2F4F4F" transform="rotate(-30 175 145)"/>
  <ellipse cx="225" cy="145" rx="10" ry="20" fill="#2F4F4F" transform="rotate(30 225 145)"/>
  
  <!-- 眼睛 -->
  <circle cx="185" cy="150" r="6" fill="#fff"/>
  <circle cx="215" cy="150" r="6" fill="#fff"/>
  <circle cx="185" cy="150" r="4" fill="#000"/>
  <circle cx="215" cy="150" r="4" fill="#000"/>
  
  <!-- 嘴巴（微笑）-->
  <ellipse cx="200" cy="165" rx="15" ry="8" fill="#000" opacity="0.7"/>
  
  <!-- 尾巴 -->
  <path d="M200,185 Q200,220 195,260" stroke="#2F4F4F" stroke-width="8" fill="none" stroke-linecap="round"/>
  
  <!-- 肚子花紋 -->
  <ellipse cx="200" cy="165" rx="25" ry="18" fill="#D3D3D3" opacity="0.3"/>
  
  <!-- 斑點 -->
  <circle cx="180" cy="155" r="3" fill="#fff" opacity="0.6"/>
  <circle cx="220" cy="160" r="3" fill="#fff" opacity="0.6"/>
  <circle cx="200" cy="170" r="3" fill="#fff" opacity="0.6"/>
</svg>"""
    },
    
    "angelfish": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg9" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg9)"/>
  
  <!-- 珊瑚 -->
  <circle cx="80" cy="260" r="25" fill="#FF6B9D" opacity="0.4"/>
  <circle cx="100" cy="240" r="20" fill="#FF6B9D" opacity="0.4"/>
  <circle cx="320" cy="270" r="30" fill="#9370DB" opacity="0.4"/>
  
  <!-- 氣泡 -->
  <circle cx="120" cy="80" r="8" fill="#fff" opacity="0.4"/>
  <circle cx="280" cy="100" r="10" fill="#fff" opacity="0.3"/>
  
  <!-- 神仙魚身體 -->
  <ellipse cx="200" cy="150" rx="35" ry="50" fill="#FFD700"/>
  
  <!-- 背鰭（高大）-->
  <path d="M185,100 Q190,60 200,55 Q210,60 215,100" fill="#FFA500"/>
  
  <!-- 臀鰭（對稱）-->
  <path d="M185,200 Q190,240 200,245 Q210,240 215,200" fill="#FFA500"/>
  
  <!-- 條紋 -->
  <ellipse cx="190" cy="150" rx="4" ry="45" fill="#FF8C00"/>
  <ellipse cx="200" cy="150" rx="4" ry="48" fill="#FF8C00"/>
  <ellipse cx="210" cy="150" rx="4" ry="45" fill="#FF8C00"/>
  
  <!-- 頭部 -->
  <ellipse cx="170" cy="150" rx="20" ry="30" fill="#FFD700"/>
  
  <!-- 嘴部 -->
  <ellipse cx="155" cy="150" rx="8" ry="10" fill="#FFA500"/>
  
  <!-- 眼睛 -->
  <circle cx="165" cy="145" r="6" fill="#fff"/>
  <circle cx="165" cy="145" r="4" fill="#000"/>
  <circle cx="166" cy="144" r="2" fill="#fff"/>
  
  <!-- 尾鰭 -->
  <path d="M235,140 Q270,130 280,145 Q270,160 235,160 Z" fill="#FFA500"/>
  <line x1="240" y1="145" x2="265" y2="140" stroke="#FF8C00" stroke-width="2"/>
  <line x1="240" y1="150" x2="270" y2="150" stroke="#FF8C00" stroke-width="2"/>
  <line x1="240" y1="155" x2="265" y2="160" stroke="#FF8C00" stroke-width="2"/>
  
  <!-- 胸鰭 -->
  <ellipse cx="175" cy="165" rx="18" ry="10" fill="#FFE4B5" opacity="0.7" transform="rotate(-30 175 165)"/>
</svg>"""
    },
    
    "sea-otter": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg10" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg10)"/>
  
  <!-- 水波紋 -->
  <path d="M50,180 Q100,170 150,180 Q200,190 250,180 Q300,170 350,180" 
        stroke="#fff" stroke-width="2" fill="none" opacity="0.3"/>
  
  <!-- 海獺身體（仰躺）-->
  <ellipse cx="200" cy="160" rx="50" ry="35" fill="#8B4513"/>
  
  <!-- 肚子 -->
  <ellipse cx="200" cy="165" rx="38" ry="25" fill="#D2B48C"/>
  
  <!-- 頭部 -->
  <circle cx="200" cy="110" r="30" fill="#8B4513"/>
  
  <!-- 臉部 -->
  <ellipse cx="200" cy="115" rx="22" ry="25" fill="#D2B48C"/>
  
  <!-- 耳朵 -->
  <ellipse cx="180" cy="95" rx="8" ry="12" fill="#8B4513"/>
  <ellipse cx="220" cy="95" rx="8" ry="12" fill="#8B4513"/>
  <ellipse cx="180" cy="97" rx="5" ry="8" fill="#A0522D"/>
  <ellipse cx="220" cy="97" rx="5" ry="8" fill="#A0522D"/>
  
  <!-- 眼睛（閉著，幸福的樣子）-->
  <path d="M190,110 Q195,112 200,110" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M200,110 Q205,112 210,110" stroke="#000" stroke-width="3" fill="none" stroke-linecap="round"/>
  
  <!-- 鼻子 -->
  <circle cx="200" cy="120" r="4" fill="#000"/>
  
  <!-- 鬍鬚 -->
  <line x1="175" y1="120" x2="155" y2="118" stroke="#000" stroke-width="1"/>
  <line x1="175" y1="125" x2="155" y2="128" stroke="#000" stroke-width="1"/>
  <line x1="225" y1="120" x2="245" y2="118" stroke="#000" stroke-width="1"/>
  <line x1="225" y1="125" x2="245" y2="128" stroke="#000" stroke-width="1"/>
  
  <!-- 手臂（抱著貝殼）-->
  <ellipse cx="165" cy="155" rx="12" ry="25" fill="#8B4513" transform="rotate(-20 165 155)"/>
  <ellipse cx="235" cy="155" rx="12" ry="25" fill="#8B4513" transform="rotate(20 235 155)"/>
  
  <!-- 貝殼 -->
  <ellipse cx="200" cy="150" rx="20" ry="15" fill="#FFE4B5"/>
  <path d="M185,150 L200,140 L215,150" stroke="#D2691E" stroke-width="2" fill="none"/>
  <path d="M185,150 L200,160 L215,150" stroke="#D2691E" stroke-width="2" fill="none"/>
  
  <!-- 腳 -->
  <ellipse cx="180" cy="190" rx="15" ry="10" fill="#8B4513"/>
  <ellipse cx="220" cy="190" rx="15" ry="10" fill="#8B4513"/>
  
  <!-- 尾巴 -->
  <ellipse cx="200" cy="200" rx="18" ry="25" fill="#8B4513" transform="rotate(10 200 200)"/>
</svg>"""
    },
    
    "pufferfish": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="oceanBg11" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="url(#oceanBg11)"/>
  
  <!-- 氣泡 -->
  <circle cx="90" cy="90" r="10" fill="#fff" opacity="0.4"/>
  <circle cx="310" cy="110" r="12" fill="#fff" opacity="0.3"/>
  
  <!-- 河豚身體（鼓起來的球狀）-->
  <circle cx="200" cy="150" r="70" fill="#FFEB3B"/>
  
  <!-- 斑點 -->
  <circle cx="160" cy="130" r="8" fill="#FF9800"/>
  <circle cx="180" cy="110" r="6" fill="#FF9800"/>
  <circle cx="220" cy="115" r="7" fill="#FF9800"/>
  <circle cx="240" cy="135" r="8" fill="#FF9800"/>
  <circle cx="230" cy="170" r="6" fill="#FF9800"/>
  <circle cx="170" cy="175" r="7" fill="#FF9800"/>
  <circle cx="200" cy="190" r="6" fill="#FF9800"/>
  
  <!-- 刺（短短的）-->
  <line x1="150" y1="100" x2="142" y2="90" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="170" y1="85" x2="168" y2="72" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="200" y1="80" x2="200" y2="65" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="230" y1="85" x2="232" y2="72" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="250" y1="100" x2="258" y2="90" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="265" y1="130" x2="278" y2="125" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="270" y1="160" x2="283" y2="162" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="135" y1="130" x2="122" y2="125" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  <line x1="130" y1="160" x2="117" y2="162" stroke="#FFA500" stroke-width="3" stroke-linecap="round"/>
  
  <!-- 眼睛（大大的）-->
  <circle cx="175" cy="140" r="12" fill="#fff"/>
  <circle cx="225" cy="140" r="12" fill="#fff"/>
  <circle cx="175" cy="140" r="8" fill="#000"/>
  <circle cx="225" cy="140" r="8" fill="#000"/>
  <circle cx="177" cy="138" r="4" fill="#fff"/>
  <circle cx="227" cy="138" r="4" fill="#fff"/>
  
  <!-- 嘴巴（小小的O型）-->
  <circle cx="200" cy="165" r="8" fill="#FF9800"/>
  <circle cx="200" cy="165" r="5" fill="#000" opacity="0.5"/>
  
  <!-- 鰭（小小的）-->
  <ellipse cx="130" cy="155" rx="8" ry="15" fill="#FFD54F" opacity="0.8"/>
  <ellipse cx="270" cy="155" rx="8" ry="15" fill="#FFD54F" opacity="0.8"/>
  
  <!-- 尾鰭 -->
  <path d="M265,175 L285,170 L285,180 Z" fill="#FFD54F"/>
</svg>"""
    },
    
    "goldfish": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="aquariumBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#E0F7FA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#B2EBF2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 水族箱背景 -->
  <rect width="400" height="300" fill="url(#aquariumBg)"/>
  
  <!-- 水族箱裝飾 -->
  <ellipse cx="100" cy="270" rx="40" ry="15" fill="#4CAF50" opacity="0.5"/>
  <ellipse cx="320" cy="275" rx="35" ry="12" fill="#4CAF50" opacity="0.5"/>
  
  <!-- 氣泡 -->
  <circle cx="80" cy="200" r="6" fill="#fff" opacity="0.5"/>
  <circle cx="85" cy="150" r="8" fill="#fff" opacity="0.4"/>
  <circle cx="90" cy="100" r="10" fill="#fff" opacity="0.3"/>
  <circle cx="320" cy="180" r="7" fill="#fff" opacity="0.5"/>
  
  <!-- 金魚身體 -->
  <ellipse cx="200" cy="140" rx="50" ry="35" fill="#FF6F00"/>
  
  <!-- 金魚頭部 -->
  <ellipse cx="155" cy="140" rx="30" ry="28" fill="#FF8F00"/>
  
  <!-- 眼睛 -->
  <circle cx="148" cy="132" r="8" fill="#fff"/>
  <circle cx="148" cy="132" r="5" fill="#000"/>
  <circle cx="150" cy="130" r="2" fill="#fff"/>
  
  <!-- 嘴巴 -->
  <ellipse cx="135" cy="143" rx="8" ry="6" fill="#FF6F00"/>
  <path d="M130,143 Q132,148 135,145" stroke="#000" stroke-width="1" fill="none"/>
  
  <!-- 背鰭（飄逸的）-->
  <path d="M200,105 Q220,80 230,100 Q225,110 200,115" fill="#FF9800" opacity="0.8"/>
  
  <!-- 尾鰭（大而飄逸）-->
  <path d="M250,130 Q290,110 300,130 Q290,150 250,150 Z" fill="#FF5722" opacity="0.9"/>
  <path d="M250,135 Q280,120 288,135" stroke="#FF6F00" stroke-width="2" fill="none"/>
  <path d="M250,140 Q280,128 288,140" stroke="#FF6F00" stroke-width="2" fill="none"/>
  <path d="M250,145 Q280,136 288,145" stroke="#FF6F00" stroke-width="2" fill="none"/>
  
  <!-- 腹鰭 -->
  <ellipse cx="180" cy="165" rx="20" ry="12" fill="#FF9800" opacity="0.7" transform="rotate(-30 180 165)"/>
  
  <!-- 臀鰭 -->
  <path d="M215,165 Q230,185 235,170" fill="#FF9800" opacity="0.8"/>
  
  <!-- 鱗片紋理 -->
  <circle cx="180" cy="135" r="4" fill="#FFB74D" opacity="0.4"/>
  <circle cx="200" cy="140" r="4" fill="#FFB74D" opacity="0.4"/>
  <circle cx="220" cy="138" r="4" fill="#FFB74D" opacity="0.4"/>
  <circle cx="190" cy="150" r="4" fill="#FFB74D" opacity="0.4"/>
  <circle cx="210" cy="152" r="4" fill="#FFB74D" opacity="0.4"/>
</svg>"""
    },
    
    "anglerfish": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="deepseaBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#001F3F;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000814;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="lightGlow">
      <stop offset="0%" style="stop-color:#FFFF00;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFD700;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- 深海背景 -->
  <rect width="400" height="300" fill="url(#deepseaBg)"/>
  
  <!-- 鮟鱇魚發光器（最重要的特徵）-->
  <line x1="185" y1="100" x2="165" y2="50" stroke="#4A4A4A" stroke-width="3"/>
  <circle cx="165" cy="50" r="15" fill="url(#lightGlow)"/>
  <circle cx="165" cy="50" r="8" fill="#FFFF00"/>
  
  <!-- 光暈效果 -->
  <circle cx="165" cy="50" r="25" fill="#FFFF00" opacity="0.2"/>
  <circle cx="165" cy="50" r="35" fill="#FFD700" opacity="0.1"/>
  
  <!-- 鮟鱇魚身體 -->
  <ellipse cx="220" cy="150" rx="70" ry="50" fill="#2C3E50"/>
  
  <!-- 頭部 -->
  <ellipse cx="160" cy="145" rx="50" ry="45" fill="#34495E"/>
  
  <!-- 大嘴巴（張開）-->
  <path d="M120,155 Q130,175 150,165" fill="#000" opacity="0.8"/>
  <ellipse cx="135" cy="165" rx="25" ry="12" fill="#1C1C1C"/>
  
  <!-- 牙齒（尖銳但可愛化）-->
  <polygon points="125,160 128,170 131,160" fill="#F0F0F0"/>
  <polygon points="135,158 138,168 141,158" fill="#F0F0F0"/>
  <polygon points="145,160 148,170 151,160" fill="#F0F0F0"/>
  
  <!-- 眼睛（小小的）-->
  <circle cx="145" cy="135" r="6" fill="#FFD700"/>
  <circle cx="145" cy="135" r="3" fill="#000"/>
  
  <!-- 背鰭 -->
  <path d="M220,100 Q235,85 240,105" fill="#1C2833"/>
  
  <!-- 胸鰭 -->
  <ellipse cx="180" cy="175" rx="25" ry="12" fill="#1C2833" transform="rotate(-20 180 175)"/>
  
  <!-- 尾鰭 -->
  <path d="M285,145 Q310,130 315,150 Q310,165 285,155 Z" fill="#1C2833"/>
  
  <!-- 腹部（略淺色）-->
  <ellipse cx="210" cy="165" rx="50" ry="30" fill="#4A5568" opacity="0.5"/>
  
  <!-- 發光生物（遠處）-->
  <circle cx="50" cy="80" r="3" fill="#00FFFF" opacity="0.6"/>
  <circle cx="350" cy="200" r="4" fill="#00FF7F" opacity="0.5"/>
  <circle cx="300" cy="100" r="2" fill="#FF69B4" opacity="0.7"/>
</svg>"""
    },
    
    "beluga-whale": {
        "svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="arcticBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#B0E0E6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#87CEEB;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 北極海背景 -->
  <rect width="400" height="300" fill="url(#arcticBg)"/>
  
  <!-- 冰塊 -->
  <polygon points="50,40 100,30 110,50 60,55" fill="#F0F8FF" opacity="0.7"/>
  <polygon points="320,60 370,50 380,70 330,75" fill="#F0F8FF" opacity="0.7"/>
  
  <!-- 氣泡 -->
  <circle cx="120" cy="180" r="8" fill="#fff" opacity="0.5"/>
  <circle cx="130" cy="140" r="10" fill="#fff" opacity="0.4"/>
  <circle cx="140" cy="100" r="12" fill="#fff" opacity="0.3"/>
  
  <!-- 白鯨身體 -->
  <ellipse cx="220" cy="160" rx="80" ry="45" fill="#F5F5F5"/>
  
  <!-- 白鯨頭部（圓圓的額頭 - melon）-->
  <circle cx="145" cy="155" r="45" fill="#FFFFFF"/>
  
  <!-- 嘴部（微笑）-->
  <ellipse cx="110" cy="160" rx="20" ry="15" fill="#F5F5F5"/>
  <path d="M95,165 Q105,172 115,165" stroke="#000" stroke-width="2" fill="none" stroke-linecap="round"/>
  
  <!-- 眼睛（小而友善）-->
  <circle cx="130" cy="145" r="5" fill="#000"/>
  <circle cx="132" cy="144" r="2" fill="#fff"/>
  
  <!-- 胸鰭 -->
  <ellipse cx="170" cy="185" rx="30" ry="15" fill="#E8E8E8" transform="rotate(-25 170 185)"/>
  <ellipse cx="170" cy="135" rx="30" ry="15" fill="#E8E8E8" transform="rotate(25 170 135)"/>
  
  <!-- 背脊（隆起，沒有背鰭）-->
  <path d="M210,115 Q230,110 250,115" stroke="#E8E8E8" stroke-width="8" fill="none" stroke-linecap="round"/>
  
  <!-- 尾鰭 -->
  <path d="M300,150 Q330,135 345,150 Q330,165 300,165 Z" fill="#E8E8E8"/>
  <path d="M305,150 Q325,140 335,150" stroke="#D3D3D3" stroke-width="2" fill="none"/>
  <path d="M305,160 Q325,165 335,160" stroke="#D3D3D3" stroke-width="2" fill="none"/>
  
  <!-- 皺褶（特徵）-->
  <path d="M160,165 Q165,167 170,165" stroke="#E0E0E0" stroke-width="1" fill="none"/>
  <path d="M180,170 Q185,172 190,170" stroke="#E0E0E0" stroke-width="1" fill="none"/>
  
  <!-- 噴氣孔 -->
  <ellipse cx="155" cy="125" rx="6" ry="4" fill="#D3D3D3"/>
  
  <!-- 水花（呼吸）-->
  <circle cx="155" cy="110" r="4" fill="#87CEEB" opacity="0.4"/>
  <circle cx="150" cy="100" r="3" fill="#87CEEB" opacity="0.3"/>
  <circle cx="160" cy="105" r="3" fill="#87CEEB" opacity="0.3"/>
</svg>"""
    }
}

def generate_images():
    """生成所有水族館動物的 SVG 圖片"""
    print("🎨 開始生成可愛風格的水族館動物圖片...")
    
    for animal_id, data in ANIMALS.items():
        animal_dir = os.path.join(OUTPUT_DIR, animal_id)
        
        # 確保目錄存在
        os.makedirs(animal_dir, exist_ok=True)
        
        # 寫入 SVG 檔案
        svg_path = os.path.join(animal_dir, "main.png")  # 儲存為 .png 副檔名但內容是 SVG
        
        # 實際上我們要產生 PNG，但先儲存 SVG
        svg_file = os.path.join(animal_dir, "main.svg")
        with open(svg_file, 'w', encoding='utf-8') as f:
            f.write(data['svg'])
        
        print(f"✅ 已生成: {animal_id}/main.svg")
    
    print(f"\n🎉 完成！共生成 {len(ANIMALS)} 隻可愛的水族館動物圖片")
    print(f"📁 圖片位置: {OUTPUT_DIR}")
    print("\n⚠️  注意: SVG 檔案已生成，建議將 .svg 轉換為 .png 以獲得更好的瀏覽器相容性")
    print("可使用以下指令將 SVG 轉換為 PNG:")
    print("  brew install librsvg")
    print(f"  cd {OUTPUT_DIR}")
    print("  for dir in */; do rsvg-convert \"${{dir}}main.svg\" -o \"${{dir}}main.png\" -w 800 -h 600; done")

if __name__ == "__main__":
    generate_images()
