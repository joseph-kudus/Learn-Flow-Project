import { Search } from "lucide-react";
import React from "react";
import "./layout.css"

const SearchBox = () => {
  return (
    <div className="SearchBox">
      <Search/>
      <input type="text" placeholder="Type your, message" />
    </div>
  );
};
export default SearchBox;
