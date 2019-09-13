import React, { useReducer, useCallback, useMemo, useEffect } from 'react';
import useHttp from '../../hooks/http';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);

    default:
      throw new Error();
  }
};

const Ingredients = () => {
  // * alternative to {useState} hook to manipulte complex State
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // * custom hook
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    identifier,
    clear
  } = useHttp();

  // * this code is executed after component was rendered and for every render cycle
  // * acts like componentDidMount fn
  useEffect(() => {
    if (!isLoading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    }
    if (!isLoading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } });
    }
  }, [data, reqExtra, identifier, isLoading, error]);

  const addIngredientHandler = useCallback(
    ingredient => {
      sendRequest(
        'https://react-hooks-project-a0bf9.firebaseio.com/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    ingId => {
      sendRequest(
        `https://react-hooks-project-a0bf9.firebaseio.com/ingredients/${ingId}.json`,
        'DELETE',
        null,
        ingId,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

  // * useCallback caches fn
  const filterIngsHandler = useCallback(ingredients => {
    dispatch({ type: 'SET', ingredients });
  }, []);

  // * useMemo() rerenders component only when its dependencies were changed
  // ? alternative to React.memo()
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
