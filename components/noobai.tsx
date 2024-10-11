"use client"

import React, { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Sparkles, Battery, Zap, BatteryCharging } from 'lucide-react'

export default function Component() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [batteryLevel, setBatteryLevel] = useState(100)
  // const [glitchLevel, setGlitchLevel] = useState(0) // 删除未使用的状态
  const [clickCount, setClickCount] = useState(0)
  const [isCharging, setIsCharging] = useState(false)
  const robotAnimation = useAnimation()
  const eyeAnimation = useAnimation()

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(0, prev - 1))
      // setGlitchLevel(prev => Math.min(100, prev + 0.5)) // 删除未使用的状态更新
    }, 1000)

    // Animate eyes randomly
    const eyeInterval = setInterval(() => {
      eyeAnimation.start({
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
        transition: { duration: 0.5 }
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(eyeInterval)
    }
  }, [eyeAnimation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (batteryLevel < 10) {
      setOutput("电量不足...无法思考...需要充电...")
      return
    }
    setIsThinking(true)
    setBatteryLevel(prev => Math.max(0, prev - 10))
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, batteryLevel }),
      });
      
      if (!response.ok) {
        throw new Error('API请求失败');
      }
      
      const data = await response.json();
      setOutput(data.response);
    } catch (error) {
      console.error('Error:', error);
      setOutput("哎呀，我的处理器好像出了点问题...能再问一次吗？");
    } finally {
      setIsThinking(false);
    }
  }

  const handleRobotClick = () => {
    setClickCount(prev => prev + 1)
    robotAnimation.start({
      rotate: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    })
    if (clickCount % 5 === 4) {
      setOutput("别戳我啦！我很怕痒的！")
    }
    setBatteryLevel(prev => Math.max(0, prev - 5))
  }

  const handleChargingClick = async () => {
    setIsCharging(true)
    await robotAnimation.start({
      scale: [1, 1.2, 1],
      transition: { duration: 0.5, repeat: 4, repeatType: "reverse" }
    })
    const energyGain = Math.floor(Math.random() * 20) + 10
    setBatteryLevel(prev => Math.min(100, prev + energyGain))
    setOutput(`哇！充电器连接成功！我感觉充满了力量！电量增加了${energyGain}%！`)
    setIsCharging(false)
  }

  const getRobotMood = () => {
    if (batteryLevel > 70) return "normal"
    if (batteryLevel > 40) return "confused"
    if (batteryLevel > 10) return "tired"
    return "dead"
  }

  const getEyeShape = (mood: string) => {
    switch (mood) {
      case "normal":
        return "M5 10 Q10 15 15 10"
      case "confused":
        return "M5 10 Q10 5 15 10"
      case "tired":
        return "M5 12 Q10 8 15 12"
      case "dead":
        return "M5 10 L15 10"
      default:
        return "M5 10 Q10 15 15 10"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-yellow-200 rounded-full opacity-50"
          style={{
            width: Math.random() * 5 + 2,
            height: Math.random() * 5 + 2,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl shadow-lg p-6 space-y-6 relative z-10"
      >
        <div className="flex justify-between items-center mb-4">
          <motion.div
            animate={robotAnimation}
            className="cursor-pointer relative"
            onClick={handleChargingClick}
            whileHover={{ scale: 1.2 }}
          >
            <BatteryCharging className="w-8 h-8 text-green-400" />
            {isCharging && (
              <motion.div
                className="absolute inset-0 border-2 border-yellow-300 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.div>
          <h1 className="text-3xl font-bold text-center text-yellow-300">迷糊机器人</h1>
          <div className="flex items-center space-x-2">
            <Battery className={`w-6 h-6 ${batteryLevel > 50 ? 'text-green-400' : batteryLevel > 20 ? 'text-yellow-400' : 'text-red-400'}`} />
            <span className="text-white">{batteryLevel}%</span>
          </div>
        </div>
        <motion.div
          animate={robotAnimation}
          style={{
            opacity: 0.5 + batteryLevel / 200,
          }}
          className="w-48 h-48 mx-auto bg-gray-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer relative"
          onClick={handleRobotClick}
          whileHover={{ scale: 1.1 }}
        >
          {/* Robot face */}
          <div className="absolute inset-2 bg-gray-400 rounded-full flex items-center justify-center">
            <div className="relative w-36 h-36 bg-gray-600 rounded-full flex items-center justify-center">
              {/* Eyes */}
              <motion.svg animate={eyeAnimation} className="absolute" width="100" height="100" viewBox="0 0 100 100">
                <path d={getEyeShape(getRobotMood())} stroke="white" strokeWidth="3" fill="none" />
                <path d={getEyeShape(getRobotMood())} stroke="white" strokeWidth="3" fill="none" transform="translate(50, 0)" />
              </motion.svg>
            </div>
          </div>
          {/* Antenna */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-2 h-8 bg-gray-500 rounded-full">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问我任何问题..."
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button
            type="submit"
            className={`w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors duration-200 flex items-center justify-center ${batteryLevel < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isThinking || batteryLevel < 10}
          >
            {isThinking ? (
              <Zap className="w-5 h-5 mr-2 animate-pulse" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {isThinking ? "思考中..." : "获取迷糊回答"}
          </button>
        </form>
        <div className="bg-gray-700 bg-opacity-50 rounded-md p-4 min-h-[100px] relative">
          {isThinking ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </motion.div>
          ) : (
            <p className="text-white">{output}</p>
          )}
        </div>
        <motion.div
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-sm text-gray-400 text-center"
        >
          {batteryLevel < 20 ? "电池电量严重不足...急需充电..." : 
           batteryLevel < 50 ? "电池电量低...记忆单元故障..." : 
           "孤独星球的日子还在继续..."}
        </motion.div>
      </motion.div>
    </div>
  )
}