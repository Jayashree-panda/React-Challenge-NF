import axios from 'axios';
import './App.css';
import { useEffect, useState } from 'react';
import { Loader, Button, Table, Input, Icon, Dropdown } from 'semantic-ui-react';

const tableHeaders = ["Species", "Name", "Height", "Mass", "Hair Color", "Skin Color", "Eye Color", "Birth Year", "Gender", "Created", "Edited"]
const dropdownOptions = [
  {
    key: 0,
    text: '(Low to High) Mass',
    value: 1,
  },
  {
    key: 1,
    text: "(Low to High) Height",
    value: 2,
  },
];

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [nextLink, setNextLink] = useState(null);
  const [prevLink, setPrevLink] = useState(null);
  const [totalCount, setTotalCount] = useState(null);

  const getSpeciesApi = (url, index) => {
    if(url) {
      axios.get(url)
      .then((res) => {
        const resultsCopy = [...results];
        console.log(resultsCopy[index]);
        resultsCopy[index]["species_name"] = res.data.name;
        setResults(resultsCopy);
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  const callApi = (url) => {
    setIsLoading(true);
    axios.get(url)
    .then((res) => {
      setResults(res.data.results)
      if(res.data.next === null)
        setIsNextDisabled(true);
      else
        setIsNextDisabled(false);
      if(res.data.previous === null)
        setIsPrevDisabled(true);
      else
        setIsPrevDisabled(false);
      setTotalCount(res.data.count);
      setNextLink(res.data.next);
      setPrevLink(res.data.previous);
      setIsLoading(false);
      res.data.results.map((elem, index) => {
        getSpeciesApi(elem.species?.[0], index)
      })
    })
    .catch((err) => {
      setIsLoading(false);
      console.log(err)
    })
  }

  useEffect(() => {
    callApi('https://swapi.dev/api/people/');
  }, [])

  useEffect(() => {
    // console.log(results)
  }, [results]);
  return (
    <div>
      {isLoading && <Loader active />}
      <div className="total-count">Total Count: {totalCount}</div>
      <div className="search-container">
        <Dropdown placeholder="Sort" options={dropdownOptions} selection className="sort-dropdown" clearable/>
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
                  <Table.Cell>
                    {item?.species_name === "Droid" ? <Icon name='android' size='large' /> : item?.species_name === "Human" ? <Icon name='user circle' size='large' /> : <Icon name='question circle' size='large'/>}
                  </Table.Cell>
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
