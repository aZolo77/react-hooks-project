import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';

import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  // * custom hook
  const { isLoading, error, data, sendRequest, clear } = useHttp();

  // * {useRef} cretaes a reference of an element
  const inputRef = useRef();

  // * this fn is executed only when any dependency ({enteredFilter}, {onLoadIngredients}, {inputRef}) change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length
          ? `?orderBy="title"&equalTo="${enteredFilter}"`
          : '';

        sendRequest(
          `https://react-hooks-project-a0bf9.firebaseio.com/ingredients.json${query}`,
          'GET'
        );
      }
    }, 500);

    // * return cleanup fn
    return () => {
      // to get rid of redundant timers
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  // * Multiple useEffect fns
  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngs = [];
      for (const key in data) {
        loadedIngs.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngs);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  const onInputHandler = e => setEnteredFilter(e.target.value);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
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
