import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const animationEffects = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  slideDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 25 }
  },
  scale: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  },
  flip: {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 },
    transition: { duration: 0.4 }
  },
  bounce: {
    initial: { scale: 0, y: -100 },
    animate: { scale: 1, y: 0 },
    exit: { scale: 0, y: 100 },
    transition: { type: 'spring', stiffness: 400, damping: 15 }
  },
  rotate: {
    initial: { rotate: 180, scale: 0, opacity: 0 },
    animate: { rotate: 0, scale: 1, opacity: 1 },
    exit: { rotate: -180, scale: 0, opacity: 0 },
    transition: { duration: 0.5 }
  },
  elastic: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { type: 'spring', stiffness: 500, damping: 10 }
  }
}

function App() {
  const [mode, setMode] = useState('countdown') // 'countdown' or 'stopwatch'
  
  // Countdown states
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  
  // Stopwatch states
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false)
  
  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Language state - initialize from localStorage
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('countdownTimerLanguage')
    return savedLanguage || 'en'
  })
  
  // Music state
  const [musicFile, setMusicFile] = useState(null)
  const [musicUrl, setMusicUrl] = useState(null)
  const audioRef = useRef(null)
  
  const intervalRef = useRef(null)

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('countdownTimerLanguage', language)
  }, [language])

  // Translation object
  const translations = {
    en: {
      countdownTimer: 'Countdown Timer',
      stopwatch: 'Stopwatch',
      countdown: 'Countdown',
      minutes: 'Minutes',
      seconds: 'Seconds',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      reset: 'Reset',
      back: 'Back',
      timeUp: "🎉 Time's up!",
      enterFullscreen: 'Enter Fullscreen',
      exitFullscreen: 'Exit Fullscreen',
      selectMusic: 'Select Music'
    },
    vi: {
      countdownTimer: 'Đếm Ngược',
      stopwatch: 'Đồng Hồ Bấm Giờ',
      countdown: 'Đếm Ngược',
      minutes: 'Phút',
      seconds: 'Giây',
      start: 'Bắt Đầu',
      pause: 'Tạm Dừng',
      resume: 'Tiếp Tục',
      reset: 'Đặt Lại',
      back: 'Quay Lại',
      timeUp: '🎉 Hết giờ!',
      enterFullscreen: 'Toàn Màn Hình',
      exitFullscreen: 'Thoát Toàn Màn Hình',
      selectMusic: 'Chọn Nhạc'
    }
  }

  const t = translations[language]

  // Handle music file selection
  const handleMusicSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('audio/')) {
      setMusicFile(file)
      const url = URL.createObjectURL(file)
      setMusicUrl(url)
      
      // Create or update audio element
      if (audioRef.current) {
        audioRef.current.src = url
        audioRef.current.loop = true
      }
    }
  }

  // Control music playback based on timer state
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      if ((mode === 'countdown' && isRunning) || (mode === 'stopwatch' && isStopwatchRunning)) {
        audioRef.current.play().catch(err => console.log('Audio play error:', err))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isRunning, isStopwatchRunning, musicUrl, mode])

  // Cleanup audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (musicUrl) {
        URL.revokeObjectURL(musicUrl)
      }
    }
  }, [musicUrl])

  // Countdown timer effect
  useEffect(() => {
    if (mode === 'countdown' && isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (mode === 'countdown') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [mode, isRunning, timeLeft])

  // Stopwatch effect
  useEffect(() => {
    if (mode === 'stopwatch' && isStopwatchRunning) {
      intervalRef.current = setInterval(() => {
        setStopwatchTime(prev => prev + 1)
      }, 1000)
    } else if (mode === 'stopwatch') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [mode, isStopwatchRunning])

  // Keyboard event handler for spacebar
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if spacebar is pressed and not in an input field
      if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
        event.preventDefault()
        
        if (mode === 'countdown') {
          if (timeLeft === 0 && !isRunning) {
            // Start countdown if in setup state
            startTimer()
          } else if (timeLeft > 0) {
            // Toggle pause/resume if timer is active
            if (isRunning) {
              pauseTimer()
            } else {
              resumeTimer()
            }
          }
        } else if (mode === 'stopwatch') {
          if (stopwatchTime === 0 && !isStopwatchRunning) {
            // Start stopwatch if at 0
            startStopwatch()
          } else {
            // Toggle pause/resume if stopwatch is active
            if (isStopwatchRunning) {
              pauseStopwatch()
            } else {
              resumeStopwatch()
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [mode, isRunning, timeLeft, isStopwatchRunning, stopwatchTime, minutes, seconds])

  const startTimer = () => {
    const totalSeconds = minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds)
      setIsRunning(true)
      setHasStarted(true)
    }
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resumeTimer = () => {
    setIsRunning(true)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
  }

  const backToSetup = () => {
    setIsRunning(false)
    setTimeLeft(0)
    setHasStarted(false)
  }

  // Stopwatch functions
  const startStopwatch = () => {
    setIsStopwatchRunning(true)
  }

  const pauseStopwatch = () => {
    setIsStopwatchRunning(false)
  }

  const resumeStopwatch = () => {
    setIsStopwatchRunning(true)
  }

  const resetStopwatch = () => {
    setIsStopwatchRunning(false)
    setStopwatchTime(0)
  }

  const switchMode = (newMode) => {
    // Reset both timers when switching modes
    setIsRunning(false)
    setIsStopwatchRunning(false)
    setTimeLeft(0)
    setStopwatchTime(0)
    setMode(newMode)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch((err) => {
        console.log('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'vi' : 'en')
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const formatTime = (time) => {
    const m = Math.floor(time / 60)
    const s = time % 60
    return { m, s }
  }

  const displayTime = mode === 'countdown' ? formatTime(timeLeft) : formatTime(stopwatchTime)
  const { m, s } = displayTime
  const effectConfig = animationEffects.flip

  return (
    <div className="app">
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="title">{mode === 'countdown' ? t.countdownTimer : t.stopwatch}</h1>
        
        {/* Mode Selector */}
        <div className="mode-selector">
          <motion.button
            className={`mode-btn ${mode === 'countdown' ? 'active' : ''}`}
            onClick={() => switchMode('countdown')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.countdown}
          </motion.button>
          <motion.button
            className={`mode-btn ${mode === 'stopwatch' ? 'active' : ''}`}
            onClick={() => switchMode('stopwatch')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.stopwatch}
          </motion.button>
        </div>
        
        {mode === 'countdown' ? (
          <>
            {!hasStarted ? (
          <div className="input-section">
            <div className="time-input-group">
              <div className="time-input">
                <label>{t.minutes}</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="time-input">
                <label>{t.seconds}</label>
                <select
                  value={seconds}
                  onChange={(e) => setSeconds(parseInt(e.target.value))}
                  className="time-select"
                >
                  <option value="0">0</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                  <option value="35">35</option>
                  <option value="40">40</option>
                  <option value="45">45</option>
                  <option value="50">50</option>
                  <option value="55">55</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="timer-display">
              <div className="time-units">
                <div className="time-unit">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={m}
                      className="digit-box"
                      {...effectConfig}
                    >
                      {String(m).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  <span className="label">Minutes</span>
                </div>
                <span className="separator">:</span>
                <div className="time-unit">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={s}
                      className="digit-box"
                      {...effectConfig}
                    >
                      {String(s).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  <span className="label">Seconds</span>
                </div>
              </div>
            </div>
            
            {timeLeft === 0 && !isRunning && (
              <motion.div
                className="completion-message"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {t.timeUp}
              </motion.div>
            )}
          </>
        )}

        <div className="controls">
          {!hasStarted || (timeLeft === 0 && !isRunning) ? (
            <>
              <motion.button
                className="btn btn-primary"
                onClick={startTimer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.start}
              </motion.button>
              {hasStarted && (
                <motion.button
                  className="btn btn-secondary"
                  onClick={backToSetup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.back}
                </motion.button>
              )}
            </>
          ) : (
            <>
              {isRunning ? (
                <motion.button
                  className="btn btn-warning"
                  onClick={pauseTimer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.pause}
                </motion.button>
              ) : timeLeft > 0 ? (
                <motion.button
                  className="btn btn-warning"
                  onClick={resumeTimer}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.resume}
                </motion.button>
              ) : null}
              <motion.button
                className="btn btn-secondary"
                onClick={backToSetup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.back}
              </motion.button>
            </>
          )}
        </div>
          </>
        ) : (
          <>
            {/* Stopwatch Display */}
            <div className="timer-display">
              <div className="time-units">
                <div className="time-unit">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={m}
                      className="digit-box"
                      {...effectConfig}
                    >
                      {String(m).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  <span className="label">{t.minutes}</span>
                </div>
                <span className="separator">:</span>
                <div className="time-unit">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={s}
                      className="digit-box"
                      {...effectConfig}
                    >
                      {String(s).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                  <span className="label">{t.seconds}</span>
                </div>
              </div>
            </div>

            <div className="controls">
              {!isStopwatchRunning && stopwatchTime === 0 ? (
                <motion.button
                  className="btn btn-primary"
                  onClick={startStopwatch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.start}
                </motion.button>
              ) : (
                <>
                  <motion.button
                    className="btn btn-warning"
                    onClick={isStopwatchRunning ? pauseStopwatch : resumeStopwatch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isStopwatchRunning ? t.pause : t.resume}
                  </motion.button>
                  <motion.button
                    className="btn btn-danger"
                    onClick={resetStopwatch}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t.reset}
                  </motion.button>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
      
      {/* Language Toggle Button */}
      <motion.button
        className="language-btn"
        onClick={toggleLanguage}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang Tiếng Anh'}
      >
        {language === 'en' ? 'VI' : 'EN'}
      </motion.button>
      
      {/* Music Selection Button */}
      <motion.button
        className="music-btn"
        onClick={() => document.getElementById('music-input').click()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={t.selectMusic}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        {musicFile && <span className="music-indicator"></span>}
      </motion.button>
      <input
        id="music-input"
        type="file"
        accept="audio/*"
        onChange={handleMusicSelect}
        style={{ display: 'none' }}
      />
      
      {/* Audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
      {/* Fullscreen Toggle Button */}
      <motion.button
        className="fullscreen-btn"
        onClick={toggleFullscreen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isFullscreen ? t.exitFullscreen : t.enterFullscreen}
      >
        {isFullscreen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </motion.button>
    </div>
  )
}

export default App
