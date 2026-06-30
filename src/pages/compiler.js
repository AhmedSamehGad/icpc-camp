import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CppCompiler = () => {
    const [code, setCode] = useState(
        `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Welcome to ICPC Camp Compiler!" << endl;\n    return 0;\n}`
    );
    const [programInput, setProgramInput] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const handleCompileAndRun = async () => {
        setIsRunning(true);
        setOutput('⏳ Compiling and executing via Wandbox GCC...');

        try {
            const response = await fetch('https://wandbox.org/api/compile.json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    compiler: 'gcc-head',
                    code: code,
                    stdin: programInput,
                }),
            });

            const data = await response.json();
            setIsRunning(false);

            if (data) {
                if (data.compiler_error) {
                    setOutput(`❌ Compilation Error:\n${data.compiler_error}`);
                } else if (data.program_output) {
                    setOutput(data.program_output);
                } else if (data.program_error) {
                    setOutput(`⚠️ Runtime Error:\n${data.program_error}`);
                } else {
                    setOutput('✅ Program executed successfully with no output returned.');
                }
            } else {
                setOutput('❌ Error: Invalid response from the compilation server.');
            }
        } catch (error) {
            setIsRunning(false);
            setOutput('🌐 Connection Error: Failed to reach the compiler cluster. Please check your connection.');
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Global styles for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    textarea:focus {
                        border-color: rgba(234, 179, 8, 0.3) !important;
                    }
                    ::-webkit-scrollbar {
                        width: 5px;
                        height: 5px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #0A0A10;
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #EAB308;
                        border-radius: 4px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #CA8A04;
                    }
                `
            }} />

            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerLeft}>
                        <div style={styles.logo}>PS</div>
                        <div>
                            <div style={styles.logoText}>ICPC OTU</div>
                            <div style={styles.logoSub}>SUMMER CAMP</div>
                        </div>
                    </div>
                    <div style={styles.headerRight}>
                        <span style={styles.statusDot}>●</span>
                        <span style={styles.statusText}>Production Sandbox Active</span>
                    </div>
                </div>

                {/* Title */}
                <div style={styles.titleWrapper}>
                    <h2 style={styles.title}>
                        <span style={styles.titleIcon}>⚡</span> Code Runner
                    </h2>
                    <p style={styles.subtitle}>Compile & execute C++ code with Wandbox high-performance engine</p>
                </div>

                {/* Main Grid */}
                <div style={styles.grid}>
                    {/* Editor Panel */}
                    <div style={styles.panel}>
                        <div style={styles.panelLabel}>
                            <span style={styles.panelIcon}>⌨️</span> Editor
                            <span style={styles.langBadge}>C++</span>
                        </div>
                        <div style={styles.editorWrapper}>
                            <Editor
                                height="55vh"
                                defaultLanguage="cpp"
                                theme="vs-dark"
                                value={code}
                                onChange={(val) => setCode(val || '')}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    automaticLayout: true,
                                    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                                    lineNumbers: 'on',
                                    scrollBeyondLastLine: false,
                                    renderWhitespace: 'selection',
                                    tabSize: 4,
                                }}
                            />
                        </div>
                        <button
                            onClick={handleCompileAndRun}
                            disabled={isRunning}
                            style={{
                                ...styles.runButton,
                                ...(isRunning ? styles.runButtonDisabled : {}),
                            }}
                        >
                            {isRunning ? (
                                <>
                                    <span style={styles.spinner}></span> Running...
                                </>
                            ) : (
                                <>
                                    <span>▶</span> Run Code
                                </>
                            )}
                        </button>
                    </div>

                    {/* IO Panel */}
                    <div style={styles.panel}>
                        {/* Stdin */}
                        <div style={styles.ioSection}>
                            <div style={styles.panelLabel}>
                                <span style={styles.panelIcon}>📥</span> Standard Input (stdin)
                            </div>
                            <textarea
                                rows={3}
                                style={styles.textarea}
                                placeholder="Provide testcase inputs for cin streams here..."
                                value={programInput}
                                onChange={(e) => setProgramInput(e.target.value)}
                            />
                        </div>

                        {/* Output */}
                        <div style={{ ...styles.ioSection, flex: 1 }}>
                            <div style={styles.panelLabel}>
                                <span style={styles.panelIcon}>📤</span> Console Terminal Output
                                {output && output !== '📄 Output terminal idle.' && (
                                    <span style={styles.clearBtn} onClick={() => setOutput('')}>
                                        ✕ Clear
                                    </span>
                                )}
                            </div>
                            <div style={styles.outputWrapper}>
                                <div style={styles.output}>
                                    {output || '📄 Output terminal idle.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <span>Powered by</span>
                    <span style={styles.footerGold}>Wandbox</span>
                    <span style={styles.footerDot}>•</span>
                    <span style={styles.footerGray}>GCC Latest</span>
                    <span style={styles.footerDot}>•</span>
                    <span style={styles.footerGray}>ICPC OTU Community 2026</span>
                </div>
            </div>
        </div>
    );
};

// ===== STYLES (fixed missing commas) =====
const styles = {
    pageWrapper: {
        minHeight: '100vh',
        backgroundColor: '#05050A',
        padding: '24px',
        fontFamily: "'Cairo', 'JetBrains Mono', 'Consolas', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        maxWidth: '1280px',
        width: '100%',
        backgroundColor: '#0A0A10',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '28px 32px 20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(234, 179, 8, 0.05)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '18px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '22px',
        flexWrap: 'wrap',
        gap: '12px',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    },
    logo: {
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #FDE047, #CA8A04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#05050A',
        fontWeight: 800,
        fontSize: '14px',
        fontFamily: "'JetBrains Mono', monospace",
    },
    logoText: {
        fontSize: '13px',
        fontWeight: 700,
        color: '#EAB308',
        letterSpacing: '0.5px',
        lineHeight: '1.2',
    },
    logoSub: {
        fontSize: '9px',
        fontWeight: 500,
        color: '#6B7280',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(234, 179, 8, 0.08)',
        padding: '6px 14px',
        borderRadius: '20px',
        border: '1px solid rgba(234, 179, 8, 0.12)',
    },
    statusDot: {
        color: '#EAB308',
        fontSize: '12px',
        animation: 'pulse 2s infinite',
    },
    statusText: {
        fontSize: '12px',
        color: '#D1D5DB',
        fontWeight: 500,
    },
    titleWrapper: {
        marginBottom: '22px',
    },
    title: {
        fontSize: '26px',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #FDE047 0%, #EAB308 50%, #CA8A04 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    titleIcon: {
        WebkitTextFillColor: 'initial',
        color: '#EAB308',
    },
    subtitle: {
        fontSize: '14px',
        color: '#6B7280',
        margin: '4px 0 0 0',
        fontWeight: 400,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
    },
    panel: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    panelLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        fontWeight: 600,
        color: '#D1D5DB',
        padding: '0 4px',
    },
    panelIcon: {
        fontSize: '16px',
    },
    langBadge: {
        fontSize: '10px',
        fontWeight: 700,
        color: '#EAB308',
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
        padding: '2px 10px',
        borderRadius: '12px',
        marginLeft: 'auto',
        letterSpacing: '0.3px',
    },
    editorWrapper: {
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#1E1E2A',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
    },
    runButton: {
        padding: '12px 28px',
        backgroundColor: '#EAB308',
        color: '#05050A',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: 700,
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 16px rgba(234, 179, 8, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        fontFamily: "'Cairo', sans-serif",
    },
    runButtonDisabled: {
        backgroundColor: '#374151',
        color: '#9CA3AF',
        cursor: 'not-allowed',
        boxShadow: 'none',
    },
    spinner: {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid rgba(5, 5, 10, 0.2)',
        borderTopColor: '#05050A',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
    },
    ioSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    textarea: {
        width: '100%',
        padding: '12px 14px',
        boxSizing: 'border-box',
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
        fontSize: '13px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#0E0E16',
        color: '#E5E7EB',
        resize: 'vertical',
        outline: 'none',
        transition: 'border-color 0.2s',
        lineHeight: '1.6',
    },
    outputWrapper: {
        flex: 1,
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backgroundColor: '#0E0E16',
        overflow: 'hidden',
        minHeight: '200px',
    },
    output: {
        padding: '14px 16px',
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
        fontSize: '13px',
        color: '#D4D4D4',
        whiteSpace: 'pre-wrap',
        lineHeight: '1.7',
        minHeight: '200px',
        maxHeight: 'calc(55vh - 120px)',
        overflowY: 'auto',
        backgroundColor: '#0E0E16',
    },
    clearBtn: {
        marginLeft: 'auto',
        fontSize: '11px',
        color: '#6B7280',
        cursor: 'pointer',
        padding: '2px 8px',
        borderRadius: '6px',
        transition: 'all 0.2s',
        backgroundColor: 'rgba(255,255,255,0.04)',
    },
    footer: {
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#6B7280',
        flexWrap: 'wrap',
    },
    footerGold: {
        color: '#EAB308',
        fontWeight: 600,
    },
    footerGray: {
        color: '#4B5563',
    },
    footerDot: {
        color: '#374151',
    },
};

export default CppCompiler;