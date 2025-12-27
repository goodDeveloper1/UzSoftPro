"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, X, ChevronLeft, ChevronRight, Send, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Video {
  id: number
  title: string
  description: string
  video_url: string
  thumbnail: string
  category: string
  duration: number
  views: number
  created_at: string
}

interface Comment {
  id: number
  video_id: number
  comment: string
  author_name: string
  created_at: string
}

export function VideosSection() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchVideos()
    deleteOldVideos()
  }, [])

  useEffect(() => {
    if (showFullscreen && videoRef.current) {
      videoRef.current.play().catch(console.error)
      setIsPlaying(true)
      startProgressTracking()
    } else {
      stopProgressTracking()
    }
    return () => stopProgressTracking()
  }, [showFullscreen, currentVideoIndex])

  useEffect(() => {
    if (showFullscreen && videos[currentVideoIndex]) {
      fetchComments(videos[currentVideoIndex].id)
    }
  }, [showFullscreen, currentVideoIndex, videos])

  useEffect(() => {
    if (showComments && commentsEndRef.current) {
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [comments, showComments])

  const startProgressTracking = () => {
    stopProgressTracking()
    if (videoRef.current && videos[currentVideoIndex]) {
      progressIntervalRef.current = setInterval(() => {
        if (videoRef.current) {
          const current = videoRef.current.currentTime
          const duration = videoRef.current.duration || videos[currentVideoIndex]?.duration || 30
          setProgress((current / duration) * 100)
        }
      }, 100)
    }
  }

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  const deleteOldVideos = async () => {
    try {
      await fetch("/api/videos/cleanup", { method: "POST" })
      fetchVideos()
    } catch (error) {
      console.error("Failed to cleanup old videos:", error)
    }
  }

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos")
      const data = await response.json()
      if (data.success) {
        const now = new Date()
        const filteredVideos = data.data.filter((video: Video) => {
          const videoDate = new Date(video.created_at)
          const hoursDiff = (now.getTime() - videoDate.getTime()) / (1000 * 60 * 60)
          return hoursDiff < 24
        })
        setVideos(filteredVideos)
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchComments = async (videoId: number) => {
    try {
      const response = await fetch(`/api/videos/comments?video_id=${videoId}`)
      const data = await response.json()
      if (data.success) {
        setComments(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !videos[currentVideoIndex]) return

    const commentText = newComment.trim()
    setIsSubmittingComment(true)
    try {
      const response = await fetch("/api/videos/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: videos[currentVideoIndex].id,
          comment: commentText,
          author_name: "Anonim",
        }),
      })
      const data = await response.json()
      if (data.success) {
        const tempComment: Comment = {
          id: data.data.id,
          video_id: videos[currentVideoIndex].id,
          comment: commentText,
          author_name: "Anonim",
          created_at: new Date().toISOString(),
        }
        setComments([tempComment, ...comments])
        setNewComment("")
        setTimeout(() => {
          commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        alert(data.error || "Comment yuborishda xatolik")
      }
    } catch (error) {
      console.error("Failed to submit comment:", error)
      alert("Comment yuborishda xatolik yuz berdi")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        stopProgressTracking()
      } else {
        videoRef.current.play()
        startProgressTracking()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleNext = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
      setIsPlaying(false)
      setShowComments(false)
      setProgress(0)
    } else {
      setShowFullscreen(false)
      setIsPlaying(false)
      setShowComments(false)
    }
  }

  const handlePrev = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
      setIsPlaying(false)
      setShowComments(false)
      setProgress(0)
    }
  }

  const handleVideoEnd = () => {
    handleNext()
  }

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return "hozir"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`
    return `${Math.floor(diffInSeconds / 86400)} kun oldin`
  }

  // Keyboard navigation
  useEffect(() => {
    if (!showFullscreen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === " ") {
        e.preventDefault()
        handlePlayPause()
      }
      if (e.key === "Escape") {
        setShowFullscreen(false)
        setShowComments(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showFullscreen, currentVideoIndex, isPlaying])

  if (isLoading) {
    return (
      <section id="videos" className="sticky top-[88px] z-[100] bg-black/95 backdrop-blur-md border-b border-white/10 py-3 -mx-4 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center text-muted-foreground text-sm">Yuklanmoqda...</div>
        </div>
      </section>
    )
  }

  if (videos.length === 0) {
    return null
  }

  const currentVideo = videos[currentVideoIndex]

  return (
    <>
      <section id="videos" className="sticky top-[88px] z-[100] bg-black/95 backdrop-blur-md border-b border-white/10 py-3 -mx-4 px-4 mb-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {videos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => {
                  setCurrentVideoIndex(index)
                  setShowFullscreen(true)
                  setProgress(0)
                }}
                className="flex-shrink-0 cursor-pointer group"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-r from-[#e78a53] via-[#ec4899] to-[#8b5cf6] p-0.5 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#e78a53]/20 to-[#8b5cf6]/20">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs text-center text-white/70 max-w-[80px] truncate">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Video Modal - Menu tagida */}
      <AnimatePresence>
        {showFullscreen && currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={containerRef}
            className="fixed inset-0 z-[50] bg-black flex items-center justify-center"
            onClick={(e) => {
              if (e.target === containerRef.current) {
                setShowFullscreen(false)
                setIsPlaying(false)
                setShowComments(false)
                stopProgressTracking()
              }
            }}
          >
            <div className="relative w-full h-full max-w-md mx-auto flex items-center">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowFullscreen(false)
                  setIsPlaying(false)
                  setShowComments(false)
                  stopProgressTracking()
                  if (videoRef.current) {
                    videoRef.current.pause()
                  }
                }}
                className="absolute top-4 right-4 z-[60] w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Navigation Arrows */}
              {currentVideoIndex > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 z-[60] w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-all duration-200 hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {currentVideoIndex < videos.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 z-[60] w-12 h-12 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-all duration-200 hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Video Container */}
              <div className="relative w-full aspect-[9/16] max-h-[90vh] bg-black rounded-lg overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={currentVideo.video_url}
                  className="w-full h-full object-contain"
                  loop={false}
                  muted={isMuted}
                  playsInline
                  onPlay={() => {
                    setIsPlaying(true)
                    startProgressTracking()
                  }}
                  onPause={() => {
                    setIsPlaying(false)
                    stopProgressTracking()
                  }}
                  onEnded={handleVideoEnd}
                  onTimeUpdate={() => {
                    if (videoRef.current) {
                      const current = videoRef.current.currentTime
                      const duration = videoRef.current.duration || currentVideo.duration || 30
                      setProgress((current / duration) * 100)
                    }
                  }}
                />

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#e78a53] via-[#ec4899] to-[#8b5cf6]"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Video Info Overlay */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 pt-12 z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="text-white font-semibold text-lg truncate">{currentVideo.title}</h3>
                      <p className="text-white/70 text-sm">{currentVideo.category}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setShowComments(!showComments)}
                        className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-all duration-200 hover:scale-110 relative"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {comments.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#e78a53] text-white text-xs flex items-center justify-center font-bold border-2 border-black">
                            {comments.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={handleMute}
                        className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-all duration-200 hover:scale-110"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pb-6 z-20">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={handlePlayPause}
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                    </button>
                  </div>
                  {currentVideo.description && (
                    <p className="text-white text-sm mb-3 line-clamp-2">{currentVideo.description}</p>
                  )}
                  <div className="flex items-center justify-between text-white/80 text-xs">
                    <span>{currentVideo.views} ko'rish</span>
                    {currentVideo.duration && <span>{formatTime(currentVideo.duration)}</span>}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal - Alohida Modal, Video modal ustida */}
      <AnimatePresence>
        {showFullscreen && showComments && currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={() => setShowComments(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full md:w-96 bg-black/95 backdrop-blur-md border-l border-white/10 overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/90 backdrop-blur-sm sticky top-0 z-10">
                <h4 className="text-white font-semibold text-lg">Commentlar ({comments.length})</h4>
                <button
                  onClick={() => setShowComments(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence>
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/50 text-sm">Hozircha commentlar yo'q</p>
                    </div>
                  ) : (
                    comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ delay: index * 0.05, type: "spring", damping: 20, stiffness: 300 }}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e78a53] to-[#8b5cf6] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-white font-semibold text-sm">{comment.author_name}</span>
                              <span className="text-white/40 text-xs">•</span>
                              <span className="text-white/50 text-xs">{formatTimeAgo(comment.created_at)}</span>
                            </div>
                            <p className="text-white/90 text-sm leading-relaxed break-words">{comment.comment}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                <div ref={commentsEndRef} />
              </div>
              <div className="p-4 border-t border-white/10 bg-black/95 backdrop-blur-sm sticky bottom-0 z-10">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmitComment()
                      }
                    }}
                    placeholder="Comment yozing..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#e78a53] focus:ring-2 focus:ring-[#e78a53]/30 text-sm transition-all"
                    disabled={isSubmittingComment}
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="w-11 h-11 rounded-full bg-[#e78a53] hover:bg-[#e78a53]/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shrink-0 shadow-lg shadow-[#e78a53]/30 hover:shadow-[#e78a53]/50"
                  >
                    {isSubmittingComment ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
