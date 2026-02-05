import { PieExample } from "./PieChart";

export default function DashBoard() {
  return(
    <div className="grid grid-cols-3 grid-rows-2 gap-4">
      <div className="col-span-1 row-span-1 bg-gray-200">
        custos
      </div>
      <div className="col-span-2 row-span-2 bg-gray-200">
        <PieExample />
      </div>
      <div className="col-span-1 row-span-1 bg-gray-200">
        lucro
      </div>
      
    </div>
  )
}