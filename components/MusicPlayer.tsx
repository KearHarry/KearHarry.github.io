
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, ListMusic, Volume2, VolumeX, Repeat, ChevronUp, Music, Repeat1, Shuffle } from 'lucide-react';
import { MUSIC_TRACKS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface MusicPlayerProps {
  autoPlay?: boolean;
  userInteracted?: boolean;
}

type PlayMode = 'sequence' | 'loop_all' | 'loop_one' | 'shuffle';

const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoPlay = false, userInteracted = false }) => {
  const { t } = useLanguage();
  // UI State
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>('loop_all');
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  // Progress State
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  
  // 使用 Ref 来即时跟踪拖拽状态，解决 React 状态更新延迟导致的进度条跳动
  const isDraggingRef = useRef(false);

  // Volume State
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  // 格式化时间 mm:ss
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 1. 自动播放逻辑
  useEffect(() => {
    if (autoPlay && userInteracted && !isPlaying && audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((e) => console.log("自动播放等待交互", e));
    }
  }, [autoPlay, userInteracted]);

  // 2. 音量控制
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 3. 切歌逻辑
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const playAudio = async () => {
      try {
        if (currentTrack.url !== audio.src && !audio.src.endsWith(currentTrack.url)) {
            audio.src = currentTrack.url;
            audio.load();
        }
        
        if (isPlaying) {
          await audio.play();
        }
      } catch (err) {
        console.error("播放错误", err);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [currentTrackIndex, currentTrack.url]);

  // 监听播放/暂停状态变化
  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlaying) audio.play().catch(() => setIsPlaying(false));
      else audio.pause();
  }, [isPlaying]);


  // 4. 进度条更新逻辑
  const handleTimeUpdate = () => {
    // 关键修复：拖拽时完全忽略 audio 的时间更新，防止滑块跳动
    if (audioRef.current && !isDraggingRef.current) {
      const curr = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(curr);
      setDuration(dur || 0);
      setSliderValue(curr); 
    }
  };

  const handleSeekStart = () => {
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setSliderValue(val);
    // 实时更新显示时间，增强交互感
    setCurrentTime(val);
  };

  // 修复：使用 onPointerUp 并增加稳健性检查，防止拖拽重置
  const handleSeekEnd = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const val = Number(e.currentTarget.value);
    
    if (audioRef.current && Number.isFinite(val)) {
        audioRef.current.currentTime = val;
        setSliderValue(val);
        setCurrentTime(val);
    }
    
    // 延迟解锁，防止 onTimeUpdate 立即覆盖导致跳动
    setTimeout(() => {
        isDraggingRef.current = false;
        setIsDragging(false);
    }, 200);
  };

  // 播放模式切换逻辑
  const togglePlayMode = () => {
    const modes: PlayMode[] = ['sequence', 'loop_all', 'loop_one', 'shuffle'];
    const nextIndex = (modes.indexOf(playMode) + 1) % modes.length;
    setPlayMode(modes[nextIndex]);
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'sequence': return <ListMusic size={18} className="text-gray-400" />;
      case 'loop_all': return <Repeat size={18} className="text-blue-400" />;
      case 'loop_one': return <Repeat1 size={18} className="text-blue-400" />;
      case 'shuffle': return <Shuffle size={18} className="text-purple-400" />;
    }
  };

  const getPlayModeTitle = () => {
    switch (playMode) {
      case 'sequence': return t('music.mode_sequence');
      case 'loop_all': return t('music.mode_loop_all');
      case 'loop_one': return t('music.mode_loop_one');
      case 'shuffle': return t('music.mode_shuffle');
    }
  };

  // 自动播放下一首
  const handleEnded = () => {
    if (playMode === 'loop_one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (playMode === 'shuffle') {
      let nextIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
      while (nextIndex === currentTrackIndex && MUSIC_TRACKS.length > 1) {
        nextIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
      }
      setCurrentTrackIndex(nextIndex);
      setIsPlaying(true);
    } else {
      // Sequence & Loop All
      const isLastTrack = currentTrackIndex === MUSIC_TRACKS.length - 1;
      if (playMode === 'sequence' && isLastTrack) {
        setIsPlaying(false);
      } else {
        nextTrack();
      }
    }
  };

  const nextTrack = () => {
    if (playMode === 'shuffle') {
      let nextIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
    }
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (playMode === 'shuffle') {
      let nextIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    }
    setIsPlaying(true);
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        onTimeUpdate={handleTimeUpdate} 
        onEnded={handleEnded}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        preload="auto"
      />

      {/* 
          Container Positioning:
          Starts after sidebar (left-0 md:left-64 lg:left-72).
          Using pointer-events-none on the container to allow clicks to pass through empty areas.
      */}
      <div className="fixed bottom-0 z-50 left-0 md:left-64 lg:left-72 right-0 pointer-events-none flex flex-col justify-end">
        
        {/* 
            Alignment Wrapper:
            Strictly matches the main content layout (max-w-6xl mx-auto px-4...).
            This ensures the player aligns perfectly with the article list.
        */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-12 relative">
            
            {/* 触发器 (Trigger Button) - Centered relative to the player content */}
            <div 
                className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2
                    transition-all duration-500 transform cursor-pointer z-40 pb-2 pointer-events-auto
                    ${isHovered ? 'translate-y-full opacity-0' : '-translate-y-0 opacity-100'}
                `}
                onMouseEnter={() => setIsHovered(true)}
            >
                <div className="bg-[#3a3a3c]/80 backdrop-blur-md border border-white/10 shadow-lg text-gray-200 px-6 py-1.5 rounded-t-xl flex items-center gap-2 hover:bg-[#48484a] hover:text-white transition-colors whitespace-nowrap">
                    <Music size={14} />
                    <span className="text-xs font-bold tracking-wide">{t('music.label')}</span>
                    <ChevronUp size={16} className="animate-bounce" />
                </div>
            </div>

            {/* 播放器主体 (Player Body) */}
            <div 
                className={`
                    pointer-events-auto w-full
                    bg-[#3a3a3c]/95 backdrop-blur-xl border border-white/5 text-white shadow-[0_-8px_40px_rgba(0,0,0,0.3)] rounded-t-2xl overflow-visible relative
                    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-[calc(100%-0px)] opacity-100'}
                `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Reduced padding from px-6 to px-4 to maximize internal space */}
                <div className="h-[96px] px-4 flex items-center justify-between gap-4">
                    
                    {/* Left: Info & Rotating Icon - Reduced width to 15% (min 140px) to give center more room */}
                    <div className="flex items-center gap-4 w-[15%] min-w-[140px]">
                        {/* Rotating Music Note Icon */}
                        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
                             <div className={`
                                w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-[#1c1c1e] shadow-lg flex items-center justify-center border border-white/10
                                ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}
                             `}>
                                <Music size={20} className="text-gray-300 drop-shadow-sm" />
                             </div>
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold truncate text-gray-100">{currentTrack.title}</span>
                            <span className="text-xs text-gray-400 truncate">{currentTrack.artist}</span>
                        </div>
                    </div>

                    {/* Center: Controls & Progress - Flex-1 allows it to take all remaining space */}
                    <div className="flex flex-col items-center justify-center flex-1 max-w-4xl px-4">
                        {/* Control Buttons */}
                        <div className="flex items-center gap-6 mb-2">
                            <button onClick={prevTrack} className="text-gray-400 hover:text-white transition-colors" title="上一首">
                                <SkipBack size={24} fill="currentColor" />
                            </button>
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform active:scale-95 shadow-lg"
                                title={isPlaying ? "暂停" : "播放"}
                            >
                                {isPlaying ? (
                                    <Pause size={20} fill="currentColor" /> 
                                ) : (
                                    <Play size={20} fill="currentColor" className="ml-0.5" />
                                )}
                            </button>
                            <button onClick={nextTrack} className="text-gray-400 hover:text-white transition-colors" title="下一首">
                                <SkipForward size={24} fill="currentColor" />
                            </button>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full flex items-center gap-3 text-xs font-medium text-gray-400 font-mono select-none">
                            <span className="w-10 text-right">{formatTime(isDragging ? sliderValue : currentTime)}</span>
                            <div className="relative flex-1 h-1 bg-white/10 rounded-full group cursor-pointer py-1.5 flex items-center">
                                {/* Track Background */}
                                <div className="absolute left-0 w-full h-1 bg-white/10 rounded-full pointer-events-none" />
                                
                                {/* Progress Fill - Apple Blue Style */}
                                <div 
                                    className="absolute left-0 h-1 bg-[#0071E3] rounded-full transition-all pointer-events-none"
                                    style={{ width: `${duration ? (sliderValue / duration) * 100 : 0}%` }}
                                />
                                
                                {/* Knob */}
                                <div 
                                    className={`absolute w-4 h-4 bg-white rounded-full shadow-md transition-transform pointer-events-none ${isDragging ? 'scale-110' : 'scale-100'}`}
                                    style={{ left: `${duration ? (sliderValue / duration) * 100 : 0}%`, transform: 'translateX(-50%)' }}
                                />
                                
                                <input 
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    step="0.1"
                                    value={sliderValue}
                                    onPointerDown={handleSeekStart}
                                    onChange={handleSeekChange}
                                    onPointerUp={handleSeekEnd}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                            </div>
                            <span className="w-10">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Right: Volume & Tools - Reduced width to 15% (min 140px) */}
                    <div className="flex items-center justify-end gap-3 w-[15%] min-w-[140px]">
                        <button 
                          onClick={togglePlayMode} 
                          className="text-gray-400 hover:text-white transition-colors p-2" 
                          title={`切换模式: ${getPlayModeTitle()}`}
                        >
                            {getPlayModeIcon()}
                        </button>
                        
                        {/* Volume Control */}
                        <div 
                            className="relative flex items-center gap-2 group"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <button 
                                onClick={() => setIsMuted(!isMuted)}
                                className="text-gray-400 hover:text-white p-2"
                                title="音量"
                            >
                                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            
                            {/* Volume Slider */}
                            <div className={`flex items-center w-20 transition-all duration-300 ${showVolumeSlider ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                                <div className="relative w-full h-1 bg-gray-600 rounded-full">
                                    <div 
                                        className="absolute left-0 h-full bg-gray-300 rounded-full"
                                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                                    />
                                    <input 
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={isMuted ? 0 : volume}
                                        onChange={(e) => {
                                            setVolume(Number(e.target.value));
                                            setIsMuted(false);
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-px h-5 bg-white/10 mx-1"></div>

                        <button 
                            onClick={() => setShowPlaylist(!showPlaylist)}
                            className={`p-2 rounded-md transition-colors ${showPlaylist ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                            title={t('music.playlist')}
                        >
                            <ListMusic size={18} />
                        </button>
                    </div>
                </div>

                {/* Playlist Popup */}
                {showPlaylist && (
                    <div className="absolute bottom-[calc(100%)] right-0 w-72 bg-[#3a3a3c]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 animate-slide-up max-h-[300px] overflow-y-auto mb-2">
                        <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-[#3a3a3c]/95 backdrop-blur-md z-10 border-b border-white/5 mb-1">
                            {t('music.playlist')}
                        </div>
                        <ul className="space-y-1">
                            {MUSIC_TRACKS.map((track, idx) => (
                                <li 
                                    key={idx}
                                    onClick={() => {
                                        setCurrentTrackIndex(idx);
                                        setIsPlaying(true);
                                    }}
                                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group ${currentTrackIndex === idx ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                >
                                    <div className="flex flex-col overflow-hidden">
                                        <span className={`text-sm truncate ${currentTrackIndex === idx ? 'text-blue-400 font-medium' : 'text-gray-200 group-hover:text-white'}`}>
                                            {track.title}
                                        </span>
                                        <span className="text-xs text-gray-500 truncate">{track.artist}</span>
                                    </div>
                                    {currentTrackIndex === idx && (
                                        <div className="flex gap-0.5 items-end h-3">
                                            <div className="w-0.5 bg-blue-500 animate-[bounce_1s_infinite] h-2"></div>
                                            <div className="w-0.5 bg-blue-500 animate-[bounce_1.2s_infinite] h-3"></div>
                                            <div className="w-0.5 bg-blue-500 animate-[bounce_0.8s_infinite] h-1.5"></div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
