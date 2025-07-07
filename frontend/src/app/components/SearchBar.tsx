"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ type }: { type: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  }
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("searching");
  }
  return (
    <form
      method="GET"
      onSubmit={handleSearch}
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <input
        type="search"
        onChange={handleChange}
        placeholder={`Search ${type}s...`}
        className={`hover-animation border-1 py-1 pr-10 pl-4 rounded-full text-dark-support bg-background border-light-foreground focus:outline-none focus:ring-1 focus:ring-foreground 
          [&::-webkit-search-cancel-button]:filter [&::-webkit-search-cancel-button]:brightness-70 [&::-webkit-search-cancel-button]:cursor-pointer
          ${isExpanded ? 'w-72 sm:w-48 lg:w-100 opacity-100' : 'w-0 opacity-0'}`
        }
      />
      <button type="submit" className="hover:cursor-pointer bg-nav p-2 absolute right-0 border-1 border-light-foreground rounded-full top-1/2 transform -translate-y-1/2 text-light-foreground">
        <FaSearch className="text-light-foreground" />
      </button>
    </form>
  );
}
export default SearchBar;