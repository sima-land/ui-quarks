/* eslint-disable require-jsdoc, jsdoc/require-jsdoc */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { isEmpty, last } from 'lodash';
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

  return (
    <>
      <h1 className='main-title'>Иконки дизайн-системы</h1>
      <input
        type='text'
        value={searchValue}
        placeholder='Имя иконки...'
        onChange={e => setSearchValue(e.target.value)}
        className='search-input'
      />

      <div className='icons'>
        {!foundIcons.length && (
          <div className='not-found-message'>Не найдено</div>
        )}
        {foundIcons.map((iconData, index) => {
          const { icon: Icon } = iconData;

          return (
            <div
              key={index}
              className='icon-block'
              title={iconData.name}
              onClick={() => {
                navigator.clipboard && navigator.clipboard.writeText(
                  `import ${iconData.name} from '@dev-dep/ui-nucleons/${iconData.path}';`
                )
                  .then(() => {
                    addNotice(`Copied to clipboard: import for ${iconData.name}`);
                  });
              }}
            >
              <Icon className='icon-block__icon' />
              <div className='icon-block__title'>{iconData.name}</div>
            </div>
          );
        })}
      </div>

      <Notices items={notices.map(prop('message'))} />
    </>
  );
};

window.addEventListener('DOMContentLoaded', () => void ReactDOM.render(
  <App />,
  document.querySelector('#root')
));
