import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { getTeamArray } from "../helperFunctions";

const ChartComponent = ({ data }) => {
  const [digitalTeam, setDigitalTeam] = useState([]);
  const [editorialTeam, setEditorialTeam] = useState([]);
  const [regionalTeam, setRegionalTeam] = useState([]);
  const [clientsTeam, setClientsTeam] = useState([]);

  useEffect(() => {
    displayTeams();
  }, []);

  const displayTeams = () => {
    const digitalArray = getTeamArray(data, "Digital");
    const editorialArray = getTeamArray(data, "Editorial");
    const regionalArray = getTeamArray(data, "Regional");
    const clientArray = getTeamArray(data, "Clientes");

    setDigitalTeam(digitalArray);
    setEditorialTeam(editorialArray);
    setRegionalTeam(regionalArray);
    setClientsTeam(clientArray);
  };

  return (
    <>
      <Tree label={<div>Organización</div>}>
        <TreeNode label={<div>Ventas</div>}>
          <TreeNode label={<div>Marketing </div>}>
            <TreeNode label={<div>Digital</div>}>
              {digitalTeam.map((person) => (
                <TreeNode label={<div>Colaborador: {person}</div>} />
              ))}
            </TreeNode>
            <TreeNode label={<div>Editorial</div>}>
              {editorialTeam.map((person) => (
                <TreeNode label={<div>Colaborador: {person}</div>} />
              ))}
            </TreeNode>
          </TreeNode>
          <TreeNode label={<div>Regional</div>}>
            <TreeNode label={<div>Regional</div>}>
              {regionalTeam.map((person) => (
                <TreeNode label={<div>Colaborador: {person}</div>} />
              ))}
            </TreeNode>
          </TreeNode>
        </TreeNode>
        <TreeNode label={<div>Operaciones</div>}>
          <TreeNode label={<div>Soporte</div>}>
            <TreeNode label={<div>Clientes</div>}>
              {clientsTeam.map((person) => (
                <TreeNode label={<div>Colaborador: {person}</div>} />
              ))}
            </TreeNode>
          </TreeNode>
        </TreeNode>
      </Tree>
    </>
  );
};

export default ChartComponent;
