"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

interface RouletteWheelProps {
  prizes: string[]
  rouletteState: "idle" | "spinning" | "stopping"
  winnerIndex: number | null
  onStop: () => void
}

export function RouletteWheel({ prizes, rouletteState, winnerIndex, onStop }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0)
  const segmentAngle = 360 / prizes.length
  const wheelRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (rouletteState === "stopping" && winnerIndex !== null) {
      // 停止する最終的な角度を計算
      const startOfSegmentAngle = winnerIndex * segmentAngle;
      const overshootOffset = segmentAngle * (0.1 + Math.random() * 0.1);
      const targetAngle = startOfSegmentAngle + overshootOffset;
      
      // 現在の回転角度を取得
      const wheel = wheelRef.current
      if (!wheel) return
      const currentTransform = window.getComputedStyle(wheel).transform
      const matrix = new DOMMatrix(currentTransform)
      const currentAngle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI))
      
      // 現在の角度から最も近い未来の停止角度を計算
      const fullRotations = Math.ceil(rotation / 360) + 2 // 少なくとも2周は余分に回す
      const finalRotation = (fullRotations * 360) - targetAngle
      
      setRotation(finalRotation)
      
      // 停止アニメーションが終わったら親コンポーネントに通知
      setTimeout(onStop, 2000) // 停止アニメーションの時間
    } else if (rouletteState === "idle") {
      setRotation(0) // アイドル状態に戻ったら角度をリセット
    }
  }, [rouletteState])


  const colors = [
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
    "#F8C471",
  ]
  
  const getWheelClassName = () => {
    if (rouletteState === 'spinning') {
      return 'spinning'
    }
    if (rouletteState === 'stopping') {
      // 停止アニメーション用のクラス
      return 'transform transition-transform duration-[2000ms] ease-out'
    }
    return '' // idle
  }

  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 drop-shadow-lg">
        <div className="w-0 h-0 
          border-l-[12px] border-l-transparent
          border-r-[12px] border-r-transparent
          border-t-[24px] border-t-primary-foreground"
        />
      </div>

      <div className="relative w-80 h-80 mx-auto">
        <svg
          ref={wheelRef}
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className={getWheelClassName()}
          style={{ transform: rouletteState === 'spinning' ? undefined : `rotate(${rotation}deg)` }}
        >
          {prizes.map((prize, index) => {
            const startAngle = (index * segmentAngle - 90) * (Math.PI / 180)
            const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180)
            const largeArcFlag = segmentAngle > 180 ? 1 : 0

            const x1 = 160 + 140 * Math.cos(startAngle)
            const y1 = 160 + 140 * Math.sin(startAngle)
            const x2 = 160 + 140 * Math.cos(endAngle)
            const y2 = 160 + 140 * Math.sin(endAngle)

            const textAngle = index * segmentAngle + segmentAngle / 2 - 90
            const textRadius = 100
            const textX = 160 + textRadius * Math.cos(textAngle * (Math.PI / 180))
            const textY = 160 + textRadius * Math.sin(textAngle * (Math.PI / 180))

            return (
              <g key={index}>
                <path
                  d={`M 160 160 L ${x1} ${y1} A 140 140 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#000"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                >
                  {prize}
                </text>
              </g>
            )
          })}

          <circle cx="160" cy="160" r="20" fill="#333" stroke="#fff" strokeWidth="3" />
        </svg>
      </div>
    </div>
  )
}