# Иконки дизайн-системы www.sima-land.ru

Разрабатывается в соответствии с [дизайн-руководствами](https://www.figma.com/file/NUkikBKmMo6WiXbWbHJWhkWh/Icons).

## Установка

```bash
# npm
npm i -S @sima-land/ui-quarks

# или yarn
yarn add @sima-land/ui-quarks
```

## Использование

Иконки доступны как React-компоненты:

```tsx
import AddSVG from '@sima-land/ui-quarks/icons/24x24/Stroked/Add';

function IconicButton() {
  return (
    <button>
      <AddSVG fill='#f00' />
    </button>
  );
}
```

## Добавление новых иконок

Для добавления необходимо:

- выделить иконку (именно компонент, включая безопасное расстояние);
- в правой колонке выбрать вкладку "Export";
- выбрать тип экспорта SVG и нажать кнопку "Export";
- достать из полученного архива иконку и расположить ее в `src/icons/` также, как располагаются остальные иконки

> Важно: не надо переименовывать файл иконки (только в крайних случаях), при сборке файл будет автоматически переименован в **PascalCase**.
