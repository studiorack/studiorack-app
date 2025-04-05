import { useState } from 'react';
import { getBasePath } from '../lib/path';
import styles from '../styles/components/audio.module.css';

type AudioProps = {
  file: string;
};

const Audio = ({ file }: AudioProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => {
    const el = document.getElementById('audio') as HTMLAudioElement;
    if (el.paused) {
      el.removeEventListener('ended', ended);
      el.addEventListener('ended', ended);
      el.currentTime = 0;
      el.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    const el = document.getElementById('audio') as HTMLAudioElement;
    if (!el.paused) {
      el.pause();
      setIsPlaying(false);
    }
  };

  const ended = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      {isPlaying ? (
        <img className={styles.audio} src={`${getBasePath()}/images/icon-pause.svg`} alt="Pause" onClick={pause} />
      ) : (
        <img className={styles.audio} src={`${getBasePath()}/images/icon-play.svg`} alt="Play" onClick={play} />
      )}
      <audio src={file} id="audio">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Audio;
