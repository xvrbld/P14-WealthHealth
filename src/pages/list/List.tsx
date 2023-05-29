import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTable, Column, useSortBy } from "react-table";
import styles from "./List.module.scss";

type EmployeeData = {
  dateOfBirth: string;
  startDate: string;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  department: string;
};

function List() {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Retrieve employee data from local storage
    const storedData = localStorage.getItem("employeeData");
    if (storedData) {
      const parsedData: EmployeeData[] = JSON.parse(storedData);
      if (Array.isArray(parsedData)) {
        const formattedData = parsedData.map((employee) => ({
          ...employee,
          dateOfBirth: new Date(employee.dateOfBirth).toLocaleDateString(),
          startDate: new Date(employee.startDate).toLocaleDateString(),
        }));
        setEmployeeData(formattedData);
      } else {
        console.error("Employee data is not an array.");
      }
    }
  }, []);

  const columns: Column<EmployeeData>[] = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Start Date",
        accessor: "startDate",
      },
      {
        Header: "Department",
        accessor: "department",
      },
      {
        Header: "Date of Birth",
        accessor: "dateOfBirth",
      },
      {
        Header: "Street",
        accessor: (row) => row.address?.street,
      },
      {
        Header: "City",
        accessor: (row) => row.address?.city,
      },
      {
        Header: "State",
        accessor: (row) => row.address?.state,
      },
      {
        Header: "Zip Code",
        accessor: (row) => row.address?.zipCode,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<EmployeeData>({ columns, data: employeeData }, useSortBy);

  const indexOfLastRow = currentPage * entriesPerPage;
  const indexOfFirstRow = indexOfLastRow - entriesPerPage;

  const filteredRows = rows.filter((row) =>
    Object.values(row.original)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const handleEntriesPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when changing the number of entries per page
  };

  const totalPages = Math.ceil(filteredRows.length / entriesPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () =>
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className={styles.list}>
      <div id="employee-div" className={styles.container}>
        <h1>Current Employees</h1>

        <div className={styles.filterContainer}>
          <label htmlFor="entriesPerPage" className={styles.select}>
            Show{" "}
            <select
              id="entriesPerPage"
              name="entriesPerPage"
              value={entriesPerPage}
              onChange={handleEntriesPerPageChange}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>{" "}
            entries
          </label>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <table {...getTableProps()} className={styles.display}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const columnWithSort = column as any;
                  return (
                    <th
                      {...column.getHeaderProps(
                        columnWithSort.getSortByToggleProps()
                      )}
                    >
                      {column.render("Header")}
                      <span>
                        {columnWithSort.isSorted
                          ? columnWithSort.isSortedDesc
                            ? " 🔽"
                            : "🔼"
                          : ""}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {currentRows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
        <div className={styles.tableFooter}>
          <div className={styles.showing}>
            Showing {currentRows.length} entries of {rows.length} rows
          </div>
          {/* Pagination buttons */}
          <div className={styles.pagination}>
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className={currentPage === 1 ? styles.disabled : ""}
            >
              ⏪
            </button>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={currentPage === 1 ? styles.disabled : ""}
            >
              ◀️
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? styles.disabled : ""}
            >
              ▶️
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className={currentPage === totalPages ? styles.disabled : ""}
            >
              ⏩
            </button>
          </div>
        </div>
      </div>
      <Link to="/">Home</Link>
    </div>
  );
}

export default List;
