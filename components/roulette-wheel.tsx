"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface RouletteWheelProps {
  prizes: string[]
  isSpinning: boolean
  winnerIndex: number | null
}

export function RouletteWheel({ prizes, isSpinning, winnerIndex }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [transitionDuration, setTransitionDuration] = useState('0s') // アニメーション時間を管理
  const segmentAngle = 360 / prizes.length

  useEffect(() => {
    if (isSpinning && winnerIndex !== null) {
      // 1. まずトランジションを無効にして、開始角度をリセット
      setTransitionDuration('0s');
      setRotation(prev => prev % 360);

      // 2. ブラウザがリセットを認識するのを待ってから、本番のアニメーションを開始
      const timer = setTimeout(() => {
        setTransitionDuration('6s'); // アニメーション時間を設定
        
        const startOfSegmentAngle = winnerIndex * segmentAngle;
        const overshootOffset = segmentAngle * (0.1 + Math.random() * 0.1);
        const targetAngle = startOfSegmentAngle + overshootOffset;
        const spins = 10 + Math.random() * 5;
        const finalRotation = (spins * 360) - targetAngle;
  
        setRotation(finalRotation);
      }, 50); // わずかな遅延が重要
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning, winnerIndex, segmentAngle]);


  const colors = [
    "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1",
    "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8",
  ]

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
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="transform"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: `transform ${transitionDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`
          }}
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