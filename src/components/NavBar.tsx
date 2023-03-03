import React from 'react';

const NavBar: React.FC = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <a className="navbar-item" href="http://localhost:3000/">
                    Train Ticket App
                </a>
            </div>
        </nav>
    );
}


export default NavBar;