import { useEffect, useState, useMemo } from 'react'

export function useTypewriter({ 
    content, 
    isActive = false, 
    delay = 50, 
    sentencePause = 800 
}) {
    const [displayed, setDisplayed] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    
    // Blinking cursor animation
    useEffect(() => {
        if (!isActive) return;
        
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530); // Blink every 530ms
        
        return () => clearInterval(cursorInterval);
    }, [isActive]);
    
    useEffect(() => {
        if (typeof content !== "string") return;
        if (!isActive) {
            setDisplayed("");
            return;
        }
        
        setDisplayed("");       // reset when content changes
        let i = 0;
        let timeoutId;
        
        const typeNextChar = () => {
            if (i >= content.length) {
                return; // Finished typing
            }
            
            i += 1;
            setDisplayed(content.slice(0, i));
            
            // Check if we're at the end of a sentence
            const currentChar = content[i - 1];
            const isSentenceEnd = currentChar === '.' || currentChar === '!' || currentChar === '?';
            
            // Use longer delay at sentence end, otherwise use normal delay
            const nextDelay = isSentenceEnd ? sentencePause : delay;
            
            timeoutId = setTimeout(typeNextChar, nextDelay);
        };
        
        // Start typing
        timeoutId = setTimeout(typeNextChar, delay);
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [content, isActive, delay, sentencePause]);
    
    // Convert newlines to <br /> elements for visual display
    const renderedText = useMemo(() => {
        const lines = displayed.split('\n');
        return lines.map((line, index) => (
            <span key={index}>
                {line}
                {index < lines.length - 1 && <br />}
            </span>
        ));
    }, [displayed]);
    
    // Render the complete typewriter output with cursor
    const output = useMemo(() => (
        <>
            {renderedText}
            {isActive && (
                <span 
                    className="inline-block w-0.5 h-4 bg-white ml-0.5 align-middle"
                    style={{ 
                        opacity: showCursor ? 1 : 0,
                        transition: 'opacity 0.15s ease-in-out'
                    }}
                />
            )}
        </>
    ), [renderedText, isActive, showCursor]);
    
    return { 
        displayed, 
        showCursor, 
        output // The complete rendered JSX
    };
}

