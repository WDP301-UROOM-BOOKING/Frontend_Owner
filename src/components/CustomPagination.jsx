import { useMemo } from "react"
import { Pagination } from "react-bootstrap"
import "./CustomPagination" // We'll create this CSS file



const CustomPagination= ({ activePage, totalPages, onPageChange }) => {
  const visiblePages = useMemo(() => {
    // Show 5 pages at most (including current page)
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, activePage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }, [activePage, totalPages])

  if (totalPages <= 1) return null

  return (
    <div className="custom-pagination-container">
      <Pagination className="custom-pagination">
        <Pagination.Prev
          onClick={() => onPageChange(Math.max(1, activePage - 1))}
          disabled={activePage === 1}
          className="pagination-nav-item"
        />

        {visiblePages.map((page) => (
          <Pagination.Item
            key={page}
            active={page === activePage}
            onClick={() => onPageChange(page)}
            className={page === activePage ? "active-page" : "pagination-page"}
          >
            {page}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={() => onPageChange(Math.min(totalPages, activePage + 1))}
          disabled={activePage === totalPages}
          className="pagination-nav-item"
        />
      </Pagination>
    </div>
  )
}

export default CustomPagination
