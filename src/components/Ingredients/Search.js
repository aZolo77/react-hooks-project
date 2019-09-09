import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');

  // * {useRef} cretaes a reference of an element
  const inputRef = useRef();

  // * this fn is executed only when any dependency ({enteredFilter}, {onLoadIngredients}, {inputRef}) change
  // * this code is executed after component was rendered and for every render cycle
  // * acts like componentDidMount fn
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length
          ? `?orderBy="title"&equalTo="${enteredFilter}"`
          : '';

        fetch(
          `https://react-hooks-project-a0bf9.firebaseio.com/ingredients.json${query}`
        )
          .then(res => res.json())
          .then(data => {
            const loadedIngs = [];
            for (const key in data) {
              loadedIngs.push({
                id: key,
                title: data[key].title,
                amount: data[key].amount
              });
            }
            onLoadIngredients(loadedIngs);
          });
      }
    }, 500);

    // * return cleanup fn
    return () => {
      // to get rid of redundant timers
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  const onInputHandler = e => setEnteredFilter(e.target.value);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={onInputHandler}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
