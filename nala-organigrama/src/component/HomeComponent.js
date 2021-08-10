import React, { useState } from "react";
import DataTable from "react-data-table-component";
import ChartScreen from "../screen/ChartScreen";
import { sum } from "../helperFunctions";
import XLSX from "xlsx";

import "../styles.css";

const HomeComponent = () => {
  const [fileData, setFileData] = useState(undefined);
  const [columns, setColumns] = useState([]);
  const [searchText, setSearchText] = useState([]);
  const [data, setData] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [newWorker, setNewWorker] = useState("-");
  const [showTable, setShowTable] = useState(true);
  const [showChart, setShowChart] = useState(false);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        let data = e.target.result;
        let workbook = XLSX.read(data, { type: "binary" });
        let first_sheet_name = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[first_sheet_name];
        let jsonObj = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        const array = Object.values(jsonObj);
        setFileData(array);
        setData(array);

        const getKeys = array[0];
        const keys = Object.keys(getKeys);
        const columns = keys.map((key) => {
          return {
            name: key,
            selector: key,
            sortable: true,
          };
        });

        setColumns(columns);
      };
    }
  };

  const handleSearchInput = (e) => {
    let searchTextEvent = e.nativeEvent.data;
    setSearchText(searchTextEvent);

    if (searchTextEvent !== null) {
      filterData(searchTextEvent, fileData);
    } else {
      //--- cuando esta vacio el input le mostramos el array de datos --///
      clearInput();
    }
  };

  const clearInput = () => {
    setSearchText("");
    setTotalPayments(0);
    setData(fileData);
    setNewWorker("-");
  };

  //--- filtramos segun el nombre que se escribe en el input --//
  const filterData = (searchTextEvent, fileData) => {
    let filteredByMonth = fileData.filter((data) => {
      return data.Mes.slice(0, 1) === searchTextEvent;
    });

    setData(filteredByMonth);
    showMonthDetails(filteredByMonth);
  };

  const showMonthDetails = (filteredByMonth) => {
    //--- obtain total months payments ---//
    const salaryArray = filteredByMonth.map((value) => {
      const property = `Sueldo  bruto`;
      return parseInt(value[property]);
    });

    const salaryResult = sum(salaryArray);

    setTotalPayments(salaryResult);

    //--- see if there is a new employee in the company for the current month ---//
    const allEmployees = filteredByMonth.map((value) => {
      const entryDate = `Fecha de ingreso`;
      const currentDate = `Mes`;
      const name = `Nombre `;

      const entryDateArray = value[entryDate].split("/");
      const currentDateArray = value[currentDate].split("-");
      const entryMonth = entryDateArray[1];
      const entryYear = entryDateArray[2];

      const currentMonth = currentDateArray[0];
      const currentYear = currentDateArray[1];

      let currentMonthModified = [];
      if (currentMonth.length === 1) {
        currentMonthModified = 0 + currentMonth;
      }

      if (currentMonthModified.length > 0) {
        if (entryMonth === currentMonthModified && entryYear === currentYear) {
          setNewWorker(value[name]);
        }
      }
      if (currentMonthModified.length === 0) {
        if (entryMonth === currentMonth && entryYear === currentYear) {
          setNewWorker(value[name]);
        }
      }
    });
  };

  const displaySection = () => {
    setShowTable(!showTable);
    setShowChart(!showChart);
  };

  const paginationsOptions = {
    rowsPerPageText: "Filas por Pagina",
    rangeSeparatorText: "de",
    selectAllRowsItem: true,
    selectAllRowsItemText: "Todos",
  };

  return (
    <>
      <div className="home__fileInput"></div>
      <input type="file" accept=".xlsx" onChange={handleUpload} />
      {fileData && showTable && (
        <>
          <button className="home__button" onClick={() => displaySection()}>
            Ver Organigrama
          </button>
          <div className="home__options">
            <h4>Buscar mes</h4>
            <input type="text" onChange={(e) => handleSearchInput(e)} />
            <h4>Total pagado del mes: $ {totalPayments}</h4>
            <h4>Aumento de sueldo a : {promotions ? promotions : "-"}</h4>
            <h4>Nuevo empleado/a: {newWorker ? newWorker : "-"}</h4>
          </div>
          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationComponentOptions={paginationsOptions}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            highlightOnHover
            title="Datos:"
          />
        </>
      )}
      {showChart && (
        <>
          <button className="home__button" onClick={() => displaySection()}>
            Ver tabla de datos
          </button>
          <ChartScreen data={fileData} />
        </>
      )}
    </>
  );
};

export default HomeComponent;
