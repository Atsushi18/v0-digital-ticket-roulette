"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RouletteWheel } from "@/components/roulette-wheel"
import { PrizeTicket } from "@/components/prize-ticket"
import { Download, RotateCcw, Settings, Upload, X } from "lucide-react"
import localforage from "localforage"

export default function RoulettePage() {
  const prizes = ["ごちそう券", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ"]

  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const [showCutIn, setShowCutIn] = useState(false)
  const [initialResult, setInitialResult] = useState<string | null>(null)
  const [cutinMedia, setCutinMedia] = useState<string | null>(null)
  const [cutinMediaType, setCutinMediaType] = useState<"image" | "video" | null>(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const ticketRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    const loadMedia = async () => {
      const savedMedia = await localforage.getItem<string>("cutinMedia")
      const savedMediaType = (await localforage.getItem<"image" | "video" | null>("cutinMediaType"))
      
      if (savedMedia && savedMediaType) {
        setCutinMedia(savedMedia)
        setCutinMediaType(savedMediaType)
      }
    }
    loadMedia()
  }, [])

  const handlePasswordSubmit = () => {
    const correctPassword = "admin123"
    if (password === correctPassword) {
      setIsAuthenticated(true)
      setShowPasswordModal(false)
      setShowSettings(true)
      setPassword("")
    } else {
      alert("合言葉が間違っています")
      setPassword("")
    }
  }

  const handleSettingsClick = () => {
    if (isAuthenticated) {
      setShowSettings(!showSettings)
    } else {
      setShowPasswordModal(true)
    }
  }

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileType = file.type
    let mediaType: "image" | "video" | null = null
    if (fileType.startsWith("image/")) {
      mediaType = "image"
    } else if (fileType.startsWith("video/")) {
      mediaType = "video"
    } else {
      alert("画像または動画ファイルを選択してください")
      return
    }

    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = e.target?.result as string
      setCutinMedia(result)
      setCutinMediaType(mediaType)

      try {
        await localforage.setItem("cutinMedia", result)
        if (mediaType) {
          await localforage.setItem("cutinMediaType", mediaType)
        }
      } catch (err) {
        console.error("保存に失敗しました:", err)
        alert("メディアの保存に失敗しました。ファイルサイズが大きすぎる可能性があります。")
      }
    }
    reader.readAsDataURL(file)
  }

  const removeCutinMedia = async () => {
    setCutinMedia(null)
    setCutinMediaType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    await localforage.removeItem("cutinMedia")
    await localforage.removeItem("cutinMediaType")
  }
  
  const spinRoulette = () => {
    if (isSpinning) return

    setWinner(null)
    setShowTicket(false)
    setShowCutIn(false)
    setInitialResult(null)
    
    const atariIndex = prizes.findIndex(p => p === "ごちそう券");
    if (atariIndex === -1) {
      alert("「ごちそう券」がありません！");
      return;
    }
    
    const targetIndex = (atariIndex + 1) % prizes.length;

    if (prizes[targetIndex] !== "はずれ") {
      alert("「ごちそう券」の隣に「はずれ」がありません！惜しい演出ができません。");
      return;
    }
    
    setWinnerIndex(targetIndex);
    setIsSpinning(true)
  }

  const handleRouletteStop = () => {
    if (winnerIndex === null) return;
    const resultPrize = prizes[winnerIndex];
    setInitialResult(resultPrize);
    setWinner(resultPrize);
    setIsSpinning(false)

    setTimeout(() => {
      setShowCutIn(true)
    }, 2000)
  }

  const handleCutinEnd = () => {
    setWinner("ごちそう券")
    setShowCutIn(false)
    setTimeout(() => setShowTicket(true), 1000)
  }

  useEffect(() => {
    if (showCutIn) {
      if (cutinMediaType === "video" && videoRef.current) {
        const videoElement = videoRef.current
        
        const onVideoEnd = () => handleCutinEnd()
        videoElement.addEventListener("ended", onVideoEnd, { once: true })
        
        videoElement.play().catch(error => {
          console.error("動画の自動再生に失敗しました:", error)
          setTimeout(() => handleCutinEnd(), 4000)
        })
        
        return () => videoElement.removeEventListener("ended", onVideoEnd)
      } else {
        const timer = setTimeout(() => handleCutinEnd(), 4000)
        return () => clearTimeout(timer)
      }
    }
  }, [showCutIn, cutinMediaType])

  const downloadTicket = () => {
    if (!winner || winner === "はずれ") return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 500
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#fbbf24")
    gradient.addColorStop(1, "#f59e0b")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#ffffff"
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10)
    ctx.fill()
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 4
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10)
    ctx.stroke()
    ctx.fillStyle = "#1f2937"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("🎫 デジタル券", canvas.width / 2, 80)
    ctx.font = "bold 32px Arial"
    ctx.fillStyle = "#dc2626"
    ctx.fillText(winner, canvas.width / 2, 140)
    ctx.font = "16px Arial"
    ctx.fillStyle = "#6b7280"
    ctx.fillText("この券は有効な賞品券です", canvas.width / 2, 180)
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 200)
    ctx.lineTo(canvas.width - 40, 200)
    ctx.stroke()
    ctx.setLineDash([])
    const currentDate = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase()
    ctx.font = "14px Arial"
    ctx.fillStyle = "#6b7280"
    ctx.textAlign = "left"
    ctx.fillText("発行日:", 50, 240)
    ctx.textAlign = "right"
    ctx.fillText(currentDate, canvas.width - 50, 240)
    ctx.textAlign = "left"
    ctx.fillText("券番号:", 50, 270)
    ctx.textAlign = "right"
    ctx.font = "14px monospace"
    ctx.fillText(ticketNumber, canvas.width - 50, 270)
    ctx.font = "14px Arial"
    ctx.textAlign = "left"
    ctx.fillText("発行者:", 50, 300)
    ctx.textAlign = "right"
    ctx.fillText("原井川陸", canvas.width - 50, 300)
    ctx.setLineDash([5, 5])
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(40, 330)
    ctx.lineTo(canvas.width - 40, 330)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.font = "12px Arial"
    ctx.fillStyle = "#9ca3af"
    ctx.textAlign = "center"
    ctx.fillText("※ この券は当選の証明として使用できます", canvas.width / 2, 360)
    ctx.fillText("※ 追加したい新しい文章をここに書きます", canvas.width / 2, 380)
    ctx.font = "32px Arial"
    ctx.fillText("🎉", canvas.width / 2, 420)
    const link = document.createElement("a")
    link.download = `${winner}_ticket.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const resetGame = () => {
    setWinner(null)
    setShowTicket(false)
    setShowCutIn(false)
    setInitialResult(null)
    setIsSpinning(false)
    setWinnerIndex(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">🎰 ルーレットアプリ</h1>
              <p className="text-muted-foreground">ルーレットを回して素敵な賞品をゲットしよう！</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSettingsClick} disabled={isSpinning}>
                <Settings className="w-4 h-4 mr-2" />
                設定
              </Button>
              <Button variant="outline" size="sm" onClick={resetGame} disabled={isSpinning}>
                <RotateCcw className="w-4 h-4 mr-2" />
                リセット
              </Button>
            </div>
          </div>
        </div>
      </header>
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">管理者認証</h3>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="合言葉を入力してください"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                />
                <div className="flex gap-2">
                  <Button onClick={handlePasswordSubmit} className="flex-1">認証</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPassword("")
                    }}
                    className="flex-1"
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="container mx-auto px-4 py-8">
        {showSettings && isAuthenticated && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">カットイン演出の設定</h3>
              <div className="space-y-4">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    画像または動画をアップロード
                  </Button>
                </div>
                {cutinMedia && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: {cutinMediaType === "image" ? "画像" : "動画"}
                      </span>
                      <Button variant="ghost" size="sm" onClick={removeCutinMedia}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      {cutinMediaType === "image" ? (
                        <img
                          src={cutinMedia || "/placeholder.svg"}
                          alt="カットイン画像"
                          className="max-w-full h-32 object-contain mx-auto"
                        />
                      ) : (
                        <video src={cutinMedia} className="max-w-full h-32 object-contain mx-auto" controls />
                      )}
                    </div>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  ※ アップロードした画像や動画がカットイン演出で表示されます
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid lg:grid-cols-1 gap-8">
          <Card className="lg:col-span-1">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-8">
                
                {showCutIn && (
                  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="max-w-4xl max-h-4xl w-full h-full flex items-center justify-center p-8">
                      {cutinMedia ? (
                        cutinMediaType === "image" ? (
                          <img
                            src={cutinMedia || "/placeholder.svg"}
                            alt="カットイン演出"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <video 
                            ref={videoRef} 
                            src={cutinMedia} 
                            autoPlay 
                            muted
                            playsInline
                            className="max-w-full max-h-full object-contain" 
                          />
                        )
                      ) : (
                        <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-white text-6xl font-bold p-8 rounded-lg shadow-2xl animate-bounce">
                          🎉 カットイン！ 🎉
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {winner && !showCutIn && showTicket && winner !== "はずれ" ? (
                  <div className="w-full max-w-md flex flex-col items-center space-y-4">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-primary mb-2">🎉 おめでとう！</h2>
                      <p className="text-xl text-foreground">{winner}が当たりました！</p>
                    </div>
                    <div ref={ticketRef}>
                      <PrizeTicket prizeName={winner} />
                    </div>
                    <Button onClick={downloadTicket} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      デジタル券をダウンロード
                    </Button>
                  </div>
                ) : (
                  <>
                    <RouletteWheel 
                      prizes={prizes} 
                      isSpinning={isSpinning} 
                      winnerIndex={winnerIndex} 
                      onStop={handleRouletteStop}
                    />
                    <div className="text-center space-y-4">
                      <Button onClick={spinRoulette} disabled={isSpinning} size="lg" className="px-8 py-4 text-lg font-semibold">
                        {isSpinning ? "ルーレット回転中..." : "ルーレットを回す！"}
                      </Button>
                      {winner && !showCutIn && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <h2 className="text-3xl font-bold text-primary mb-2">
                              {winner === "はずれ" ? "😢 残念！" : ""}
                            </h2>
                            <p className="text-xl text-foreground">
                              {winner === "はずれ" ? "はずれでした..." : ""}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">賞品一覧</h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from(new Set(prizes)).map((prize, index) => (
                      <Badge key={index} variant={prize === "ごちそう券" ? "default" : "secondary"}>
                        {prize} {prize === "ごちそう券" ? "(1個)" : `(${prizes.filter((p) => p === prize).length}個)`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}