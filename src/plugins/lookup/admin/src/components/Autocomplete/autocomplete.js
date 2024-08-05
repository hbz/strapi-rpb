import { autocomplete } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { render } from 'react-dom';

function debouncePromise(fn, time) {
  let timerId = undefined;
  
  return (...args) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    
    return new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

export const debounce = debouncePromise((items) => Promise.resolve(items), 300);

export function Autocomplete(props) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment },
      render({ children }, root) {
        render(children, root);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };    
  }, [props]);

  return <div ref={containerRef} />;
}
