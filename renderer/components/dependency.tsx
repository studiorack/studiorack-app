import { PackageVersion } from '@open-audio-stack/core';
import { getBasePath } from '../lib/path';

type DependencyProps = {
  plugin: PackageVersion;
};

const Dependency = ({ plugin }: DependencyProps) => {
  if (plugin.tags.includes('sfz')) {
    return (
      <span>
        {' '}
        (This instrument needs to be loaded into a{' '}
        <a href={`${getBasePath()}/plugins/sfztools/sfizz`} target="_blank">
          SFZ player
        </a>
        )
      </span>
    );
  } else if (plugin.tags.includes('sf2')) {
    return (
      <span>
        {' '}
        (This instrument needs to be loaded into a{' '}
        <a href={`${getBasePath()}/plugins/birch-san/juicysfplugin`} target="_blank">
          SoundFont 2 player
        </a>
        )
      </span>
    );
  } else {
    return <span />;
  }
};

export default Dependency;
