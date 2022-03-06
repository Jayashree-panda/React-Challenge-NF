import axios from 'axios';
import './App.css';
import { useEffect, useState } from 'react';
import { Loader, Button, Table } from 'semantic-ui-react';

const tableHeaders = ["Name", "Height", "Mass", "Hair Color", "Skin Color", "Eye Color", "Birth Year", "Gender", "Created", "Edited"]
function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('https://swapi.dev/api/people/')
    .then((res) => {
      setIsLoading(false);
      setResults(res.data.results)
      if(res.data.next === null)
        setIsNextDisabled(true);
      if(res.data.previous === null)
        setIsPrevDisabled(true);
    })
    .catch((err) => {
      setIsLoading(false);
      console.log(err)
    })
  }, [])
  return (
    <div>
      {isLoading && <Loader active />}
      {!isLoading && results.length !== 0 &&  (
        <div>
          <Table celled>
            <Table.Header>
              <Table.Row>
                {tableHeaders.map((item) => (
                  <Table.HeaderCell>{item}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            {results.map((item) => (
              <Table.Body>
                <Table.Row>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.height}</Table.Cell>
                  <Table.Cell>{item.mass}</Table.Cell>
                  <Table.Cell>{item.hair_color}</Table.Cell>
                  <Table.Cell>{item.skin_color}</Table.Cell>
                  <Table.Cell>{item.eye_color}</Table.Cell>
                  <Table.Cell>{item.birth_year}</Table.Cell>
                  <Table.Cell>{item.gender}</Table.Cell>
                  <Table.Cell>{item.created}</Table.Cell>
                  <Table.Cell>{item.edited}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          <div className="pagination-buttons">
            <Button primary className="prev-button" disabled={isPrevDisabled}>Prev</Button>
            <Button primary className="next-button" disabled={isNextDisabled}>Next</Button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
