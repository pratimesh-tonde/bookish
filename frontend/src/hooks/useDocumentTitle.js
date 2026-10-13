import { useEffect } from "react";

// Sets the browser tab title for the page it's called in, and restores the
// default title when that page unmounts.
const useDocumentTitle = (title) => {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} | Bookish` : "Bookish book for everone";
    return () => {
      document.title = previous;
    };
  }, [title]);
};

export default useDocumentTitle;