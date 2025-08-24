import { useState } from "react"

export default function Component({ currentPage, setCurrentPage, totalPages }) {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  return (
    <div className="flex items-center gap-4 justify-center mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Anterior
      </button>
      <section>
        <ol className="flex gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`${currentPage === page ? "bg-green-500" : ""} rounded-md transition-colors`}>
              <button
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${currentPage === page ? "text-white" : "bg-gray-200 text-gray-800"} transition-colors hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500`}
              >
                {page}
              </button>
            </li>
          ))}
        </ol>
      </section>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-md bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  )
}
