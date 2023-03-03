import React from 'react';
import { FilterType, FilterProps } from '../interfaces/global';
import { filterArray } from '../utils/constant';

const Filter: React.FC<FilterProps> = ({ handleFilterClick, activeName }) => {
    return (
        <div className="tabs is-toggle is-toggle-rounded">
            <ul>
                {filterArray.map((filter, index) => (
                    <li
                        key={index}
                        className={activeName === filter ? "is-active is-size-6" : "is-size-7"}
                        onClick={() => handleFilterClick(filter as FilterType)}>
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
