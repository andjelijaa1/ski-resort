import Spinner from "@/components/Spinner";
import { EquipmentDataTable } from "@/features/admin/EquipmentDataTable";
import { getAllEq } from "@/service/apiAdmin";
import type { Equipment } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const Equipment = () => {
  const { data, isPending } = useQuery<{ equipment: Equipment[] }>({
    queryKey: ["equipment"],
    queryFn: getAllEq,
  });
  return isPending ? (
    <Spinner />
  ) : (
    <EquipmentDataTable data={data?.equipment} />
  );
};

export default Equipment;
