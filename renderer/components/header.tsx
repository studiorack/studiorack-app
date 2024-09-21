import styles from '../styles/components/header.module.css';

type HeaderProps = {
  count?: number;
  title: string;
};

const Header = ({ title, count }: HeaderProps) => (
  <div className={styles.header}>
    <h3 className={styles.headerTitle}>
      {title} {count ? <span className={styles.headerCount}>({count})</span> : ''}
    </h3>
  </div>
);

export default Header;
