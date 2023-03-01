import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="content has-text-centered">
                <p>
                    Train Ticket App © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}


export default Footer;