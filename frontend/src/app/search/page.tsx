"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaBook } from "react-icons/fa";
import { IoIosDocument } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";

interface SearchResults {
  groups: Array<{id: number, name: string, color: string, sheet_count: number}>;
  sheets: Array<{id: number, name: string, color: string, group_names: string[]}>;
  events: Array<{id: number, summary: string, sheet_id: number, group_id: number, sheet_name: string, sheet_color: string}>;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const resultsParam = searchParams.get("results");
  const [results, setResults] = useState<SearchResults>({ groups: [], sheets: [], events: [] });

  useEffect(() => {
    if (resultsParam) {
      try {
        const parsedResults = JSON.parse(decodeURIComponent(resultsParam));
        setResults(parsedResults);
      } catch (error) {
        console.error("Failed to parse results:", error);
      }
    }
  }, [resultsParam]);

  const totalResults = results.groups.length + results.sheets.length + results.events.length;

  return (
    <main className="page-container">
      <h1 className="page-title">Search Results for "{query}"</h1>
      <p className="text-gray-600 mb-6">{totalResults} results found</p>

      {results.groups.length > 0 && (
        <section className="search-section">
          <h2 className="search-section-title">Groups</h2>
          <div className="search-results-list">
            {results.groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="search-result-item"
              >
                <div className="search-result-content">
                  <FaBook color={group.color} size={25} />
                  <span className="search-result-name">{group.name}</span>
                  <span className="search-result-meta">{group.sheet_count} sheets</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.sheets.length > 0 && (
        <section className="search-section">
          <h2 className="search-section-title">Sheets</h2>
          <div className="search-results-list">
            {results.sheets.map((sheet) => (
              <Link
                key={sheet.id}
                href={`/groups/1/sheets/${sheet.id}`}
                className="search-result-item"
              >
                <div className="search-result-content">
                  <IoIosDocument color={sheet.color} size={25} />
                  <span className="search-result-name">{sheet.name}</span>
                  <span className="search-result-meta">in {sheet.group_names.join(", ")}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.events.length > 0 && (
        <section className="search-section">
          <h2 className="search-section-title">Events</h2>
          <div className="search-results-list">
            {results.events.map((event) => (
              <Link
                key={event.id}
                href={`/groups/${event.group_id}/sheets/${event.sheet_id}`}
                className="search-result-item"
              >
                <div className="search-result-content">
                  <FaBookmark color={event.sheet_color} size={25} />
                  <span className="search-result-name">{event.summary}</span>
                  <span className="search-result-meta">from {event.sheet_name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {totalResults === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">No results found for "{query}"</p>
          <p className="text-gray-400 mt-2">Try searching with different keywords</p>
        </div>
      )}
    </main>
  );
};

export default SearchPage;