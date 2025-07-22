"use client";

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axiosInstance from "@/app/axiosInstance";

interface SearchInterface<T> {
  groupId?: string;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  originalItems: T[];
}

const SearchBar = <T,>( { groupId, setItems, originalItems }: SearchInterface<T> ) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
    if (value === "") {
      setItems(originalItems);
    }
  }
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // If the search input is empty, display the groups/sheets
    if (search.trim() === "") {
      setItems(originalItems);
      return;
    }
    try {
      const res = groupId 
        ? await axiosInstance.get(`/search/sheets/${groupId}?q=${search}`)
        : await axiosInstance.get(`/groups/search?q=${search}`);
      setItems(res.data.results);
    }
    catch (error) {
      console.error(error);
    }
  }
  return (
    <form
      method="GET"
      onSubmit={handleSearch}
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => search === "" && setIsExpanded(false)}
    >
      <input
        type="search"
        onChange={handleChange}
        placeholder={groupId ? `Search sheets...` : "Search groups..."}
        className={`hover-animation border-1 py-2 pr-10 pl-4 rounded-full text-dark-support bg-background border-light-foreground focus:outline-none focus:ring-1 focus:ring-foreground 
          [&::-webkit-search-cancel-button]:filter [&::-webkit-search-cancel-button]:brightness-70 [&::-webkit-search-cancel-button]:cursor-pointer
          ${isExpanded ? 'w-72 sm:w-48 lg:w-100 opacity-100' : 'w-0 opacity-0'}`
        }
      />
      <button type="submit" className="hover:cursor-pointer bg-nav p-3 absolute right-0 border-1 border-light-foreground rounded-full top-1/2 transform -translate-y-1/2 text-light-foreground">
        <FaSearch className="text-light-foreground" />
      </button>
    </form>
  );
}
export default SearchBar;