import React from 'react';
import styled from 'styled-components';
import { useState, useMemo, useRef } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { useSuggestHcp } from '../hooks/useSuggestHcp';
import search from '../assets/search.png';
import people from '../assets/people.png';
import book from '../assets/book.png';
import { BodyText } from '../mixins';

const Container = styled.div`
  position: relative;
  flex-grow: 1;
  width: 100%;
  ${BodyText};
`

const SearchBox = styled.input`
  border: 1px solid #dadada;
  padding: 3px;
  padding-left: 30px;
  border-radius: 8px;
  box-sizing: border-box;
  height: 28px;
  width: 100%;
  background-image: url(${search});
  background-repeat: no-repeat;
  background-position-x: 4px;
  background-position-y: 3px;
  ${BodyText};
`

const SuggestionsDropdown = styled.ul`
  margin-top: 2px;
  display: block;
  position: absolute;
  list-style: none;
  width: 100%;
  background-color: white;
  padding: 8px;
  padding-left: 8px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: 0px 5px 20px 1px;
  z-index: 10;
  max-height: 350px;
  overflow: auto;
  li {
    cursor: pointer;
    display: flex;
    justify-content: stretch;
    align-items: center;
    .variable {
      flex-grow: 0;
      width: 65px;
      img {
        vertical-align: top;
        margin-right: 2px;
      }
    }
    .name {
      flex-grow: 1;
    }
  }
  li:hover {
    background-color: #dadada;
  }
`

const debouncer = (cb: (str: string) => void) => {
  let tid: number | null = null;
  return (str: string) => {
    if (tid !== null) {
      clearTimeout(tid)
    }
    tid = window.setTimeout(() => cb(str), 300);
  }
};

export interface FilterProps {
  onSelect: (node: string) => void
}
export const Filter = ({onSelect}: FilterProps) => {
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);

  const ref = useRef(null);
  useClickOutside(ref, () => {
    setOpen(false);
  });
  const results = useSuggestHcp(filter);

  const onChange = (str: string) => {    
    setFilter(str);
    if (str) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const debounce = useMemo(() => debouncer(onChange), []);
  const select = (result: string) => {
    setOpen(false);
    setFilter('');
    onSelect(result as any);
  };

  return (
    <Container ref={ref}>
      <SearchBox aria-label="Search" placeholder="Search" type="text" value={filter} onChange={(e) => {
        setFilter(e.target.value);
        debounce(e.target.value);
      }} />
      {open && results?.length && (
      <SuggestionsDropdown role="listbox">
        {results.map((result, id) => {
          return <li key={id} onClick={() => select(result.index)} role="option">
            <span className="name">{result.lastName}, {result.name}</span>
            <span className="variable">
              <img src={book} alt="number of peers" title="number of peers" />
              {result.peers.length}
            </span>
            <span className="variable">
              <img src={people} alt="number of coworkers" title="number of coworkers" />
              {result.coworkers.length}
            </span>
          </li>
        })}
      </SuggestionsDropdown>
      ) || null}
    </Container>
  )
}

export default Filter;