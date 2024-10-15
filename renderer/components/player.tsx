import styles from '../styles/components/player.module.css';
import { PluginVersion } from '@studiorack/core';
import Script from 'next/script';
import { getBasePath } from '../lib/path';

type PlayerProps = {
  plugin: PluginVersion;
};

const Player = ({ plugin }: PlayerProps) => {
  // Prototype of embedded sfz web player.
  // There are better ways to do this.
  const loadSfzPlayer = (event: React.MouseEvent) => {
    const el = document.getElementById('sfzPlayer');
    if (!el) return;
    if (el.className === 'open') {
      el.className = '';
      return;
    }
    const name = (event.currentTarget as HTMLTextAreaElement).getAttribute('data-name') || '';
    const id = (event.currentTarget as HTMLTextAreaElement).getAttribute('data-id') || '';
    console.log('loadSfzPlayer', name, id);
    el.innerHTML = '';
    new window.Sfz.Player('sfzPlayer', {
      audio: {},
      instrument: { name, id },
      interface: {},
    });
    window.setTimeout(() => {
      el.className = 'open';
    }, 0);
  };

  return (
    <div>
      <img
        className={styles.player}
        data-name={plugin.name}
        data-id={plugin.id}
        src={`${getBasePath()}/images/sfz-player.png`}
        alt="open in sfz player"
        loading="lazy"
        onClick={loadSfzPlayer}
      />
      <Script
        strategy="beforeInteractive"
        id="webaudio-controls-config"
      >{`window.WebAudioControlsOptions = { useMidi: 1 };`}</Script>
      <Script
        strategy="beforeInteractive"
        src="https://github.com/kmturley/webaudio-controls/releases/download/v1.0.0/webaudio-controls.min.js"
      />
      <Script strategy="beforeInteractive" src="https://sfzlab.github.io/sfz-web-player/sfz.min.js" />
    </div>
  );
};

export default Player;
