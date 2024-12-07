import React from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useAudioPlayer } from './useAudioPlayer'

const playlist = [
  { title: '交换余生', src: '/music/林俊杰 - 交换余生.flac' },
  { title: '春日影', src: '/music/春日影.flac' },
  { title: '我心危op2', src: '/music/我心危op2.flac' },
]

export function MusicPlayer() {
  const { isPlaying, currentTrack, volume, togglePlay, nextTrack, previousTrack, setVolume } = useAudioPlayer(playlist)

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={previousTrack}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="上一首"
      >
        <SkipBack className="h-4 w-4" />
      </button>
      <button
        onClick={togglePlay}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label={isPlaying ? "暂停" : "播放"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <button
        onClick={nextTrack}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="下一首"
      >
        <SkipForward className="h-4 w-4" />
      </button>
      <div className="flex items-center">
        <Volume2 className="h-4 w-4 mr-2" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-20"
          aria-label="音量"
        />
      </div>
      <span className="text-sm">
        {isPlaying ? `正在播放: ${playlist[currentTrack].title}` : `当前曲目: ${playlist[currentTrack].title}`}
      </span>
    </div>
  )
}











