import React, { useState } from 'react'

interface PlaylistManagerProps {
  playlist: string[]
  onPlaylistChange: (newPlaylist: string[]) => void
}

export function PlaylistManager({ playlist, onPlaylistChange }: PlaylistManagerProps) {
  const [newTrack, setNewTrack] = useState('')

  const addTrack = () => {
    if (newTrack) {
      onPlaylistChange([...playlist, newTrack])
      setNewTrack('')
    }
  }

  const removeTrack = (index: number) => {
    const newPlaylist = playlist.filter((_, i) => i !== index)
    onPlaylistChange(newPlaylist)
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">播放列表管理</h3>
      <div className="flex mb-2">
        <input
          type="text"
          value={newTrack}
          onChange={(e) => setNewTrack(e.target.value)}
          placeholder="输入新音乐文件路径"
          className="flex-grow px-2 py-1 border rounded-l"
        />
        <button
          onClick={addTrack}
          className="px-4 py-1 bg-blue-500 text-white rounded-r hover:bg-blue-600"
        >
          添加
        </button>
      </div>
      <ul className="space-y-2">
        {playlist.map((track, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{track}</span>
            <button
              onClick={() => removeTrack(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

