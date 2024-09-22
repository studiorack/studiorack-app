import styles from '../styles/components/list.module.css';
import {
  PluginVersion,
  PluginVersionLocal,
  PluginTypes,
  ProjectTypes,
  ProjectVersion,
  ProjectVersionLocal,
} from '@studiorack/core';
import Header from './header';
import Card from './card';
import Filters from './filters';
import Crumb from './crumb';
import Tabs from './tabs';

type ListProps = {
  filters?: boolean;
  items: ListItem[];
  type: string;
  tabs?: PluginTypes | ProjectTypes;
  title: string;
};

type ListItem = PluginVersion | PluginVersionLocal | ProjectVersion | ProjectVersionLocal;

const List = ({ filters = true, items, type, tabs, title }: ListProps) => (
  <section className={styles.list}>
    <Crumb items={[type]}></Crumb>
    <Header title={title} count={items.length} />
    {filters ? <Filters section={type} /> : ''}
    {tabs ? <Tabs items={tabs} /> : ''}
    <div className={styles.listGrid}>
      {items.map((item: ListItem, index: number) => (
        <Card section={type} item={item} index={index} key={`${item.id}-${index}`}></Card>
      ))}
    </div>
  </section>
);

export default List;
