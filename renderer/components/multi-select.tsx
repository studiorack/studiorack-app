import { useRouter } from 'next/router';
import { includesValue, toSlug } from '../lib/utils';
import styles from '../styles/components/multi-select.module.css';

type MultiSelectItem = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  label: string;
  items: MultiSelectItem[];
};

const MultiSelect = ({ label, items }: MultiSelectProps) => {
  const router = useRouter();
  const slug: string = toSlug(label);

  const showCheckboxes = (e: any) => {
    e.preventDefault();
    e.target.blur();
    window.focus();
    var checkboxes = document.getElementById(label);
    if (checkboxes?.style.display === 'block') {
      if (checkboxes) checkboxes.style.display = 'none';
    } else {
      if (checkboxes) checkboxes.style.display = 'block';
    }
  };

  const isChecked = (value: string) => {
    if (!router.query[slug]) return false;
    return includesValue(router.query[slug], value);
  };

  const updateUrl = () => {
    const form: HTMLFormElement = document.getElementById(slug) as HTMLFormElement;
    router.query[slug] = Array.from(new FormData(form).keys());
    router.push({
      pathname: router.pathname,
      query: router.query,
    });
  };

  return (
    <form className={styles.multiselect} id={slug}>
      <select className={`${styles.multiselectTitle} ${styles['icon-' + slug]}`} onMouseDown={showCheckboxes}>
        <option>{label}</option>
      </select>
      <div className={styles.multiselectCheckboxes} id={label}>
        {items.map((item: MultiSelectItem, index: number) => (
          <label
            className={styles.multiselectLabel}
            htmlFor={toSlug(item.value)}
            key={toSlug(item.value)}
            title={item.label}
          >
            <input
              className={styles.multiselectInput}
              type="checkbox"
              id={toSlug(item.value)}
              name={toSlug(item.value)}
              onClick={updateUrl}
              defaultChecked={isChecked(item.value)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </form>
  );
};

export default MultiSelect;
