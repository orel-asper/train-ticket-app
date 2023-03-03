import React, { useState } from 'react';
import { filterArray } from '../utils/constant';

const Filter: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const handleFilterClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="tabs is-toggle is-toggle-rounded">
            <ul>
                {filterArray.map((filter, index) => (
                    <li
                        key={index}
                        className={activeIndex === index ? "is-active is-size-6" : "is-size-7"}
                        onClick={() => handleFilterClick(index)}
                    >
                        <a>
                            <span>{filter}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Filter;
