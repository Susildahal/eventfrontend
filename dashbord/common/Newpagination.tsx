import React from "react"

interface PaginationProps {
  total: number
  limit?: number
  currentPage?: number
  onPageChange?: (page: number) => void
}

const NewPagination: React.FC<PaginationProps> = ({
  total,
  limit = 10,
  currentPage = 1,
  onPageChange = () => {},
}) => {
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) onPageChange(page)
  }

  const renderPages = () => {
    const pages = []
    const max = 5

    let start = Math.max(1, currentPage - Math.floor(max / 2))
    let end = Math.min(totalPages, start + max - 1)

    if (end - start + 1 < max) {
      start = Math.max(1, end - max + 1)
    }

    for (let i = start; i <= end; i++) {
      const isActive = currentPage === i

      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md text-sm transition-colors
            ${
              isActive
                ? "bg-[#7A5E39] text-white"
                : "border border-[#7A5E39]/40 text-[#7A5E39] hover:bg-[#7A5E39]/10"
            }
          `}
        >
          {i}
        </button>
      )
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
      {/* Prev */}


      <p> Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} entries</p>
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className={`px-3 py-1 rounded-md border text-sm transition-colors
          ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "border-[#7A5E39]/40 text-[#7A5E39] hover:bg-[#7A5E39]/10"
          }
        `}
      >
        Prev
      </button>

      {renderPages()}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`px-3 py-1 rounded-md border text-sm transition-colors
          ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "border-[#7A5E39]/40 text-[#7A5E39] hover:bg-[#7A5E39]/10"
          }
        `}
      >
        Next
      </button>
    </div>
  )
}

export default NewPagination
