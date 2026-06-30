import { useState, useEffect, useRef } from 'react';

export function useCppCompiler() {
  const [isReady, setIsReady] = useState(false);
  const [output, setOutput] = useState('');
  const workerRef = useRef(null);

  useEffect(() => {
    // 1. Create a script that imports the CDN worker inside a local blob wrapper
    const workerScript = `importScripts('https://unpkg.com/@chriskoch/cpp-wasm@1.0.2/dist/cpp-wasm.worker.js');`;
    
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);

    // 2. Initialize the worker using the local Blob URL (Bypasses Security Error!)
    workerRef.current = new Worker(workerUrl);

    // 3. Listen for compilation and runtime updates
    workerRef.current.onmessage = (event) => {
      const { type, data } = event.data;
      
      if (type === 'READY') {
        setIsReady(true);
      } else if (type === 'STDOUT') {
        setOutput((prev) => prev + data);
      } else if (type === 'STDERR') {
        setOutput((prev) => prev + `\nError: ${data}`);
      } else if (type === 'EXIT') {
        setOutput((prev) => prev + `\n\n[Process finished with exit code ${data}]`);
      }
    };

    return () => {
      workerRef.current?.terminate();
      URL.revokeObjectURL(workerUrl); // Clean up the object URL memory
    };
  }, []);

  const runCode = (code, input = '') => {
    setOutput(''); // Reset output console screen
    if (workerRef.current && isReady) {
      workerRef.current.postMessage({
        type: 'RUN',
        code: code,
        input: input
      });
    }
  };

  return { isReady, output, runCode };
}