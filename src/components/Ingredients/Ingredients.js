import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-project-a0bf9.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        setIsLoading(false);
        return res.json();
      })
      .then(data => {
        setUserIngredients(prevState => [
          ...prevState,
          { id: data.name, ...ingredient }
        ]);
      })
      .catch(err => {
        // * обновление нескольких состояний в одном синхронном обработчике происходит одним пакетом
        setIsLoading(false);
        setError('Something went wrong!');
      });
  };

  const removeIngredientHandler = ingId => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-project-a0bf9.firebaseio.com/ingredients/${ingId}.json`,
      {
        method: 'DELETE'
      }
    )
      .then(res => {
        setIsLoading(false);
        setUserIngredients(prevIngs =>
          prevIngs.filter(ing => ing.id !== ingId)
        );
      })
      .catch(err => {
        setIsLoading(false);
        setError('Something went wrong!');
      });
  };

  // * useCallback caches fn
  const filterIngsHandler = useCallback(ings => {
    setUserIngredients(ings);
  }, []);

  const clearErrorHandler = () => {
    setError();
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearErrorHandler}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filterIngsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
