import React, { useState } from "react";
import { NodeData } from "../interfaces/global";

const NodeElementLabel: React.FC<{ nodeData: NodeData }> = ({ nodeData }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleTooltipToggle = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div className="card ">
            <header className="card-header">
                <p className="card-header-title">{nodeData.name}</p>
            </header>
            <div className="card-content">
                <div className="content">
                    <p>Kind: {nodeData.kind}</p>
                    <p>Language: {nodeData.language}</p>
                    <p className={nodeData.publicExposed ? "has-text-danger" : "has-text-success"}>
                        {nodeData.publicExposed
                            ? "Publicly Exposed"
                            : "Not Publicly Exposed"}
                    </p>
                    <ul></ul>
                    <div
                        className="text-wrapper"
                        onMouseEnter={handleTooltipToggle}
                        onMouseLeave={handleTooltipToggle}
                    >
                        {nodeData.vulnerabilities?.length ? (<p className="has-text-danger"> Vulnerabilities: {nodeData.vulnerabilities.length}</p>) : null}
                        {showTooltip && nodeData?.vulnerabilities?.map((vulnerability, index) => (
                            <li className="has-text-danger" key={index}>
                                {vulnerability.message}
                            </li>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeElementLabel;
