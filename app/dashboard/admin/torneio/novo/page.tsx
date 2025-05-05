import { getAllTeams } from "../../equipa/page";
import CriarTorneioForm from "@/app/components/CriarTorneioForm";

const CriarTorneioRoute = async () => {
  const teams = await getAllTeams();
  return (
    <CriarTorneioForm
      formTile="Novo Torneio"
      defaultData={undefined}
      equipas={teams}
    />
  );
};

export default CriarTorneioRoute;
