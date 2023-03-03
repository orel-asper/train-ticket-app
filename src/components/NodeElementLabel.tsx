import React, { useState } from "react";
import { NodeData } from "../interfaces/global";

const NodeElementLabel: React.FC<{ nodeData: NodeData }> = ({ nodeData }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleTooltipToggle = () => {
        setShowTooltip(!showTooltip);
    };

    return (
        <div className="no-padding"
            onMouseEnter={handleTooltipToggle}
            onMouseLeave={handleTooltipToggle}
        >
            <div className="card no-padding">
                <header className="card-header no-padding">
                    <p className="card-header-title no-padding">{nodeData.name}</p>
                </header>
                <div className="card-content no-padding">
                    <p className={nodeData.publicExposed ? "has-text-danger" : "has-text-success"}>
                        {nodeData.publicExposed ? "Publicly Exposed" : "Not Publicly Exposed"}
                    </p>
                    {nodeData.vulnerabilities?.length ? (
                        <p className="has-text-danger"> Vulnerabilities: {nodeData.vulnerabilities.length}</p>
                    ) : null}
                    {showTooltip && (
                        <div className="content no-padding">
                            <p>Kind: {nodeData.kind}</p>
                            <p>Language: {nodeData.language}</p>
                            <ul></ul>
                            <div className="text-wrapper">
                                {nodeData?.vulnerabilities?.map((vulnerability, index) => (
                                    <li className="has-text-danger" key={index}>
                                        {vulnerability.message}
                                    </li>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NodeElementLabel;
