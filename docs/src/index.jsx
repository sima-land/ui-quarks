/* eslint-disable require-jsdoc, jsdoc/require-jsdoc */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Clipboard from 'clipboard';
import { groupBy, isEmpty, last } from 'lodash';
import { prop } from 'lodash/fp';
import * as Icons from 'ui-quarks';

const useNotices = () => {
  const EXPIRE_TIME = 600;
  const [notices, setNotices] = useState([]);

  const createNotice = message => ({ message, createdAt: Date.now() });
  const isExpired = notice => Date.now() - notice.createdAt > EXPIRE_TIME;

  const add = message => setNotices(list => [...list, createNotice(message)].slice(-5));
  const dequeue = () => setNotices(list => !isEmpty(list) && isExpired(last(list)) ? list.slice(1) : list);

  useEffect(() => {
    const timerId = setInterval(dequeue, EXPIRE_TIME);
    return () => clearInterval(timerId);
  }, []);

  return [notices, add];
};

const Notices = ({ items = [] }) => {
  const [element, setElement] = useState();

  useEffect(() => {
    const container = document.createElement('div');

    document.body.append(container);
    setElement(container);

    return () => container.remove();
  }, []);

  return element
    ? ReactDOM.createPortal(
      (
        <div className='notices'>
          {items.map((item, index) => (
            <div key={index} className='notices__item'>{item}</div>
          ))}
        </div>
      ),
      element
    )
    : null;
};

const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [notices, addNotice] = useNotices();

  const foundIcons = Object
    .values(Icons)
    .filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()));

  const iconGroups = groupBy(
    foundIcons,
    ({ path }) => path.replace(/[^/]*$/g, '').replace(/^icons/, '').split('/').filter(Boolean).join(' / ')
  );

  useEffect(() => {
    const clipboard = new Clipboard('.icon-block');

    clipboard.on('success', event => {
      addNotice(`Copied to clipboard: import for ${event.trigger.title}`);
    });
  }, []);

  return (
    <>
      <h1 className='main-title'>Иконки дизайн-системы Сима-ленд</h1>
      <input
        type='text'
        value={searchValue}
        placeholder='Имя иконки...'
        onChange={e => setSearchValue(e.target.value)}
        className='search-input'
      />

      <div className='icons'>
        {Object.entries(iconGroups).map(([groupName, items]) => (
          <>
            <h3 className='group-title'>{groupName}</h3>
            {items.map((iconData, index) => {
              const { icon: Icon } = iconData;

              return (
                <div
                  key={index}
                  className='icon-block'
                  title={iconData.name}
                  data-clipboard-text={`import ${iconData.name} from '@sima-land/ui-quarks/${iconData.path}';`}
                >
                  <Icon className='icon-block__icon' />
                  <div className='icon-block__title'>{iconData.name}</div>
                </div>
              );
            })}
          </>
        ))}
        {!foundIcons.length && (
          <div className='not-found-message'>Не найдено</div>
        )}
      </div>

      <Notices items={notices.map(prop('message'))} />
    </>
  );
};

window.addEventListener('DOMContentLoaded', () => void ReactDOM.render(
  <App />,
  document.querySelector('#root')
));
