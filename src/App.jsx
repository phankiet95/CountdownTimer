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
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const startTimer = () => {
    const totalSeconds = minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds)
      setIsRunning(true)
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

  const formatTime = (time) => {
    const m = Math.floor(time / 60)
    const s = time % 60
    return { m, s }
  }

  const { m, s } = formatTime(timeLeft)
  const effectConfig = animationEffects.flip

  return (
    <div className="app">
      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="title">Countdown Timer</h1>
        
        {!isRunning && timeLeft === 0 ? (
          <div className="input-section">
            <div className="time-input-group">
              <div className="time-input">
                <label>Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
              <div className="time-input">
                <label>Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                />
              </div>
            </div>
          </div>
        ) : (
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
        )}

        <div className="controls">
          {!isRunning && timeLeft === 0 ? (
            <motion.button
              className="btn btn-primary"
              onClick={startTimer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start
            </motion.button>
          ) : (
            <>
              <motion.button
                className="btn btn-warning"
                onClick={isRunning ? pauseTimer : resumeTimer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRunning ? 'Pause' : 'Resume'}
              </motion.button>
              <motion.button
                className="btn btn-danger"
                onClick={resetTimer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reset
              </motion.button>
            </>
          )}
        </div>

        {timeLeft === 0 && isRunning === false && (minutes > 0 || seconds > 0) && (
          <motion.div
            className="completion-message"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🎉 Time's up!
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default App
