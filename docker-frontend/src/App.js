import React, { useState, useEffect } from 'react';
import ErrorAlert from './components/UI/ErrorAlert';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [error, setError] = useState(null);
  const [names, setNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001');

      if (!response.ok) {
          throw new Error('Failed to fetch goals.');
      }
      return await response.json();
    }

    fetchData()
      .then((data) => {
        const welcomeMessage = data.message;
        setWelcomeMessage(welcomeMessage);
      })
      .catch((error) => {
        setError(error.message || 'Failed to fetch welcome message.');
      })
        .finally(() => {
          setIsLoading(false);
        });
  }, [])

  const getNames = async () => {
    return fetch('http://localhost:3001/names')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch names.');
        }
        return response.json();
      })
  }

  const postName = async () => {
    setIsLoading(true);
    return fetch('http://localhost:3001/name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe'
      })
    })
      .then(async response => {
        if (!response.ok) {
          setError('Failed to store name.');
          throw new Error('Failed to store name.');
        }
        return true;
      })
      .catch((error) => {
          setError(error.message || 'Failed to call endpoint.');
          setIsLoading(false);
      });
  }


  return (
    <div>
      {error && <ErrorAlert errorText={error} />}
      <>
        <h1>{(isLoading && 'Loading Message...') || welcomeMessage}</h1>
        <button onClick={async () => {
          const didPost = await postName();
            if (didPost) {
              try {
                const names = await getNames();
                setNames(names.names);
                setError(null);
              } catch (error) {
                setError(error.message || 'Failed to fetch names.');
              } finally {
                setIsLoading(false);
              }
            }
        }}>Post Name</button>
        <hr />
        <div>
          {names?.map((name) => (
              <div key={name.id}>
                <p>{name.fullName}</p>
              </div>
          ))}
        </div>
      </>
    </div>
  );
}

export default App;
