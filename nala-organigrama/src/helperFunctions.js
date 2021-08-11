//--- funcion para sumar valores de un array ---//
export const sum = (array) => {
  if (array.length > 0) {
    const reducer = (accumulator, current) => {
      return accumulator + current;
    };
    let total = array.reduce(reducer);

    return total;
  }
};

export const getTeamArray = (data, subAreaName) => {
  const arrayTeam = data.map((prop) => {
    const subAreaProp = `Subarea`;
    const nameProp = `Nombre `;
    let team = [];

    if (prop[subAreaProp] === `${subAreaName}`) team = prop[nameProp];

    if (!Array.isArray(team)) {
      return team;
    }
  });

  const uniqueset = new Set(arrayTeam);

  const backToArray = [...uniqueset];
  const teamArray = backToArray.filter((prop) => {
    return prop !== undefined;
  });
  return teamArray;
};

//--- filtramos segun el nombre que se escribe en el input --//
export const filterData = (searchTextEvent, fileData) => {
  return fileData.filter((data) => {
    return data.Mes.slice(0, 1) === searchTextEvent;
  });
};

//--- usamos el mes que se busca en el input search y le restamos 1 para obtener el dato del mes anterior --//
export const filterPreviuosData = (searchTextEvent, fileData) => {
  return fileData.filter((data) => {
    const previousMonth = searchTextEvent - 1;
    return parseInt(data.Mes.slice(0, 1)) === previousMonth;
  });
};

//--- comparamos el mes seleccionado en el input con el mes anterior para ver si hay diferencia de sueldo ---//

export const employeesPromotions = (selectedMonth, previousMonth) => {
  const compare = (month) => {
    return previousMonth.filter((prevMonth) => {
      const salaryProp = `Sueldo  bruto`;
      const nameProp = `Nombre `;

      return (
        month[nameProp] === prevMonth[nameProp] &&
        month[salaryProp] !== prevMonth[salaryProp]
      );
    });
  };
  const result = selectedMonth.map((month) => {
    return compare(month);
  });

  return result.flat().map((name) => {
    const nameProp = `Nombre `;
    return name[nameProp];
  });
};
