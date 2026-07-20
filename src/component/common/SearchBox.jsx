import { Search } from "lucide-react";
import React from "react";
import "../../styles/layout.css";
import { IoIosSearch } from "react-icons/io";

const SearchBox = ({search, setSearch}) => {
  return (
    <div className="searchBox">
      <IoIosSearch className="mr-2"/>
      <input type="text" placeholder="Search course, tpoics, instructors..." value={search} onChange={(e) => setSearch(e.value)} />
      {search && (// only show X if their's text
        <button  type="button" className="clear-btn" onClick={()=>setSearch("")} aria-label="Clear search">X</button>
      )}
    </div>
  );
};
export default SearchBox;
