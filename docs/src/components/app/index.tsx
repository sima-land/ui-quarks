import { useCallback, useState } from 'react';
import { TextButton } from '@sima-land/ui-nucleons/text-button';
import { Panel } from '@sima-land/ui-nucleons/panel';
import { Input } from '@sima-land/ui-nucleons/input';
import { Layout } from '@sima-land/ui-nucleons/layout';
import { IconData, IconGroup } from '../icon-group';
import { Toast, useDarkTheme, useToasts } from '../hooks';
import { icons } from '../../../generated/icons';
import styles from './app.m.scss';

export function App() {
  const [groups] = useState(getIconGroups);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { theme, setTheme } = useDarkTheme();
  const { toasts, addToast } = useToasts();

  const isSuitable = useCallback(
    (value: string) => value.toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery],
  );

  return (
    <div className={styles.root}>
      <Toasts items={toasts} />

      <Layout className={styles.main}>
        <h1 className={styles.title}>Иконки дизайн-системы Сима-ленд</h1>

        <TextButton
          color={theme === 'dark' ? 'basic-white' : 'basic-gray87'}
          onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        >
          Темная тема: {theme === 'dark' ? 'Вкл' : 'Выкл'}
        </TextButton>

        <Input
          className={styles.search}
          label='Введите название иконки'
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          clearable
        />

        {Object.entries(groups).map(([title, items], index) => (
          <IconGroup
            key={index}
            title={title}
            items={items.filter(item => isSuitable(item.packageFilename))}
            onIconCopied={icon => {
              addToast(`Скопирован импорт иконки "${icon.packageFilename}"`);
            }}
          />
        ))}

        {!icons.some(item => isSuitable(item.packageFilename)) && (
          <div className={styles.stub}>Ничего не нашлось</div>
        )}
      </Layout>

      <footer className={styles.footer}>
        <Layout>Copyright © 2023 Sima-land dev team.</Layout>
      </footer>
    </div>
  );
}

function Toasts({ items }: { items: Toast[] }) {
  return (
    <div className={styles.toasts}>
      {items.map((toast, index) => (
        <Panel
          key={toast.id}
          type='success'
          className={styles.toast}
          style={{ opacity: toast.hidden ? 0 : 1, top: 56 * index }}
        >
          {toast.text}
        </Panel>
      ))}
    </div>
  );
}

function getIconGroups() {
  return icons.reduce<Record<string, IconData[]>>((acc, item) => {
    // ВАЖНО: убираем "icons/" так как все иконки лежат в этом каталоге
    const groupName = item.packagePathname.replace('icons/', '');

    acc[groupName] = acc[groupName] || [];

    acc[groupName].push(item);

    return acc;
  }, {});
}
