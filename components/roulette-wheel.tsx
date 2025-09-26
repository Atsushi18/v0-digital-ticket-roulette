"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface RouletteWheelProps {
  prizes: string[]
  isSpinning: boolean
  winner: string | null
  winnerIndex: number | null
}

export function RouletteWheel({ prizes, isSpinning, winner, winnerIndex }: RouletteWheelProps) {
  const [rotation, setRotation] = useState(0)
  const segmentAngle = 360 / prizes.length

  useEffect(() => {
    if (isSpinning && winnerIndex !== null) {
      const targetAngle = winnerIndex * segmentAngle
      const randomOffset = (segmentAngle / 2) * (Math.random() * 0.8 - 0.4)
      const spins = 5 + Math.random() * 5
      const finalRotation = spins * 360 - targetAngle - randomOffset

      setRotation(finalRotation)
    }
  }, [isSpinning, winnerIndex])


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

  return (
    <div className="relative">
      {/* --- ▼ここを修正▼ --- */}
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 drop-shadow-lg">
        <div className="w-0 h-0 
          border-l-[12px] border-l-transparent
          border-r-[12px] border-r-transparent
          border-t-[24px] border-t-primary-foreground"
        />
      </div>
      {/* --- ▲ここまで修正▲ --- */}

      {/* Wheel */}
      <div className="relative w-80 h-80 mx-auto">
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className={`transform transition-transform duration-3000 ease-out ${isSpinning ? "roulette-spin" : ""}`}
          style={
            {
              "--rotation-degrees": `${rotation}deg`,
              transform: isSpinning ? undefined : `rotate(${rotation}deg)`
            } as React.CSSProperties
          }
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

      {winner && !isSpinning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-card border-2 border-primary rounded-lg p-4 shadow-lg animate-fade-in-up">
            <p className="text-lg font-bold text-center text-primary">{winner}</p>
          </div>
        </div>
      )}
    </div>
  )
}