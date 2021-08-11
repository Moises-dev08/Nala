import React, { useState } from "react";
import DataTable from "react-data-table-component";
import ChartScreen from "../screen/ChartScreen";
import {
  sum,
  filterData,
  filterPreviuosData,
  employeesPromotions,
} from "../helperFunctions";
import XLSX from "xlsx";

import "../styles.css";

const HomeComponent = () => {
  const [fileData, setFileData] = useState(undefined);
  const [columns, setColumns] = useState([]);
  const [searchText, setSearchText] = useState([]);
  const [data, setData] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [newWorker, setNewWorker] = useState([]);
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
      const filteredByMonth = filterData(searchTextEvent, fileData);
      const previousSalary = filterPreviuosData(searchTextEvent, fileData);
      const newPromotion = employeesPromotions(filteredByMonth, previousSalary);
      setPromotions(newPromotion);
      setData(filteredByMonth);
      //---- segun el mes seleccionado mostramos distintos detalles de ese mes --//
      showMonthDetails(filteredByMonth);
    } else {
      //--- limpiamos el search input box ---//
      clearInput();
    }
  };

  const clearInput = () => {
    //---- seteamos las variables a su inital state ---//
    setSearchText("");
    setTotalPayments(0);
    setPromotions([]);
    setNewWorker([]);

    //--- seteamos para tener la data orignial en la tabla de datos ---//
    setData(fileData);
  };

  const showMonthDetails = (filteredByMonth) => {
    //--- obtenemos el total de salarios ---//
    const salaryArray = filteredByMonth.map((value) => {
      const salaryProp = `Sueldo  bruto`;
      return parseInt(value[salaryProp]);
    });

    const salaryResult = sum(salaryArray);

    setTotalPayments(salaryResult);

    //--- verificamos si hay un nuevo empleado en la empresa ---//
    const newEmployee = filteredByMonth.map((value) => {
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

  //---- manejamos el boton para que cambie de funcion al hacer click ----//
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
      <div className="home__fileInput">
        <input type="file" accept=".xlsx" onChange={handleUpload} />
      </div>

      {fileData && showTable && (
        <div>
          <div className="home__buttonContainer">
            <button onClick={() => displaySection()}>Ver Organigrama</button>
          </div>
          <div className="home__search">
            <h4 className="home__searchTitle">Buscar mes</h4>
            <input
              className="home__searchInput"
              type="text"
              onChange={(e) => handleSearchInput(e)}
            />
          </div>

          <div className="home__options">
            <h4>Total pagado del mes: $ {totalPayments}</h4>
            <div className="home__promotions">
              <h4>Aumento de sueldo: </h4>
              <div className="home__promotionsList">
                {promotions.map((person) => (
                  <h5>{person}</h5>
                ))}
              </div>
            </div>
            <div className="home__newEmployee">
              <h4>Nuevo empleado/a: </h4>
              <h5> {newWorker}</h5>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={data}
            pagination
            paginationComponentOptions={paginationsOptions}
            fixedHeader
            fixedHeaderScrollHeight="600px"
            highlightOnHover
          />
        </div>
      )}

      {showChart && (
        <>
          <div className="home__buttonContainer">
            <button onClick={() => displaySection()}>Ver tabla de datos</button>
          </div>
          <div className="home__chart">
            <ChartScreen data={fileData} />
          </div>
        </>
      )}
    </>
  );
};

export default HomeComponent;
