import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import ResultDisplay from './components/ResultDisplay';

const App = () => {
    const [results, setResults] = useState([]);

    const handleUploadSuccess = (data) => {
        setResults(data);
    };

    return (
        <div>
            <h1>Hospitality Process Digitalization</h1>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            {results.length > 0 && <ResultDisplay results={results} />}
        </div>
    );
};

export default App;
