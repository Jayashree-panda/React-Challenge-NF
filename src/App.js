import axios from 'axios';
import './App.css';
import { useEffect, useState } from 'react';
import { Loader, Button, Table, Input } from 'semantic-ui-react';

const tableHeaders = ["Name", "Height", "Mass", "Hair Color", "Skin Color", "Eye Color", "Birth Year", "Gender", "Created", "Edited"]
function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [nextLink, setNextLink] = useState(null);
  const [prevLink, setPrevLink] = useState(null);

  const callApi = (url) => {
    setIsLoading(true);
    axios.get(url)
    .then((res) => {
      setIsLoading(false);
      setResults(res.data.results)
      if(res.data.next === null)
        setIsNextDisabled(true);
      else
        setIsNextDisabled(false);
      if(res.data.previous === null)
        setIsPrevDisabled(true);
      else
        setIsPrevDisabled(false);
      setNextLink(res.data.next);
      setPrevLink(res.data.previous);
    })
    .catch((err) => {
      setIsLoading(false);
      console.log(err)
    })
  }

  useEffect(() => {
    callApi('https://swapi.dev/api/people/');
  }, [])
  return (
    <div>
      {isLoading && <Loader active />}
      <div className="search-container">
        <Input placeholder="Search by name..." onChange={(e, data)=> {
          setSearchQuery(data.value);
        }} className="input-search" />
        <Button primary className="search-button" onClick={() => {
          callApi(`https://swapi.dev/api/people/?search=${searchQuery}`);
        }}>Search</Button>
      </div>
      {!isLoading && results.length === 0 && <p className="no-results">No Results Found!</p>}
      {!isLoading && results.length !== 0 &&  (
        <div className="parent-container">
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
            <Button primary className="prev-button" disabled={isPrevDisabled} onClick={() => {
              callApi(prevLink)
            }}>Prev</Button>
            <Button primary className="next-button" disabled={isNextDisabled} onClick={() => {
              callApi(nextLink)
            }}>Next</Button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default App;
