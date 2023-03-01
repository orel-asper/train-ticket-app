import React from 'react';
import './App.css';
import { Filter, NavBar, Flow, Footer } from './components';

const App: React.FC = () => {
  return (
    <div className="container.is-widescreen">
      <NavBar />
      <section className="section">
        <Filter />
        <div className="column">
          <div className="flow-container box">
            <Flow />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}


export default App;