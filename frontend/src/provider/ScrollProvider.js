
const scrollPositions = {};

export const saveScrollPosition = (path, scrollY) => { 
console.log(scrollPositions)
  scrollPositions[path] = scrollY;
};

export const getScrollPosition = (path) => { 
    console.log(scrollPositions)
  return scrollPositions[path] || 0; 
  
};
console.log(scrollPositions)