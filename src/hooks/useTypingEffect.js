import { useState, useEffect } from 'react';

export const useTypingEffect = (phrases, speed = 100, delay = 1500) => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[index];
    let timer;

    if (!isDeleting) {
      if (charIndex < currentPhrase.length) {
        timer = setTimeout(() => {
          setText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, speed);
      } else {
        timer = setTimeout(() => setIsDeleting(true), delay);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setText(currentPhrase.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, speed / 2);
      } else {
        setIsDeleting(false);
        setIndex((index + 1) % phrases.length);
      }
    }
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, index, phrases, speed, delay]);

  return text;
};  