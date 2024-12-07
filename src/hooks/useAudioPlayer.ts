import { useState, useEffect, useRef } from 'react'

interface Track {
  title: string;
  src: string;
}

export function useAudioPlayer(playlist: Track[]) {
  const [isPlaying, setIsPlaying] = useState(() => {
    const savedIsPlaying = localStorage.getItem('isPlaying');
    return savedIsPlaying ? JSON.parse(savedIsPlaying) : false;
  });

  const [currentTrack, setCurrentTrack] = useState(() => {
    const savedTrack = localStorage.getItem('currentTrack');
    return savedTrack ? parseInt(savedTrack, 10) : 0;
  });

  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('volume');
    return savedVolume ? parseFloat(savedVolume) : 1;
  });

  // Create a ref for the current audio instance
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio(playlist[currentTrack].src);
    audioRef.current.volume = volume;

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []); // Empty dependency array means this only runs once on mount

  // Handle volume changes
  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle play state changes
  useEffect(() => {
    localStorage.setItem('isPlaying', JSON.stringify(isPlaying));
    
    if (!audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("播放失败:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle track changes
  useEffect(() => {
    localStorage.setItem('currentTrack', currentTrack.toString());
    
    if (!audioRef.current) return;

    // Store the current play state
    const wasPlaying = !audioRef.current.paused;
    
    // Pause the current audio before changing the source
    audioRef.current.pause();
    
    // Update the source
    audioRef.current.src = playlist[currentTrack].src;
    
    // If it was playing before, resume playback
    if (wasPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("播放失败:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, playlist]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("播放失败:", error);
            setIsPlaying(false);
          });
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    setCurrentTrack((prevTrack) => (prevTrack + 1) % playlist.length);
  };

  const previousTrack = () => {
    setCurrentTrack((prevTrack) => (prevTrack - 1 + playlist.length) % playlist.length);
  };

  return { isPlaying, currentTrack, volume, togglePlay, nextTrack, previousTrack, setVolume };
}













