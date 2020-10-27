import React, { useState, useEffect } from 'react';
import { useReducer } from 'react';
import ReactDOM from 'react-dom';
import * as Icons from 'ui-quarks';

const App = () => {
  const [value, setValue] = useState('');

  const [notices, dispatchNotices] = useReducer((state = [], action) => {
    switch (action.type) {
      case 'ADD': return [...state, action.payload].slice(-5);
      case 'DEQUEUE': return state.slice(1);
    }
  });
  const addNotice = message => dispatchNotices({ type: 'ADD', payload: message });
  const dequeueNotice = () => dispatchNotices({ type: 'DEQUEUE' });

  const foundIcons = Object.values(Icons).filter(data => data.name.toLowerCase().includes(value));

  useEffect(() => {
    setInterval(() => dequeueNotice(), 600);
  }, []);

  return (
    <>
      <input
        value={value}
        className='search-input'
        type="text"
        onChange={e => setValue(e.target.value)}
        placeholder='Имя иконки...'
      />

      <div className="icons">
        {!foundIcons.length && (
          <div className='not-found-message'>Не найдено</div>
        )}
        {foundIcons.map(({ icon: Icon, name, path }, index) => (
          <div
            key={index}
            className='icon-block'
            onClick={() => {
              navigator.clipboard.writeText(`import ${name} from '@dev-dep/ui-nucleons/${path}';`).then(() => {
                addNotice('Copied to clipboard: import');
              });
            }}
          >
            <Icon className='icon-block__icon' />
            <div className='icon-block__title'>{name}</div>
          </div>
        ))}
      </div>

      <Notices items={notices} />
    </>
  );
};

const Notices = ({ items = [] }) => {
  const [element, setElement] = useState();

  useEffect(() => {
    const container = document.createElement('div');

    document.body.append(container);
    setElement(container);
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
    : null
};

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('#root')
  );
});
