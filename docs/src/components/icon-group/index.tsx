import { useEffect, useRef } from 'react';
import ClipboardJS from 'clipboard';
import styles from './icon-group.m.scss';

export interface IconData {
  component: any;
  componentName: string;
  importPath: string;
  packageFilename: string;
  packagePathname: string;
}

export function IconGroup({
  title,
  items,
  onIconCopied,
}: {
  title: string;
  items: IconData[];
  onIconCopied: (icon: IconData) => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper} data-title={title}>
      <h3 className={styles.title}>{title.replace(/\//g, ' / ')}</h3>

      <div className={styles.group}>
        {items.map((item, index) => (
          <IconGroupItem key={index} {...item} onCopied={() => onIconCopied(item)} />
        ))}
      </div>
    </div>
  );
}

function IconGroupItem({
  component: Component,
  componentName,
  importPath,
  packageFilename,
  onCopied,
}: IconData & { onCopied: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const clipboard = new ClipboardJS(ref.current);
      clipboard.on('success', onCopied);

      return () => clipboard.destroy();
    }
  }, [onCopied]);

  const valueToCopy = `import ${componentName} from '${importPath}';`;

  return (
    <div ref={ref} className={styles.item} data-clipboard-text={valueToCopy}>
      <Component fill='currentColor' />
      <div className={styles.name}>{packageFilename}</div>
    </div>
  );
}
