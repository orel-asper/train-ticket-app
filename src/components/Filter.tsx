import React from 'react';

const Filter: React.FC = () => {
    return (
        <div className="tabs is-toggle is-toggle-rounded">
            <ul>
                <li className="is-active is-size-5">
                    <a>
                        <span>All</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span>Java</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span>Python</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span>TypeScript</span>
                    </a>
                </li>
                <li>
                    <a>
                        <span>JavaScript</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}


export default Filter;