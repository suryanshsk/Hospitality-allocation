import React from 'react';

const ResultDisplay = ({ results }) => {
    return (
        <div>
            <h3>Room Allocations</h3>
            <table>
                <thead>
                    <tr>
                        <th>Group ID</th>
                        <th>Hostel Name</th>
                        <th>Room Number</th>
                        <th>Members Allocated</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td>{result.groupID}</td>
                            <td>{result.hostelName}</td>
                            <td>{result.roomNumber}</td>
                            <td>{result.membersAllocated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultDisplay;
