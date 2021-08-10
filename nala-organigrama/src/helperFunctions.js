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
