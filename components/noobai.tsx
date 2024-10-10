"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Component() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsThinking(true)
    setTimeout(() => {
      setOutput(`这是一个荒诞的回答：${input.split('').reverse().join('')}`)
      setIsThinking(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-6 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-white">荒诞AI助手</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="w-full px-4 py-2 rounded-md bg-white bg-opacity-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            获取荒诞回答
          </button>
        </form>
        <div className="bg-white bg-opacity-50 rounded-md p-4 min-h-[100px] relative">
          {isThinking ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-purple-600" />
            </motion.div>
          ) : (
            <p className="text-gray-800">{output}</p>
          )}
        </div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-4 right-4"
        >
          <span className="text-4xl">🤪</span>
        </motion.div>
      </motion.div>
    </div>
  )
}