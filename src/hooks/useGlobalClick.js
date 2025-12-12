import { useEffect, useState } from "react";

export function useGlobalClick() {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    function handleClick() {
      setClicked(prev => !prev);
    }

    window.addEventListener("pointerdown", handleClick);

    return () => {
      window.removeEventListener("pointerdown", handleClick);
    };
  }, []);

  return clicked;
}
