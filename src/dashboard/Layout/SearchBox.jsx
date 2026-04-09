import { Search } from "lucide-react";
import React from "react";
import "./layout.css"

const SearchBox = () => {
  return (
    <div className="header-left">
    <div className="search-bar">
    <Search/>
      <input type="text" placeholder="search....." />
    </div>
  </div>
  
  );
};
export default SearchBox;
