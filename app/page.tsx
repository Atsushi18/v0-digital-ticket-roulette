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
  const prizes = ["食い逃げ券", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ", "はずれ"]

  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [showTicket, setShowTicket] = useState(false)
  const [showCutIn, setShowCutIn] = useState(false)
  const [initialResult, setInitialResult] = useState<string | null>(null)
  const [cutinMedia, setCutinMedia] = useState<string | null>(null)
  const [cutinMediaType, setCutinMediaType] = useState<"image" | "video" | null>(null)
  const [upgradeAudio1, setUpgradeAudio1] = useState<string | null>(null)
  const [upgradeAudio2, setUpgradeAudio2] = useState<string | null>(null)
  const [pushButtonImage, setPushButtonImage] = useState<string | null>(null);
  const [showPushButton, setShowPushButton] = useState(false);
  const [drumrollAudio, setDrumrollAudio] = useState<string | null>(null);
  const [drumrollDuration, setDrumrollDuration] = useState(6);
  const [cutinAudio, setCutinAudio] = useState<string | null>(null);
  const [pushButtonAudio, setPushButtonAudio] = useState<string | null>(null);
  const [upgradeImage1, setUpgradeImage1] = useState<string | null>(null);
  const [upgradeImage2, setUpgradeImage2] = useState<string | null>(null);
  const [showUpgradeImage1, setShowUpgradeImage1] = useState(false);
  const [showUpgradeImage2, setShowUpgradeImage2] = useState(false);
  const [interludeMedia, setInterludeMedia] = useState<string | null>(null);
  const [interludeMediaType, setInterludeMediaType] = useState<"image" | "video" | null>(null);
  const [interludeAudio, setInterludeAudio] = useState<string | null>(null);
  const [showInterlude, setShowInterlude] = useState(false);
  const [winningAudio, setWinningAudio] = useState<string | null>(null); // ★当たり音声用
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const ticketRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioFileInputRef1 = useRef<HTMLInputElement>(null)
  const audioFileInputRef2 = useRef<HTMLInputElement>(null)
  const pushButtonFileInputRef = useRef<HTMLInputElement>(null);
  const drumrollFileInputRef = useRef<HTMLInputElement>(null);
  const cutinAudioFileInputRef = useRef<HTMLInputElement>(null);
  const pushButtonAudioFileInputRef = useRef<HTMLInputElement>(null);
  const upgradeImage1FileInputRef = useRef<HTMLInputElement>(null);
  const upgradeImage2FileInputRef = useRef<HTMLInputElement>(null);
  const interludeMediaFileInputRef = useRef<HTMLInputElement>(null);
  const interludeAudioFileInputRef = useRef<HTMLInputElement>(null);
  const winningAudioFileInputRef = useRef<HTMLInputElement>(null); // ★当たり音声用のref
  const videoRef = useRef<HTMLVideoElement>(null)
  const interludeVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef1 = useRef<HTMLAudioElement>(null)
  const audioRef2 = useRef<HTMLAudioElement>(null)
  const drumrollAudioRef = useRef<HTMLAudioElement>(null);
  const cutinAudioRef = useRef<HTMLAudioElement>(null);
  const pushButtonAudioRef = useRef<HTMLAudioElement>(null);
  const interludeAudioRef = useRef<HTMLAudioElement>(null);
  const winningAudioRef = useRef<HTMLAudioElement>(null); // ★当たり音声audio要素用のref

  useEffect(() => {
    const loadAssets = async () => {
      const savedMedia = await localforage.getItem<string>("cutinMedia")
      const savedMediaType = (await localforage.getItem<"image" | "video" | null>("cutinMediaType"))
      const savedAudio1 = await localforage.getItem<string>("upgradeAudio1")
      const savedAudio2 = await localforage.getItem<string>("upgradeAudio2")
      const savedPushButtonImage = await localforage.getItem<string>("pushButtonImage")
      const savedDrumroll = await localforage.getItem<string>("drumrollAudio")
      const savedCutinAudio = await localforage.getItem<string>("cutinAudio")
      const savedPushButtonAudio = await localforage.getItem<string>("pushButtonAudio");
      const savedUpgradeImage1 = await localforage.getItem<string>("upgradeImage1");
      const savedUpgradeImage2 = await localforage.getItem<string>("upgradeImage2");
      const savedInterludeMedia = await localforage.getItem<string>("interludeMedia");
      const savedInterludeMediaType = await localforage.getItem<"image" | "video" | null>("interludeMediaType");
      const savedInterludeAudio = await localforage.getItem<string>("interludeAudio");
      const savedWinningAudio = await localforage.getItem<string>("winningAudio");
      
      if (savedMedia && savedMediaType) {
        setCutinMedia(savedMedia)
        setCutinMediaType(savedMediaType)
      }
      if (savedAudio1) setUpgradeAudio1(savedAudio1);
      if (savedAudio2) setUpgradeAudio2(savedAudio2);
      if (savedPushButtonImage) setPushButtonImage(savedPushButtonImage);
      if (savedDrumroll) setDrumrollAudio(savedDrumroll);
      if (savedCutinAudio) setCutinAudio(savedCutinAudio);
      if (savedPushButtonAudio) setPushButtonAudio(savedPushButtonAudio);
      if (savedUpgradeImage1) setUpgradeImage1(savedUpgradeImage1);
      if (savedUpgradeImage2) setUpgradeImage2(savedUpgradeImage2);
      if (savedInterludeMedia && savedInterludeMediaType) {
        setInterludeMedia(savedInterludeMedia);
        setInterludeMediaType(savedInterludeMediaType);
      }
      if (savedInterludeAudio) setInterludeAudio(savedInterludeAudio);
      if (savedWinningAudio) setWinningAudio(savedWinningAudio);
    }
    loadAssets()
  }, [])

  useEffect(() => {
    const audio = drumrollAudioRef.current;
    if (audio) {
      const handleMetadata = () => {
        if (audio.duration && isFinite(audio.duration)) {
          setDrumrollDuration(audio.duration);
        } else {
          setDrumrollDuration(6);
        }
      }
      audio.addEventListener('loadedmetadata', handleMetadata);
      if (audio.readyState > 0) handleMetadata();
      return () => audio.removeEventListener('loadedmetadata', handleMetadata);
    }
  }, [drumrollAudio]);

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

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void, typeSetter: ((type: "image" | "video" | null) => void) | null, storageKey: string, typeStorageKey: string | null) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const fileType = file.type;
    let mediaType: "image" | "video" | null = null;
    if (fileType.startsWith("image/")) {
      mediaType = "image";
    } else if (fileType.startsWith("video/")) {
      mediaType = "video";
    } else {
      alert("画像または動画ファイルを選択してください");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setter(result);
      if(typeSetter) typeSetter(mediaType);
      try {
        await localforage.setItem(storageKey, result);
        if (typeSetter && typeStorageKey) {
          await localforage.setItem(typeStorageKey, mediaType);
        }
      } catch (err) {
        console.error("保存に失敗しました:", err);
        alert("メディアの保存に失敗しました。ファイルサイズが大きすぎる可能性があります。");
      }
    };
    reader.readAsDataURL(file);
  }
  
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void, storageKey: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("audio/") && !file.name.endsWith('.mp3') && !file.name.endsWith('.m4a')) {
      alert("音声ファイルを選択してください。");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setter(result);
      await localforage.setItem(storageKey, result);
    };
    reader.readAsDataURL(file);
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void, storageKey: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください。");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const result = e.target?.result as string;
      setter(result);
      await localforage.setItem(storageKey, result);
    };
    reader.readAsDataURL(file);
  }
  
  const removeAsset = async (setter: (value: any) => void, ref: React.RefObject<HTMLInputElement>, storageKey: string, typeSetter?: (value: any) => void, typeStorageKey?: string) => {
    setter(null);
    if(typeSetter) typeSetter(null);
    if (ref.current) ref.current.value = "";
    await localforage.removeItem(storageKey);
    if(typeStorageKey) await localforage.removeItem(typeStorageKey);
  }

  const spinRoulette = () => {
    if (isSpinning) return;
    
    [drumrollAudioRef, audioRef1, audioRef2, cutinAudioRef, pushButtonAudioRef, winningAudioRef, videoRef, interludeVideoRef].forEach(ref => {
      if(ref.current) ref.current.load();
    });

    if (drumrollAudioRef.current) {
      drumrollAudioRef.current.play().catch(e => console.error("ドラムロールの再生に失敗:", e));
    }

    setShowPushButton(false);
    setShowUpgradeImage1(false);
    setShowInterlude(false);
    setShowUpgradeImage2(false);
    setWinner(null)
    setShowTicket(false)
    setShowCutIn(false)
    setInitialResult(null)
    
    const atariIndex = prizes.findIndex(p => p === "食い逃げ券");
    if (atariIndex === -1) {
      alert("「食い逃げ券」がありません！");
      return;
    }
    
    const targetIndex = (atariIndex + 1) % prizes.length;

    if (prizes[targetIndex] !== "はずれ") {
      alert("「食い逃げ券」の隣に「はずれ」がありません！惜しい演出ができません。");
      return;
    }
    
    setWinnerIndex(targetIndex);
    setIsSpinning(true)
  }

  const handleRouletteStop = () => {
    if (winnerIndex === null) return;
    
    if (drumrollAudioRef.current && !drumrollAudioRef.current.paused) {
      drumrollAudioRef.current.pause();
      drumrollAudioRef.current.currentTime = 0;
    }
    
    const resultPrize = prizes[winnerIndex];
    setInitialResult(resultPrize);
    setWinner(resultPrize);
    setIsSpinning(false)

    setTimeout(() => {
      setShowPushButton(true);
      if (pushButtonAudioRef.current && pushButtonAudio) {
        pushButtonAudioRef.current.play().catch(e => console.error("押せボタン音声の再生に失敗:", e));
      }
    }, 2000);
  }

  const handlePushButtonClick = () => {
    setShowPushButton(false);
    
    if (pushButtonAudioRef.current && !pushButtonAudioRef.current.paused) {
      pushButtonAudioRef.current.pause();
      pushButtonAudioRef.current.currentTime = 0;
    }

    playUpgradeAudio1();
  }
  
  const playUpgradeAudio1 = () => {
    setShowUpgradeImage1(true);
    if (audioRef1.current && upgradeAudio1) {
      audioRef1.current.play().catch(e => {
        console.error("音声1の再生に失敗:", e);
        handleAudio1End();
      });
    } else {
      setTimeout(handleAudio1End, 2000);
    }
  }

  const handleAudio1End = () => {
    setShowUpgradeImage1(false);
    playInterlude();
  }
  
  const playInterlude = () => {
    setShowInterlude(true);

    if (interludeAudioRef.current && interludeAudio) {
      interludeAudioRef.current.play().catch(e => {
        console.error("中間音声の再生に失敗:", e);
        handleInterludeEnd();
      });
    }

    if (interludeMediaType === 'video' && interludeVideoRef.current) {
      interludeVideoRef.current.play().catch(e => {
        console.error("中間動画の再生に失敗", e)
        handleInterludeEnd();
      });
    } else if (!interludeAudio) {
      setTimeout(handleInterludeEnd, 2000);
    }
  }

  const handleInterludeEnd = () => {
    setShowInterlude(false);
    playUpgradeAudio2();
  }


  const playUpgradeAudio2 = () => {
    setShowUpgradeImage2(true);
    if (audioRef2.current && upgradeAudio2) {
      audioRef2.current.play().catch(e => {
        console.error("音声2の再生に失敗:", e);
        handleAudio2End();
      });
    } else {
      setTimeout(handleAudio2End, 2000);
    }
  }

  const handleAudio2End = () => {
    setShowUpgradeImage2(false);
    triggerCutin();
  }

  const triggerCutin = () => {
    setShowCutIn(true);
  }

  const handleCutinEnd = () => {
    setShowCutIn(false)
    if (cutinAudioRef.current) {
      cutinAudioRef.current.pause();
      cutinAudioRef.current.currentTime = 0;
    }
    setWinner("食い逃げ券");
    setShowTicket(true);
  }
  
  useEffect(() => {
    if (showTicket) {
      if(winningAudioRef.current && winningAudio) {
        winningAudioRef.current.play().catch(e => console.error("当たり音声の再生に失敗:", e));
      }
    }
  },[showTicket])

  useEffect(() => {
    if (showCutIn) {
      if (cutinAudioRef.current) {
        cutinAudioRef.current.play().catch(e => console.error("カットイン音声の再生に失敗", e));
      }

      const videoElement = videoRef.current;
      const audioIsPlaying = cutinAudioRef.current && !cutinAudioRef.current.paused;

      const finishHandler = () => {
        handleCutinEnd();
      };

      if (cutinMediaType === "video" && videoElement) {
        const onVideoEnd = () => {
          if (cutinAudioRef.current && !cutinAudioRef.current.paused) {
             // 音声が終わるのを待つ
          } else {
            finishHandler();
          }
        }
        videoElement.addEventListener("ended", onVideoEnd, { once: true })
        
        videoElement.play().catch(error => {
          console.error("動画の自動再生に失敗しました:", error)
          setTimeout(() => onVideoEnd(), 2000)
        })
        
        return () => videoElement.removeEventListener("ended", onVideoEnd)
      } else {
        if (audioIsPlaying && cutinAudioRef.current) {
           // onendedイベントがaudioタグにセットされているので待つ
        } else {
          const timer = setTimeout(() => finishHandler(), 2000)
          return () => clearTimeout(timer);
        }
      }
    }
  }, [showCutIn, cutinMediaType])

  const downloadTicket = () => {
    if (!winner || winner === "はずれ") return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 400;
    canvas.height = 500;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#fbbf24");
    gradient.addColorStop(1, "#f59e0b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10);
    ctx.fill();
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 4;
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10);
    ctx.stroke();
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🎫 デジタル券", canvas.width / 2, 80);
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#dc2626";
    ctx.fillText(winner, canvas.width / 2, 140);
    ctx.font = "16px Arial";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("この券は有効な賞品券です", canvas.width / 2, 180);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 200);
    ctx.lineTo(canvas.width - 40, 200);
    ctx.stroke();
    ctx.setLineDash([]);
    const currentDate = new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const ticketNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    ctx.font = "14px Arial";
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "left";
    ctx.fillText("発行日:", 50, 240);
    ctx.textAlign = "right";
    ctx.fillText(currentDate, canvas.width - 50, 240);
    ctx.textAlign = "left";
    ctx.fillText("券番号:", 50, 270);
    ctx.textAlign = "right";
    ctx.font = "14px monospace";
    ctx.fillText(ticketNumber, canvas.width - 50, 270);
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("発行者:", 50, 300);
    ctx.textAlign = "right";
    ctx.fillText("吉田プレゼント", canvas.width - 50, 300);
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 330);
    ctx.lineTo(canvas.width - 40, 330);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "12px Arial";
    ctx.fillStyle = "#9ca3af";
    ctx.textAlign = "center";
    ctx.fillText("※ この券は当選の証明として使用できます", canvas.width / 2, 360);
    ctx.fillText("※ 追加したい新しい文章をここに書きます", canvas.width / 2, 380);
    ctx.font = "32px Arial";
    ctx.fillText("🎉", canvas.width / 2, 420);
    const link = document.createElement("a");
    link.download = `${winner}_ticket.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const resetGame = () => {
    setWinner(null)
    setShowTicket(false)
    setShowCutIn(false)
    setInitialResult(null)
    setIsSpinning(false)
    setWinnerIndex(null)
    setShowPushButton(false);
    setShowUpgradeImage1(false);
    setShowUpgradeImage2(false);
    setShowInterlude(false);
    if (drumrollAudioRef.current) {
      drumrollAudioRef.current.pause();
      drumrollAudioRef.current.currentTime = 0;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <audio ref={drumrollAudioRef} src={drumrollAudio || ""} />
      <audio ref={pushButtonAudioRef} src={pushButtonAudio || ""} />
      <audio ref={audioRef1} src={upgradeAudio1 || ""} onEnded={handleAudio1End} />
      <audio ref={interludeAudioRef} src={interludeAudio || ""} onEnded={handleInterludeEnd} />
      <audio ref={audioRef2} src={upgradeAudio2 || ""} onEnded={handleAudio2End} />
      <audio ref={cutinAudioRef} src={cutinAudio || ""} onEnded={handleCutinEnd}/>
      <audio ref={winningAudioRef} src={winningAudio || ""} />
      
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
                    onChange={(e) => handleMediaUpload(e, setCutinMedia, setCutinMediaType, "cutinMedia", "cutinMediaType")}
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
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setCutinMedia, fileInputRef, "cutinMedia", setCutinMediaType, "cutinMediaType")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      {cutinMediaType === "image" ? (
                        <img
                          src={cutinMedia}
                          alt="カットイン画像"
                          className="max-w-full h-32 object-contain mx-auto"
                        />
                      ) : (
                        <video src={cutinMedia} className="max-w-full h-32 object-contain mx-auto" controls />
                      )}
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold my-4 pt-4 border-t">ドラムロール音声の設定</h3>
              <div className="space-y-4">
                <div>
                  <input
                    ref={drumrollFileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.m4a"
                    onChange={(e) => handleAudioUpload(e, setDrumrollAudio, "drumrollAudio")}
                    className="hidden"
                  />
                  <Button onClick={() => drumrollFileInputRef.current?.click()} variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    ドラムロール音声をアップロード
                  </Button>
                </div>
                {drumrollAudio && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 音声ファイルあり ({drumrollDuration.toFixed(2)}秒)
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setDrumrollAudio, drumrollFileInputRef, "drumrollAudio")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <audio src={drumrollAudio} controls className="w-full" />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold my-4 pt-4 border-t">昇格演出の音声・画像設定</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">音声1</label>
                  <input ref={audioFileInputRef1} type="file" accept="audio/*,.mp3,.m4a" onChange={(e) => handleAudioUpload(e, setUpgradeAudio1, "upgradeAudio1")} className="hidden" />
                  <Button onClick={() => audioFileInputRef1.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" /> 音声ファイル1をアップロード
                  </Button>
                </div>
                {upgradeAudio1 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 音声ファイル1あり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setUpgradeAudio1, audioFileInputRef1, "upgradeAudio1")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <audio src={upgradeAudio1} controls className="w-full" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">音声1の画像</label>
                  <input ref={upgradeImage1FileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setUpgradeImage1, "upgradeImage1")} className="hidden" />
                  <Button onClick={() => upgradeImage1FileInputRef.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" /> 画像ファイル1をアップロード
                  </Button>
                </div>
                {upgradeImage1 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 画像あり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setUpgradeImage1, upgradeImage1FileInputRef, "upgradeImage1")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <img src={upgradeImage1} alt="昇格演出画像1プレビュー" className="max-w-full h-32 object-contain mx-auto" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 mt-4 border-t pt-4">
                <label className="text-sm font-medium">中間演出</label>
                <div>
                  <input ref={interludeMediaFileInputRef} type="file" accept="image/*,video/*" onChange={(e) => handleMediaUpload(e, setInterludeMedia, setInterludeMediaType, "interludeMedia", "interludeMediaType")} className="hidden" />
                  <Button onClick={() => interludeMediaFileInputRef.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" /> 中間演出の画像・動画をアップロード
                  </Button>
                </div>
                {interludeMedia && (
                   <div className="space-y-2">
                   <div className="flex items-center justify-between">
                     <span className="text-sm text-muted-foreground">
                       現在の設定: {interludeMediaType === "image" ? "画像" : "動画"}
                     </span>
                     <Button variant="ghost" size="sm" onClick={() => removeAsset(setInterludeMedia, interludeMediaFileInputRef, "interludeMedia", setInterludeMediaType, "interludeMediaType")}>
                       <X className="w-4 h-4" />
                     </Button>
                   </div>
                   <div className="border rounded-lg p-4 bg-muted">
                     {interludeMediaType === "image" ? (
                       <img
                         src={interludeMedia}
                         alt="中間演出プレビュー"
                         className="max-w-full h-32 object-contain mx-auto"
                       />
                     ) : (
                       <video src={interludeMedia} className="max-w-full h-32 object-contain mx-auto" controls />
                     )}
                   </div>
                 </div>
                )}
                <div>
                  <input ref={interludeAudioFileInputRef} type="file" accept="audio/*,.mp3,.m4a" onChange={(e) => handleAudioUpload(e, setInterludeAudio, "interludeAudio")} className="hidden" />
                  <Button onClick={() => interludeAudioFileInputRef.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" /> 中間演出の音声をアップロード
                  </Button>
                </div>
                {interludeAudio && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 音声ファイルあり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setInterludeAudio, interludeAudioFileInputRef, "interludeAudio")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <audio src={interludeAudio} controls className="w-full" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 mt-4 border-t pt-4">
                <div>
                  <label className="text-sm font-medium">音声2</label>
                  <input ref={audioFileInputRef2} type="file" accept="audio/*,.mp3,.m4a" onChange={(e) => handleAudioUpload(e, setUpgradeAudio2, "upgradeAudio2")} className="hidden" />
                  <Button onClick={() => audioFileInputRef2.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" /> 音声ファイル2をアップロード
                  </Button>
                </div>
                {upgradeAudio2 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 音声ファイル2あり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setUpgradeAudio2, audioFileInputRef2, "upgradeAudio2")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <audio src={upgradeAudio2} controls className="w-full" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">音声2の画像</label>
                  <input ref={upgradeImage2FileInputRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setUpgradeImage2, "upgradeImage2")} className="hidden" />
                  <Button onClick={() => upgradeImage2FileInputRef.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" /> 画像ファイル2をアップロード
                  </Button>
                </div>
                {upgradeImage2 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 画像あり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setUpgradeImage2, upgradeImage2FileInputRef, "upgradeImage2")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <img src={upgradeImage2} alt="昇格演出画像2プレビュー" className="max-w-full h-32 object-contain mx-auto" />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold my-4 pt-4 border-t">カットイン再生時の音声設定</h3>
              <div className="space-y-4">
                <div>
                  <input
                    ref={cutinAudioFileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.m4a"
                    onChange={(e) => handleAudioUpload(e, setCutinAudio, "cutinAudio")}
                    className="hidden"
                  />
                  <Button onClick={() => cutinAudioFileInputRef.current?.click()} variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    カットイン用音声をアップロード
                  </Button>
                </div>
                {cutinAudio && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 音声ファイルあり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setCutinAudio, cutinAudioFileInputRef, "cutinAudio")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <audio src={cutinAudio} controls className="w-full" />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold my-4 pt-4 border-t">「押せ！」ボタンの画像・音声設定</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">ボタンの画像</label>
                  <input
                    ref={pushButtonFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setPushButtonImage, "pushButtonImage")}
                    className="hidden"
                  />
                  <Button onClick={() => pushButtonFileInputRef.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    ボタンの画像をアップロード
                  </Button>
                </div>
                {pushButtonImage && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 画像あり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setPushButtonImage, pushButtonFileInputRef, "pushButtonImage")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <img src={pushButtonImage} alt="ボタン画像プレビュー" className="max-w-full h-32 object-contain mx-auto" />
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">ボタン表示時の音声</label>
                  <input
                    ref={pushButtonAudioFileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.m4a"
                    onChange={(e) => handleAudioUpload(e, setPushButtonAudio, "pushButtonAudio")}
                    className="hidden"
                  />
                  <Button onClick={() => pushButtonAudioFileInputRef.current?.click()} variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    ボタンの音声をアップロード
                  </Button>
                </div>
                {pushButtonAudio && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 音声ファイルあり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setPushButtonAudio, pushButtonAudioFileInputRef, "pushButtonAudio")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <audio src={pushButtonAudio} controls className="w-full" />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-semibold my-4 pt-4 border-t">当たり表示時の音声設定</h3>
              <div className="space-y-4">
                <div>
                  <input
                    ref={winningAudioFileInputRef}
                    type="file"
                    accept="audio/*,.mp3,.m4a"
                    onChange={(e) => handleAudioUpload(e, setWinningAudio, "winningAudio")}
                    className="hidden"
                  />
                  <Button onClick={() => winningAudioFileInputRef.current?.click()} variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    当たり用音声をアップロード
                  </Button>
                </div>
                {winningAudio && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        現在の設定: 音声ファイルあり
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeAsset(setWinningAudio, winningAudioFileInputRef, "winningAudio")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted">
                      <audio src={winningAudio} controls className="w-full" />
                    </div>
                  </div>
                )}
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

                {showPushButton && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <button 
                      onClick={handlePushButtonClick}
                      className="w-64 h-64 rounded-full bg-red-600 text-white text-6xl font-bold shadow-2xl border-8 border-white animate-pulse focus:outline-none focus:ring-4 focus:ring-red-400"
                      style={pushButtonImage ? { backgroundImage: `url(${pushButtonImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      {!pushButtonImage && "押せ！"}
                    </button>
                  </div>
                )}

                {showUpgradeImage1 && upgradeImage1 && (
                  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <img src={upgradeImage1} alt="昇格演出画像1" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                {showInterlude && interludeMedia && (
                  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    {interludeMediaType === 'image' ? (
                      <img src={interludeMedia} alt="中間演出" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <video ref={interludeVideoRef} src={interludeMedia} autoPlay muted playsInline onEnded={handleInterludeEnd} className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                )}
                {showUpgradeImage2 && upgradeImage2 && (
                  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <img src={upgradeImage2} alt="昇格演出画像2" className="max-w-full max-h-full object-contain" />
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
                      spinDuration={drumrollDuration}
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
                      <Badge key={index} variant={prize === "食い逃げ券" ? "default" : "secondary"}>
                        {prize} {prize === "食い逃げ券" ? "(1個)" : `(${prizes.filter((p) => p === prize).length}個)`}
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