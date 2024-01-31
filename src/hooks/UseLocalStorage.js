import { useState, useEffect } from "react";
import JoblyApi from "../api/api";


/** Custom hook for keeping state data synced with localStorage.
 *
 * This creates `item` as state and look in localStorage for current value
 * (if not found, defaults to `firstValue`)
 *
 * When `item` changes, effect re-runs:
 * - if new state is null, removes from localStorage
 * - else, updates localStorage
 *
 * To the component, this just acts like state that is also synced to/from
 * localStorage::
 *
 *   const [myThing, setMyThing] = useLocalStorage("myThing")
 */

function useLocalStorage(key, firstValue = null) {
  const initialValue = localStorage.getItem(key) || firstValue;
  console.log(`Initial value for ${key}:`, initialValue); // Debugging line
 
  const [item, setItem] = useState(initialValue);

  useEffect(function setKeyInLocalStorage() {
    console.debug("hooks useLocalStorage useEffect", "item=", item);

    if (item === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, item);
    }
  }, [key, item]);

  return [item, setItem];
}

export default useLocalStorage;