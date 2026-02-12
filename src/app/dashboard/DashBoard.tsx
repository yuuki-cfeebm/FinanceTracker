import Expenses from "./Expenses";
import { PieExample } from "./PieChart";
import Summary from "./Summary";

export default function DashBoard() {
  return(
    <div className="grid grid-cols-3 grid-rows-5 gap-4 h-150">
      <div className="col-span-1 row-span-2 p-2 rounded-xl border border-gray-500">
        <Expenses />
      </div>
      <div className="col-span-2 row-span-5 p-2 rounded-xl border border-gray-500">
        <Summary />
        <PieExample />
      </div>
      
      <div className="col-span-1 row-span-2 p-2 rounded-xl border border-gray-500">
        lucro
      </div>
      <div className="col-span-1 row-span-1 p-2 rounded-xl border border-gray-500">
        
      </div>
      
    </div>
  )
}