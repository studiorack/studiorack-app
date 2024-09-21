import { getBasePath } from '../lib/path';
import { PluginVersion } from '@studiorack/core';

type DependencyProps = {
  plugin: PluginVersion;
};

const Dependency = ({ plugin }: DependencyProps) => {
  if (plugin.tags.includes('sfz')) {
    return (
      <span>
        {' '}
        (This instrument needs to be loaded into a{' '}
        <a href={`${getBasePath()}/instruments/sfztools/sfizz`} target="_blank">
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
        <a href={`${getBasePath()}/instruments/studiorack/juicysf`} target="_blank">
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
