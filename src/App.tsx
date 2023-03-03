import React, { useState } from 'react';
import './App.css';
import { Filter, NavBar, Flow, Footer } from './components';
import useGetFilteredData from './hooks/useGetFilteredData';
import { FilterType } from './interfaces/global';

const App: React.FC = () => {
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const filteredData = useGetFilteredData(filterType);

  const handleFilterClick = (filter: FilterType) => {
    setFilterType(filter);
  };


  return (
    <div className="container.is-widescreen">
      <NavBar />
      <section className="section">
        <Filter
          handleFilterClick={handleFilterClick}
          activeName={filterType}
        />
        <div className="column">
          <div className="flow-container box ">
            {filteredData && (
              <Flow data={filteredData} />
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;