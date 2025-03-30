import { useRouter } from 'next/router';
import styles from '../styles/components/filters.module.css';
import MultiSelect from './multi-select';
import { ChangeEvent } from 'react';
import {
  licenses,
  pluginCategoryInstruments,
  PluginCategoryOption,
  PluginType,
  pluginTypes,
  presetTypes,
  ProjectFormatOption,
  projectFormats,
  projectTypes,
  RegistryType,
  systemTypes,
} from '@open-audio-stack/core';
import { pluginCategoryEffects } from '@open-audio-stack/core';
import { getParam } from '../lib/plugin';

type FiltersProps = {
  section: RegistryType;
};

const Filters = ({ section }: FiltersProps) => {
  const router = useRouter();
  const type = getParam(router, 'type');
  const search = getParam(router, 'search');
  let categories: PluginCategoryOption[] | ProjectFormatOption[] =
    type && type[0] === PluginType.Effect ? pluginCategoryEffects : pluginCategoryInstruments;
  let types;
  // TODO move this logic to parent
  if (section === RegistryType.Plugins) {
    types = pluginTypes;
  } else if (section === RegistryType.Presets) {
    types = presetTypes;
  } else {
    categories = projectFormats;
    types = projectTypes;
  }
  const onSearch = (event: ChangeEvent) => {
    const el: HTMLInputElement = event.target as HTMLInputElement;
    router.query['search'] = el.value ? el.value.toLowerCase() : '';
    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  };

  return (
    <div className={styles.filters}>
      <span className={styles.filtersTitle}>Filter by:</span>
      <MultiSelect label="Type" items={types}></MultiSelect>
      <MultiSelect label="Category" items={categories}></MultiSelect>
      <MultiSelect label="System" items={systemTypes}></MultiSelect>
      <MultiSelect label="License" items={licenses}></MultiSelect>
      <input
        className={styles.filtersSearch}
        placeholder="Keyword"
        type="search"
        id="search"
        name="search"
        value={search}
        onChange={onSearch}
      />
    </div>
  );
};

export default Filters;
