import React from "react";

interface PaginationProps {
  total: number;         // total items
  limit?: number;        // items per page (default 10)
  currentPage?: number;  // current page (default 1)
  onPageChange?: (page: number) => void;
}

const  NewPagination: React.FC<PaginationProps> = ({
  total,
  limit = 10,
  currentPage = 1,
  onPageChange = () => {}
}) => {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
  };

  const renderPages = () => {
    const pages = [];
    const max = 5;

    let start = Math.max(1, currentPage - Math.floor(max / 2));
    let end = Math.min(totalPages, start + max - 1);

    if (end - start + 1 < max) {
      start = Math.max(1, end - max + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-1 rounded ${
            currentPage === i ? "bg-blue-500 text-white" : "border"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">

      {/* Prev */}
      <button
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded ${currentPage === 1 ? "opacity-50" : ""}`}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Prev
      </button>

      {renderPages()}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded ${currentPage === totalPages ? "opacity-50" : ""}`}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default NewPagination;
